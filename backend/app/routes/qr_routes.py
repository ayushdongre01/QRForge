from fastapi import APIRouter, HTTPException
from fastapi.responses import Response, JSONResponse
from app.schemas.qr_schemas import QRRequest, QRValidationRequest, QRValidationResponse
from app.services.qr_service import (
    service_generate_png,
    service_generate_svg,
    service_generate_preview,
    is_valid_url,
)

router = APIRouter(prefix="/api/qr", tags=["QR Code"])


@router.post("/validate")
def validate_url(payload: QRValidationRequest) -> QRValidationResponse:
    """Validate a URL."""
    valid = is_valid_url(payload.url)
    return QRValidationResponse(
        valid=valid,
        message="Valid URL" if valid else "Invalid URL format",
    )


@router.post("/preview")
def preview_qr(request: QRRequest):
    """Return base64-encoded QR preview image."""
    try:
        b64 = service_generate_preview(request)
        return JSONResponse(content={"image": b64})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/download/png")
def download_png(request: QRRequest):
    """Download QR code as PNG file."""
    try:
        png_bytes = service_generate_png(request)
        filename = request.filename or "qrcode"
        return Response(
            content=png_bytes,
            media_type="image/png",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}.png"'
            },
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/download/svg")
def download_svg(request: QRRequest):
    """Download QR code as SVG file."""
    try:
        svg_str = service_generate_svg(request)
        filename = request.filename or "qrcode"
        return Response(
            content=svg_str,
            media_type="image/svg+xml",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}.svg"'
            },
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))