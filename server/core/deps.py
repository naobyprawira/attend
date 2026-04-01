"""FastAPI dependency functions."""

from fastapi import Header, HTTPException
from jose import JWTError

from server.core.auth import decode_access_token


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
