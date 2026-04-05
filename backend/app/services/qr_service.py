from app.utils.qr_generator import generate_qr_png, generate_qr_svg, generate_qr_base64
from app.schemas.qr_schemas import QRRequest
import re


def is_valid_url(url: str) -> bool:
    """Validate a URL format."""
    pattern = re.compile(
        r'^(https?://)'
        r'(([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,})'
        r'(:\d+)?'
        r'(/[^\s]*)?$'
    )
    return bool(pattern.match(url))


def service_generate_png(request: QRRequest) -> bytes:
    """Service layer: generate QR PNG bytes."""
    return generate_qr_png(
        url=request.url,
        qr_color=request.qr_color,
        bg_color=request.bg_color,
        size=request.size.value,
    )


def service_generate_svg(request: QRRequest) -> str:
    """Service layer: generate QR SVG string."""
    return generate_qr_svg(
        url=request.url,
        qr_color=request.qr_color,
        bg_color=request.bg_color,
        size=request.size.value,
    )


def service_generate_preview(request: QRRequest) -> str:
    """Service layer: generate QR base64 preview."""
    return generate_qr_base64(
        url=request.url,
        qr_color=request.qr_color,
        bg_color=request.bg_color,
        size=request.size.value,
    )