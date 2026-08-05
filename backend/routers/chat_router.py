from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List

from database import get_db
import models, schemas
from auth import get_current_user
from ai import chat_reply as gemini_chat

router = APIRouter(prefix="/api/companies/{company_id}", tags=["knowledge-base"])


def _get_owned_company(company_id: int, db: Session, current_user: models.User) -> models.Company:
    company = (
        db.query(models.Company)
        .filter(models.Company.id == company_id, models.Company.owner_id == current_user.id)
        .first()
    )
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company


@router.post("/documents")
async def upload_document(
    company_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    company = _get_owned_company(company_id, db, current_user)
    raw = await file.read()
    try:
        text = raw.decode("utf-8", errors="ignore")
    except Exception:
        text = ""
    doc = models.Document(company_id=company.id, filename=file.filename, content_text=text)
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return {"id": doc.id, "filename": doc.filename, "chars_stored": len(text)}


@router.get("/documents")
def list_documents(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    company = _get_owned_company(company_id, db, current_user)
    docs = db.query(models.Document).filter(models.Document.company_id == company.id).all()
    return [{"id": d.id, "filename": d.filename, "uploaded_at": d.uploaded_at} for d in docs]


@router.get("/chat", response_model=List[schemas.ChatMessageOut])
def get_chat_history(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    company = _get_owned_company(company_id, db, current_user)
    return (
        db.query(models.ChatMessage)
        .filter(models.ChatMessage.company_id == company.id)
        .order_by(models.ChatMessage.created_at)
        .all()
    )


@router.post("/chat", response_model=schemas.ChatMessageOut)
def send_chat_message(
    company_id: int,
    payload: schemas.ChatRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    company = _get_owned_company(company_id, db, current_user)

    # Save user message
    user_msg = models.ChatMessage(company_id=company.id, role="user", content=payload.message)
    db.add(user_msg)
    db.commit()

    # Get document texts for context
    docs = db.query(models.Document).filter(models.Document.company_id == company.id).all()
    doc_texts = [d.content_text for d in docs if d.content_text]

    # Get recent chat history for multi-turn context (last 12 messages)
    history = (
        db.query(models.ChatMessage)
        .filter(models.ChatMessage.company_id == company.id)
        .order_by(models.ChatMessage.created_at)
        .all()
    )
    history_dicts = [{"role": m.role, "content": m.content} for m in history]

    # ── Gemini AI co-founder reply ─────────────────────────────────────────
    reply_text = gemini_chat(
        company_name=company.name,
        industry=company.industry or "",
        stage=company.stage or "",
        description=company.description or "",
        document_texts=doc_texts,
        history=history_dicts,
        user_message=payload.message,
    )

    assistant_msg = models.ChatMessage(company_id=company.id, role="assistant", content=reply_text)
    db.add(assistant_msg)
    db.commit()
    db.refresh(assistant_msg)
    return assistant_msg
