"""Auth schemas — Phase 1 Sprint 1."""

from pydantic import BaseModel


class LoginRequest(BaseModel):
    username: str
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


class AuthUser(BaseModel):
    id: int
    username: str
    email: str
    role: str  # "admin" | "operator" | "viewer"


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: AuthUser


class CreateUserRequest(BaseModel):
    username: str
    email: str
    password: str
    role: str = "operator"  # "admin" | "operator" | "viewer"


class RequestAccessRequest(BaseModel):
    username: str
    email: str
    password: str


class UpdateUserRequest(BaseModel):
    role: str | None = None
    status: str | None = None  # "active" | "inactive" | "pending"


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str
    status: str
    last_login: str | None
    created_at: str
