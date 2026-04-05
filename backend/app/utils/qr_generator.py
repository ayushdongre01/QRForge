import qrcode
import qrcode.image.svg
from qrcode.image.pure import PyPNGImage
from PIL import Image
import io
import base64
from typing import Literal


SIZE_MAP = {
    "small":  {"box_size": 8,  "border": 4, "pixel_size": 256},
    "medium": {"box_size": 12, "border": 4, "pixel_size": 512},
    "large":  {"box_size": 20, "border": 4, "pixel_size": 1024},
}


def hex_to_rgb(hex_color: str) -> tuple:
    """Convert hex color string to RGB tuple."""
    hex_color = hex_color.lstrip("#")
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))


def generate_qr_png(
    url: str,
    qr_color: str = "#000000",
    bg_color: str = "#FFFFFF",
    size: str = "medium",
) -> bytes:
    """Generate a QR code as PNG bytes."""
    params = SIZE_MAP.get(size, SIZE_MAP["medium"])

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=params["box_size"],
        border=params["border"],
    )
    qr.add_data(url)
    qr.make(fit=True)

    fill_color = hex_to_rgb(qr_color)
    back_color = hex_to_rgb(bg_color)

    img = qr.make_image(fill_color=fill_color, back_color=back_color)

    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)
    return buffer.getvalue()


def generate_qr_svg(
    url: str,
    qr_color: str = "#000000",
    bg_color: str = "#FFFFFF",
    size: str = "medium",
) -> str:
    """Generate a QR code as SVG string."""
    params = SIZE_MAP.get(size, SIZE_MAP["medium"])

    factory = qrcode.image.svg.SvgPathImage
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=params["box_size"],
        border=params["border"],
        image_factory=factory,
    )
    qr.add_data(url)
    qr.make(fit=True)

    img = qr.make_image(fill_color=qr_color, back_color=bg_color)

    buffer = io.BytesIO()
    img.save(buffer)
    buffer.seek(0)
    svg_str = buffer.getvalue().decode("utf-8")
    return svg_str


def generate_qr_base64(
    url: str,
    qr_color: str = "#000000",
    bg_color: str = "#FFFFFF",
    size: str = "medium",
) -> str:
    """Generate a QR code and return as base64-encoded PNG string."""
    png_bytes = generate_qr_png(url, qr_color, bg_color, size)
    b64 = base64.b64encode(png_bytes).decode("utf-8")
    return f"data:image/png;base64,{b64}"