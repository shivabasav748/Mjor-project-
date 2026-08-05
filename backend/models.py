from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    companies = relationship("Company", back_populates="owner", cascade="all, delete-orphan")


class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    industry = Column(String, nullable=True)
    stage = Column(String, nullable=True)  # idea / mvp / early-revenue / growth
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="companies")
    documents = relationship("Document", back_populates="company", cascade="all, delete-orphan")
    chat_messages = relationship("ChatMessage", back_populates="company", cascade="all, delete-orphan")
    datasets = relationship("Dataset", back_populates="company", cascade="all, delete-orphan")


class Document(Base):
    """Knowledge-base source material the founder uploads (plans, notes, etc.)."""
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    filename = Column(String, nullable=False)
    content_text = Column(Text, nullable=True)  # extracted text, chunked/embedded later
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    company = relationship("Company", back_populates="documents")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    role = Column(String, nullable=False)  # 'user' | 'assistant'
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    company = relationship("Company", back_populates="chat_messages")


class Dataset(Base):
    """Uploaded CSV/spreadsheet data used to power the dashboard."""
    __tablename__ = "datasets"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    filename = Column(String, nullable=False)
    columns = Column(JSON, nullable=True)
    rows = Column(JSON, nullable=True)  # small demo datasets stored inline as JSON
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    company = relationship("Company", back_populates="datasets")
