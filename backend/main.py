from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from app.routes.qr_routes import router as qr_router

app = FastAPI(
    title=os.getenv("APP_NAME", "QRForge"),
    version=os.getenv("APP_VERSION", "1.0.0"),
    description="QR Code Generator API",
)

# CORS
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(qr_router)


@app.get("/")
def root():
    return {"message": "QRForge API is running 🚀"}


@app.get("/health")
def health():
    return {"status": "ok"}