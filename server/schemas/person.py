"""Person schemas."""

from pydantic import BaseModel


class Person(BaseModel):
    id: int
    name: str
    photo_url: str
    created_at: str
    recognition_count: int
    employee_id: str | None = None
    department_id: int | None = None
    department_name: str | None = None
    status: str = "active"  # "active" | "inactive"


class PersonCreate(BaseModel):
    name: str
    employee_id: str | None = None
    department_id: int | None = None


class PersonUpdate(BaseModel):
    name: str | None = None
    employee_id: str | None = None
    department_id: int | None = None
    status: str | None = None
