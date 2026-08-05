from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
import models  # noqa: F401 - ensures models are registered before create_all
from routers import auth_router, company_router, chat_router, market_router, dashboard_router, growth_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="VentureIQ API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this before deploying for real
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(company_router.router)
app.include_router(chat_router.router)
app.include_router(market_router.router)
app.include_router(dashboard_router.router)
app.include_router(growth_router.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}
