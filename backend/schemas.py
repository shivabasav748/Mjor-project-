from pydantic import BaseModel, EmailStr
from typing import Optional, List, Any
from datetime import datetime


# ---- Auth ----
class SignupRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    id: int
    email: str
    full_name: str

    class Config:
        from_attributes = True


# ---- Company ----
class CompanyCreate(BaseModel):
    name: str
    industry: Optional[str] = None
    stage: Optional[str] = None
    description: Optional[str] = None


class CompanyOut(BaseModel):
    id: int
    name: str
    industry: Optional[str]
    stage: Optional[str]
    description: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# ---- Chat ----
class ChatRequest(BaseModel):
    message: str


class ChatMessageOut(BaseModel):
    id: int
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


# ---- Market research ----
class MarketRequest(BaseModel):
    focus: Optional[str] = None  # e.g. "competitors", "trends", "pricing"


# ---- Dataset / dashboard ----
class DatasetOut(BaseModel):
    id: int
    filename: str
    columns: Optional[List[str]]
    row_count: int
    uploaded_at: datetime
