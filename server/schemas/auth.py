"""Auth schemas and validation rules."""

import re

from pydantic import BaseModel, field_validator

EMAIL_PATTERN = re.compile(
    r"^(?=.{6,254}$)(?!\.)(?!.*\.\.)([A-Za-z0-9!#$%&'*+/=?^_`{|}~.-]{1,64})@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$"
)
PASSWORD_UPPER = re.compile(r"[A-Z]")
PASSWORD_LOWER = re.compile(r"[a-z]")
PASSWORD_DIGIT = re.compile(r"\d")
PASSWORD_SPECIAL = re.compile(r"[^\w\s]")
PASSWORD_WHITESPACE = re.compile(r"\s")
PASSWORD_REPEATED = re.compile(r"(.)\1{3,}")
PASSWORD_SEQUENTIAL_PATTERNS = ("12345", "abcdef", "qwerty", "password")
COMMON_WEAK_PASSWORDS = {
    "password",
    "password123",
    "admin",
    "admin123",
    "qwerty",
    "qwerty123",
    "letmein",
    "welcome",
    "iloveyou",
    "12345678",
    "123456789",
}


def _normalize_email(value: str) -> str:
    email = value.strip().lower()
    if not email:
        raise ValueError("Email is required")
    if len(email) > 254:
        raise ValueError("Email must be 254 characters or fewer")
    if not EMAIL_PATTERN.fullmatch(email):
        raise ValueError("Invalid email format")
    return email


def _validate_password_strength(value: str) -> str:
    if len(value) < 12:
        raise ValueError("Password must be at least 12 characters")
    if len(value) > 128:
        raise ValueError("Password must be 128 characters or fewer")
    if PASSWORD_WHITESPACE.search(value):
        raise ValueError("Password cannot contain whitespace")
    if not PASSWORD_UPPER.search(value):
        raise ValueError("Password must include at least one uppercase letter")
    if not PASSWORD_LOWER.search(value):
        raise ValueError("Password must include at least one lowercase letter")
    if not PASSWORD_DIGIT.search(value):
        raise ValueError("Password must include at least one number")
    if not PASSWORD_SPECIAL.search(value):
        raise ValueError("Password must include at least one special character")

    lowered = value.lower()
    if lowered in COMMON_WEAK_PASSWORDS:
        raise ValueError("Password is too common")
    if PASSWORD_REPEATED.search(value):
        raise ValueError("Password cannot contain 4 or more repeated characters in sequence")
    if any(pattern in lowered for pattern in PASSWORD_SEQUENTIAL_PATTERNS):
        raise ValueError("Password cannot contain common sequential patterns")
    return value


class LoginRequest(BaseModel):
    username: str
    password: str

    @field_validator("username")
    @classmethod
    def normalize_username(cls, value: str) -> str:
        username = value.strip()
        if not username:
            raise ValueError("Username is required")
        return username

    @field_validator("password")
    @classmethod
    def ensure_password_present(cls, value: str) -> str:
        if not value:
            raise ValueError("Password is required")
        if len(value) > 128:
            raise ValueError("Password must be 128 characters or fewer")
        return value


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

    @field_validator("username")
    @classmethod
    def normalize_username(cls, value: str) -> str:
        username = value.strip()
        if not username:
            raise ValueError("Username is required")
        if len(username) < 3:
            raise ValueError("Username must be at least 3 characters")
        if len(username) > 32:
            raise ValueError("Username must be 32 characters or fewer")
        return username

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        return _normalize_email(value)

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str, info) -> str:
        password = _validate_password_strength(value)
        lowered_password = password.lower()
        username = str(info.data.get("username", "")).strip().lower()
        email = str(info.data.get("email", "")).strip().lower()

        if len(username) >= 3 and username in lowered_password:
            raise ValueError("Password cannot contain username")

        local_part = email.split("@", 1)[0]
        if len(local_part) >= 3 and local_part in lowered_password:
            raise ValueError("Password cannot contain the email local-part")

        return password


class RequestAccessRequest(BaseModel):
    username: str
    email: str
    password: str

    @field_validator("username")
    @classmethod
    def normalize_username(cls, value: str) -> str:
        username = value.strip()
        if not username:
            raise ValueError("Username is required")
        if len(username) < 3:
            raise ValueError("Username must be at least 3 characters")
        if len(username) > 32:
            raise ValueError("Username must be 32 characters or fewer")
        return username

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        return _normalize_email(value)

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str, info) -> str:
        password = _validate_password_strength(value)
        lowered_password = password.lower()
        username = str(info.data.get("username", "")).strip().lower()
        email = str(info.data.get("email", "")).strip().lower()

        if len(username) >= 3 and username in lowered_password:
            raise ValueError("Password cannot contain username")

        local_part = email.split("@", 1)[0]
        if len(local_part) >= 3 and local_part in lowered_password:
            raise ValueError("Password cannot contain the email local-part")

        return password


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
