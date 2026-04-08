"""FastAPI dependency functions."""

from fastapi import Depends, Header, HTTPException, Request
from jose import JWTError

from server.core.auth import decode_access_token
from server.config import ATTEND_API_KEY


async def require_auth(authorization: str | None = Header(default=None)) -> dict:
    """Verify JWT Bearer token. Raises 401 if missing or invalid."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            401,
            detail={"code": "UNAUTHENTICATED", "message": "Authorization header missing or invalid"},
        )
    token = authorization.removeprefix("Bearer ")
    try:
        payload = decode_access_token(token)
    except JWTError:
        raise HTTPException(
            401,
            detail={"code": "INVALID_TOKEN", "message": "Token is invalid or expired"},
        )
    return {"user_id": int(payload["sub"]), "username": payload["username"], "role": payload["role"]}


async def require_api_key(
    request: Request,
    x_api_key: str | None = Header(default=None),
) -> None:
    """Require a valid internal API key for service-to-service endpoints."""
    provided_key = x_api_key or request.headers.get("X-API-Key") or request.headers.get("x-api-key")

    if not ATTEND_API_KEY:
        raise HTTPException(
            500,
            detail={"code": "API_KEY_NOT_CONFIGURED", "message": "ATTEND_API_KEY is not configured"},
        )
    normalized_provided = (provided_key or "").strip()
    normalized_expected = ATTEND_API_KEY.strip()
    if normalized_provided != normalized_expected:
        raise HTTPException(
            401,
            detail={"code": "INVALID_API_KEY", "message": "X-API-Key is missing or invalid"},
        )


ADMIN_ROLES = {"admin", "super_admin"}


async def require_admin(current_user: dict = Depends(require_auth)) -> dict:
    """Require admin or super_admin role."""
    if current_user["role"] not in ADMIN_ROLES:
        raise HTTPException(
            403,
            detail={"code": "FORBIDDEN", "message": "Admin access required"},
        )
    return current_user


async def require_super_admin(current_user: dict = Depends(require_auth)) -> dict:
    """Require super_admin role."""
    if current_user["role"] != "super_admin":
        raise HTTPException(
            403,
            detail={"code": "FORBIDDEN", "message": "Super admin access required"},
        )
    return current_user
