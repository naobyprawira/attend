"""Auth endpoints — Phase 1 Sprint 1.

POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/me
"""

import logging

from fastapi import APIRouter, Depends, HTTPException

from server.core.auth import (
    create_access_token,
    create_refresh_token,
    is_refresh_token_expired,
    verify_password,
)
from server.core.deps import require_auth
from server.db.crud.users import (
    delete_refresh_token,
    get_refresh_token,
    get_user_by_id,
    get_user_by_username,
    save_refresh_token,
    update_last_login,
)
from server.schemas.auth import AuthUser, LoginRequest, RefreshRequest, TokenResponse

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest):
    user = await get_user_by_username(body.username)
    if not user or not verify_password(body.password, user["hashed_password"]):
        raise HTTPException(401, detail={"code": "INVALID_CREDENTIALS", "message": "Invalid username or password"})

    access_token, expires_in = create_access_token(user["id"], user["username"], user["role"])
    refresh_token, expires_at = create_refresh_token()
    await save_refresh_token(user["id"], refresh_token, expires_at)
    await update_last_login(user["id"])

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
async def refresh(body: RefreshRequest):
    record = await get_refresh_token(body.refresh_token)
    if not record:
        raise HTTPException(401, detail={"code": "INVALID_TOKEN", "message": "Refresh token not found"})
    if is_refresh_token_expired(record["expires_at"]):
        await delete_refresh_token(body.refresh_token)
        raise HTTPException(401, detail={"code": "TOKEN_EXPIRED", "message": "Refresh token expired"})

    user = await get_user_by_id(record["user_id"])
    if not user:
        raise HTTPException(401, detail={"code": "USER_NOT_FOUND", "message": "User not found"})

    access_token, expires_in = create_access_token(user["id"], user["username"], user["role"])
    return {"access_token": access_token, "expires_in": expires_in}


@router.post("/logout")
async def logout(body: RefreshRequest):
    await delete_refresh_token(body.refresh_token)
    return {"status": "ok"}


@router.get("/me", response_model=AuthUser)
async def me(current_user: dict = Depends(require_auth)):
    user = await get_user_by_id(current_user["user_id"])
    if not user:
        raise HTTPException(404, detail={"code": "USER_NOT_FOUND", "message": "User not found"})
    return AuthUser(
        id=user["id"],
        username=user["username"],
        email=user["email"],
        role=user["role"],
    )
