"""
Central config — reads from .env file automatically.
Import `settings` anywhere in the backend.
"""
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent / ".env")

GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
SECRET_KEY: str = os.getenv("SECRET_KEY", "CHANGE-ME-IN-PRODUCTION")
DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./ventureiq.db")

# Quick validation
if not GEMINI_API_KEY or GEMINI_API_KEY == "your_gemini_api_key_here":
    print("WARNING: GEMINI_API_KEY not set in .env -- AI features will use fallback responses")
