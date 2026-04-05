from pydantic import BaseModel, HttpUrl, field_validator
from typing import Optional, Literal
from enum import Enum


class QRSize(str, Enum):
    small = "small"
    medium = "medium"
    large = "large"


class QRRequest(BaseModel):
    url: str
    qr_color: Optional[str] = "#000000"
    bg_color: Optional[str] = "#FFFFFF"
    size: Optional[QRSize] = QRSize.medium
    format: Optional[Literal["png", "svg"]] = "png"
    filename: Optional[str] = "qrcode"

    @field_validator("url")
    @classmethod
    def validate_url(cls, v):
        if not v.startswith(("http://", "https://")):
            raise ValueError("URL must start with http:// or https://")
        return v


class QRValidationRequest(BaseModel):
    url: str


class QRValidationResponse(BaseModel):
    valid: bool
    message: str


class QRHistoryItem(BaseModel):
    url: str
    qr_color: str
    bg_color: str
    size: str
    created_at: str