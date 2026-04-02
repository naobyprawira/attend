"""CRUD operations for users and refresh tokens."""

import logging
from datetime import datetime, timezone

from sqlalchemy import delete, func, select, update

from server.models import RefreshToken, User
from server.db.session import get_session

logger = logging.getLogger(__name__)


def _user_to_dict(user: User) -> dict:
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "hashed_password": user.hashed_password,
        "role": user.role,
        "status": user.status,
        "last_login": user.last_login,
        "created_at": user.created_at,
    }


async def get_user_by_username(username: str) -> dict | None:
    async with get_session() as session:
        result = await session.execute(
            select(User).where(User.username == username, User.status == "active")
        )
        user = result.scalar_one_or_none()
    return _user_to_dict(user) if user else None


async def get_user_by_id(user_id: int) -> dict | None:
    """Fetch active user by ID."""
    async with get_session() as session:
        result = await session.execute(
            select(User).where(User.id == user_id, User.status == "active")
        )
        user = result.scalar_one_or_none()
    return _user_to_dict(user) if user else None


async def get_user_by_id_any(user_id: int) -> dict | None:
    """Fetch user by ID regardless of status (for admin operations)."""
    async with get_session() as session:
        result = await session.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
    return _user_to_dict(user) if user else None


async def create_user(
    username: str, email: str, hashed_password: str, role: str = "operator", status: str = "active"
) -> dict:
    now = datetime.now(timezone.utc).isoformat()
    async with get_session() as session:
        user = User(
            username=username,
            email=email,
            hashed_password=hashed_password,
            role=role,
            status=status,
            created_at=now,
        )
        session.add(user)
        await session.commit()
        await session.refresh(user)
        return _user_to_dict(user)


async def get_all_users() -> list[dict]:
    """Return all users regardless of status (admin view)."""
    async with get_session() as session:
        result = await session.execute(select(User).order_by(User.created_at.desc()))
        users = result.scalars().all()
    return [_user_to_dict(u) for u in users]


async def get_user_by_username_any(username: str) -> dict | None:
    """Fetch user by username regardless of status (for duplicate checks)."""
    async with get_session() as session:
        result = await session.execute(select(User).where(User.username == username))
        user = result.scalar_one_or_none()
    return _user_to_dict(user) if user else None


async def get_user_by_email_any(email: str) -> dict | None:
    """Fetch user by email regardless of status (for duplicate checks)."""
    async with get_session() as session:
        result = await session.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
    return _user_to_dict(user) if user else None


async def update_user(user_id: int, **fields) -> dict | None:
    """Update arbitrary fields on a user. Returns updated user dict or None."""
    if not fields:
        return await get_user_by_id(user_id)
    async with get_session() as session:
        await session.execute(update(User).where(User.id == user_id).values(**fields))
        await session.commit()
        result = await session.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
    return _user_to_dict(user) if user else None


async def delete_user(user_id: int) -> None:
    """Hard-delete a user (refresh tokens cascade-delete via FK)."""
    async with get_session() as session:
        await session.execute(delete(User).where(User.id == user_id))
        await session.commit()


async def update_last_login(user_id: int) -> None:
    async with get_session() as session:
        await session.execute(
            update(User)
            .where(User.id == user_id)
            .values(last_login=datetime.now(timezone.utc).isoformat())
        )
        await session.commit()


async def user_exists() -> bool:
    """Check if any user exists in the DB (for first-run seeding)."""
    async with get_session() as session:
        result = await session.execute(select(func.count()).select_from(User))
        return result.scalar_one() > 0


# ── Refresh Tokens ────────────────────────────────────────────


async def save_refresh_token(user_id: int, token: str, expires_at: str) -> None:
    now = datetime.now(timezone.utc).isoformat()
    async with get_session() as session:
        rt = RefreshToken(
            user_id=user_id,
            token=token,
            expires_at=expires_at,
            created_at=now,
        )
        session.add(rt)
        await session.commit()


async def get_refresh_token(token: str) -> dict | None:
    async with get_session() as session:
        result = await session.execute(
            select(RefreshToken).where(RefreshToken.token == token)
        )
        rt = result.scalar_one_or_none()
    if not rt:
        return None
    return {
        "id": rt.id,
        "user_id": rt.user_id,
        "token": rt.token,
        "expires_at": rt.expires_at,
        "created_at": rt.created_at,
    }


async def delete_refresh_token(token: str) -> None:
    async with get_session() as session:
        await session.execute(
            delete(RefreshToken).where(RefreshToken.token == token)
        )
        await session.commit()


async def delete_expired_refresh_tokens() -> None:
    now = datetime.now(timezone.utc).isoformat()
    async with get_session() as session:
        await session.execute(
            delete(RefreshToken).where(RefreshToken.expires_at < now)
        )
        await session.commit()
