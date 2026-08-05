from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
import models, schemas
from auth import get_current_user
from ai import analyze_market as gemini_analyze_market

router = APIRouter(prefix="/api/companies/{company_id}/market", tags=["market-research"])


def _get_owned_company(company_id: int, db: Session, current_user: models.User) -> models.Company:
    company = (
        db.query(models.Company)
        .filter(models.Company.id == company_id, models.Company.owner_id == current_user.id)
        .first()
    )
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company


@router.post("/analyze")
def analyze_market(
    company_id: int,
    payload: schemas.MarketRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    company = _get_owned_company(company_id, db, current_user)

    # ── Gemini AI market analysis ──────────────────────────────────────────
    result = gemini_analyze_market(
        company_name=company.name,
        industry=company.industry or "",
        stage=company.stage or "",
        description=company.description or "",
    )
    return result
