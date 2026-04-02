"""Auth endpoints — Phase 1 Sprint 1.

POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/me
POST /api/auth/request-access
"""

import asyncio
import logging

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status

from server.core.auth import (
    create_access_token,
    create_refresh_token,
    hash_password,
    is_refresh_token_expired,
    verify_password,
)
from server.core.deps import require_auth
from server.db.crud.users import (
    create_user,
    delete_refresh_token,
    get_refresh_token,
    get_user_by_email_any,
    get_user_by_id,
    get_user_by_username_any,
    save_refresh_token,
    update_last_login,
)
from server.schemas.auth import AuthUser, LoginRequest, RefreshRequest, RequestAccessRequest, TokenResponse

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest, response: Response):
    # Look up user regardless of status to give meaningful errors
    user = await get_user_by_username_any(body.username)

    if not user:
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            detail={"code": "INVALID_CREDENTIALS", "message": "Invalid username or password"},
        )

    if not verify_password(body.password, user["hashed_password"]):
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            detail={"code": "INVALID_CREDENTIALS", "message": "Invalid username or password"},
        )

    if user["status"] != "active":
        raise HTTPException(
            status.HTTP_403_FORBIDDEN,
            detail={"code": "ACCOUNT_INACTIVE", "message": "Account inactive"},
        )

    access_token, expires_in = create_access_token(user["id"], user["username"], user["role"])
    refresh_token, expires_at = create_refresh_token()

    # Parallel fire-and-forget DB writes
    await asyncio.gather(
        save_refresh_token(user["id"], refresh_token, expires_at),
        update_last_login(user["id"]),
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        samesite="lax",
        max_age=30 * 24 * 60 * 60,  # 30 days
    )

    logger.info("User logged in: %s", user["username"])
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=expires_in,
        user=AuthUser(
            id=user["id"],
            username=user["username"],
            email=user["email"],
            role=user["role"],
        ),
    )


@router.post("/refresh")
async def refresh(request: Request, body: RefreshRequest | None = None):
    # Accept token from body OR cookie (cookie-only sent by frontend on page reload)
    token = (body.refresh_token if body else None) or request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            detail={"code": "INVALID_TOKEN", "message": "Refresh token missing"},
        )

    record = await get_refresh_token(token)
    if not record:
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            detail={"code": "INVALID_TOKEN", "message": "Refresh token not found"},
        )
    if is_refresh_token_expired(record["expires_at"]):
        await delete_refresh_token(token)
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            detail={"code": "TOKEN_EXPIRED", "message": "Refresh token expired"},
        )

    user = await get_user_by_id(record["user_id"])
    if not user:
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            detail={"code": "USER_NOT_FOUND", "message": "User not found"},
        )

    access_token, expires_in = create_access_token(user["id"], user["username"], user["role"])
    return {
        "access_token": access_token,
        "expires_in": expires_in,
        "user": {"id": user["id"], "username": user["username"], "email": user["email"], "role": user["role"]},
    }


@router.post("/logout")
async def logout(request: Request, response: Response, body: RefreshRequest | None = None):
    token = (body.refresh_token if body else None) or request.cookies.get("refresh_token")
    if token:
        await delete_refresh_token(token)
    response.delete_cookie(key="refresh_token")
    return {"status": "ok"}


@router.get("/me", response_model=AuthUser)
async def me(current_user: dict = Depends(require_auth)):
    user = await get_user_by_id(current_user["user_id"])
    if not user:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail={"code": "USER_NOT_FOUND", "message": "User not found"},
        )
    return AuthUser(
        id=user["id"],
        username=user["username"],
        email=user["email"],
        role=user["role"],
    )


@router.post("/request-access", status_code=status.HTTP_201_CREATED)
async def request_access(body: RequestAccessRequest):
    """Public endpoint — create a pending account that admin must approve."""
    existing_username, existing_email = await asyncio.gather(
        get_user_by_username_any(body.username),
        get_user_by_email_any(body.email),
    )
    if existing_username:
        raise HTTPException(status.HTTP_409_CONFLICT, detail={"code": "DUPLICATE_USERNAME", "message": "Username already taken"})
    if existing_email:
        raise HTTPException(status.HTTP_409_CONFLICT, detail={"code": "DUPLICATE_EMAIL", "message": "Email already registered"})

    await create_user(
        username=body.username,
        email=body.email,
        hashed_password=hash_password(body.password),
        role="operator",
        status="pending",
    )
    logger.info("Access request submitted for: %s", body.username)
    return {"message": "Access request submitted. An admin will review it shortly."}
