"""User management endpoints — admin only.

GET    /api/users       list all users
POST   /api/users       create a user
PUT    /api/users/{id}  update role / status
DELETE /api/users/{id}  delete a user
"""

import asyncio
import logging

from fastapi import APIRouter, Depends, HTTPException, status

from server.core.auth import hash_password
from server.core.deps import require_admin
from server.db.crud.users import (
    create_user,
    delete_user,
    get_all_users,
    get_user_by_email_any,
    get_user_by_id_any,
    get_user_by_username_any,
    update_user,
)
from server.schemas.auth import CreateUserRequest, UpdateUserRequest, UserResponse

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/users", tags=["users"])

ASSIGNABLE_ROLES = {"admin", "operator", "viewer"}
VALID_STATUSES = {"active", "inactive", "pending"}
# Roles that only super_admin can create, edit, or delete
PRIVILEGED_ROLES = {"admin", "super_admin"}


@router.get("", response_model=list[UserResponse])
async def list_users(current_user: dict = Depends(require_admin)):
    return await get_all_users()


@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user_endpoint(
    body: CreateUserRequest,
    current_user: dict = Depends(require_admin),
):
    if body.role not in ASSIGNABLE_ROLES:
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"code": "INVALID_ROLE", "message": f"Role must be one of: {', '.join(sorted(ASSIGNABLE_ROLES))}"},
        )

    if body.role == "admin" and current_user["role"] != "super_admin":
        raise HTTPException(
            status.HTTP_403_FORBIDDEN,
            detail={"code": "FORBIDDEN", "message": "Only super admin can create admin accounts"},
        )

    # Parallel duplicate checks
    existing_username, existing_email = await asyncio.gather(
        get_user_by_username_any(body.username),
        get_user_by_email_any(body.email),
    )
    if existing_username:
        raise HTTPException(status.HTTP_409_CONFLICT, detail={"code": "DUPLICATE_USERNAME", "message": "Username already exists"})
    if existing_email:
        raise HTTPException(status.HTTP_409_CONFLICT, detail={"code": "DUPLICATE_EMAIL", "message": "Email already exists"})

    user = await create_user(
        username=body.username,
        email=body.email,
        hashed_password=hash_password(body.password),
        role=body.role,
    )
    logger.info("Admin %s created user: %s", current_user["username"], body.username)
    return user


@router.put("/{user_id}", response_model=UserResponse)
async def update_user_endpoint(
    user_id: int,
    body: UpdateUserRequest,
    current_user: dict = Depends(require_admin),
):
    if user_id == current_user["user_id"]:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            detail={"code": "SELF_EDIT", "message": "Cannot modify your own account via this endpoint"},
        )

    target = await get_user_by_id_any(user_id)
    if not target:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail={"code": "USER_NOT_FOUND", "message": "User not found"})

    # super_admin account is immutable
    if target["role"] == "super_admin":
        raise HTTPException(
            status.HTTP_403_FORBIDDEN,
            detail={"code": "FORBIDDEN", "message": "Super admin account cannot be modified"},
        )

    # Only super_admin can edit admin accounts
    if target["role"] == "admin" and current_user["role"] != "super_admin":
        raise HTTPException(
            status.HTTP_403_FORBIDDEN,
            detail={"code": "FORBIDDEN", "message": "Only super admin can edit admin accounts"},
        )

    if body.role is not None and body.role not in ASSIGNABLE_ROLES:
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"code": "INVALID_ROLE", "message": f"Role must be one of: {', '.join(sorted(ASSIGNABLE_ROLES))}"},
        )
    if body.status is not None and body.status not in VALID_STATUSES:
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"code": "INVALID_STATUS", "message": f"Status must be one of: {', '.join(VALID_STATUSES)}"},
        )
    if body.role == "admin" and current_user["role"] != "super_admin":
        raise HTTPException(
            status.HTTP_403_FORBIDDEN,
            detail={"code": "FORBIDDEN", "message": "Only super admin can assign admin role"},
        )

    fields = {k: v for k, v in {"role": body.role, "status": body.status}.items() if v is not None}
    user = await update_user(user_id, **fields)
    logger.info("Admin %s updated user %d: %s", current_user["username"], user_id, fields)
    return user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user_endpoint(
    user_id: int,
    current_user: dict = Depends(require_admin),
):
    if user_id == current_user["user_id"]:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            detail={"code": "SELF_DELETE", "message": "Cannot delete your own account"},
        )

    target = await get_user_by_id_any(user_id)
    if not target:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail={"code": "USER_NOT_FOUND", "message": "User not found"})

    if target["role"] == "super_admin":
        raise HTTPException(
            status.HTTP_403_FORBIDDEN,
            detail={"code": "FORBIDDEN", "message": "Super admin account cannot be deleted"},
        )

    if target["role"] == "admin" and current_user["role"] != "super_admin":
        raise HTTPException(
            status.HTTP_403_FORBIDDEN,
            detail={"code": "FORBIDDEN", "message": "Only super admin can delete admin accounts"},
        )

    await delete_user(user_id)
    logger.info("Admin %s deleted user %d", current_user["username"], user_id)
