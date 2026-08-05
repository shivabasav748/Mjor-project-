from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
import models
from auth import get_current_user
from ai import get_growth_suggestions as gemini_growth

router = APIRouter(prefix="/api/companies/{company_id}/growth", tags=["growth"])


def _get_owned_company(company_id: int, db: Session, current_user: models.User) -> models.Company:
    company = (
        db.query(models.Company)
        .filter(models.Company.id == company_id, models.Company.owner_id == current_user.id)
        .first()
    )
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company


@router.get("/suggestions")
def get_growth_suggestions(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    company = _get_owned_company(company_id, db, current_user)

    has_data = db.query(models.Dataset).filter(models.Dataset.company_id == company.id).count() > 0
    has_docs = db.query(models.Document).filter(models.Document.company_id == company.id).count() > 0

    # Pull recent chat for context
    recent_msgs = (
        db.query(models.ChatMessage)
        .filter(models.ChatMessage.company_id == company.id)
        .order_by(models.ChatMessage.created_at.desc())
        .limit(6)
        .all()
    )
    chat_summary = " | ".join([m.content[:120] for m in reversed(recent_msgs)]) if recent_msgs else ""

    # ── Gemini AI growth suggestions ───────────────────────────────────────
    suggestions = gemini_growth(
        company_name=company.name,
        industry=company.industry or "",
        stage=company.stage or "",
        description=company.description or "",
        has_data=has_data,
        has_docs=has_docs,
        chat_summary=chat_summary,
    )
    return {"company": company.name, "suggestions": suggestions}
