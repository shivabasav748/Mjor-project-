import csv
import io
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List

from database import get_db
import models, schemas
from auth import get_current_user


def _parse_value(value: str):
    if value is None:
        return None
    value = value.strip()
    if value == "":
        return None
    lower = value.lower()
    if lower in {"true", "false"}:
        return lower == "true"
    try:
        if "." in value:
            return float(value)
        return int(value)
    except ValueError:
        return value

router = APIRouter(prefix="/api/companies/{company_id}/data", tags=["dashboard"])


def _get_owned_company(company_id: int, db: Session, current_user: models.User) -> models.Company:
    company = (
        db.query(models.Company)
        .filter(models.Company.id == company_id, models.Company.owner_id == current_user.id)
        .first()
    )
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company


MAX_DEMO_ROWS = 500  # keep the skeleton snappy; swap for a real DB table + pagination later


@router.post("/upload")
async def upload_dataset(
    company_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    company = _get_owned_company(company_id, db, current_user)

    raw = await file.read()
    try:
        text = raw.decode("utf-8")
    except UnicodeDecodeError:
        try:
            text = raw.decode("latin-1")
        except UnicodeDecodeError:
            raise HTTPException(status_code=400, detail="Could not decode CSV file")

    try:
        reader = csv.DictReader(io.StringIO(text))
        if reader.fieldnames is None:
            raise ValueError("CSV file has no headers")

        records = []
        for idx, row in enumerate(reader):
            if idx >= MAX_DEMO_ROWS:
                break
            records.append({k: _parse_value(v) for k, v in row.items()})
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not parse CSV: {e}")

    dataset = models.Dataset(
        company_id=company.id,
        filename=file.filename,
        columns=list(reader.fieldnames),
        rows=records,
    )
    db.add(dataset)
    db.commit()
    db.refresh(dataset)

    return {
        "id": dataset.id,
        "filename": dataset.filename,
        "columns": dataset.columns,
        "row_count": len(records),
    }


@router.get("")
def list_datasets(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    company = _get_owned_company(company_id, db, current_user)
    datasets = db.query(models.Dataset).filter(models.Dataset.company_id == company.id).all()
    return [
        {
            "id": d.id,
            "filename": d.filename,
            "columns": d.columns,
            "row_count": len(d.rows or []),
            "uploaded_at": d.uploaded_at,
        }
        for d in datasets
    ]


@router.get("/{dataset_id}")
def get_dataset(
    company_id: int,
    dataset_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    company = _get_owned_company(company_id, db, current_user)
    dataset = (
        db.query(models.Dataset)
        .filter(models.Dataset.id == dataset_id, models.Dataset.company_id == company.id)
        .first()
    )
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return {
        "id": dataset.id,
        "filename": dataset.filename,
        "columns": dataset.columns,
        "rows": dataset.rows,
    }
