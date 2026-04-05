# QRForge

QRForge is a full-stack QR code generator with a FastAPI backend and a Next.js frontend. It lets you validate URLs, generate live QR previews, and download QR codes as PNG or SVG with customizable colors, size, and filename.

## Demo

Live demo: https://qrforge-app.vercel.app/

## Screenshots

![QRForge – Home Page](https://github.com/ayushdongre01/QRForge/blob/main/images/1.png)
![QRForge – Input Form](https://github.com/ayushdongre01/QRForge/blob/main/images/2.png)
![QRForge – QR Preview 1](https://github.com/ayushdongre01/QRForge/blob/main/images/3.png)
![QRForge – QR Preview 2](https://github.com/ayushdongre01/QRForge/blob/main/images/4.png)
![QRForge – QR Preview 3](https://github.com/ayushdongre01/QRForge/blob/main/images/5.png)
![QRForge – History](https://github.com/ayushdongre01/QRForge/blob/main/images/6.png)

## Features

- URL validation for `http://` and `https://` inputs
- Live QR preview generated from the backend
- PNG and SVG downloads
- Custom QR foreground and background colors
- Small, medium, and large QR sizes
- Filename control for downloaded assets
- Local history saved in the browser via `localStorage`
- Simple health and root endpoints for backend checks

## Tech Stack

- Frontend: Next.js 14, React 18, TypeScript
- Backend: FastAPI, Pydantic, Uvicorn
- QR generation: `qrcode[pil]`, Pillow, CairoSVG
- Styling: CSS modules and global styles in the Next.js app

## Project Structure

```text
QRForge/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── app/
│       ├── routes/
│       ├── schemas/
│       ├── services/
│       └── utils/
└── frontend/
	├── app/
	│   ├── layout.tsx
	│   ├── page.tsx
	│   └── globals.css
	├── package.json
	└── public/
```

## How It Works

The frontend collects the URL, QR colors, size, and filename. It then calls the backend to validate the URL, fetch a live preview, and download the final QR code in the selected format.

The backend generates QR codes using the Python `qrcode` library. PNG output is rendered with Pillow, while SVG output is produced with CairoSVG-compatible SVG generation.

## Prerequisites

- Python 3.11 or newer
- Node.js 18 or newer
- npm, pnpm, or yarn

## Backend Setup

From the `backend/` directory:

```bash
python -m venv venv
venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Backend environment variables:

- `APP_NAME` - optional application name shown by FastAPI
- `APP_VERSION` - optional version string
- `ALLOWED_ORIGINS` - comma-separated list of frontend origins, default `http://localhost:3000`

## Frontend Setup

From the `frontend/` directory:

```bash
npm install
npm run dev
```

Frontend environment variables:

- `NEXT_PUBLIC_API_URL` - backend base URL, default `http://localhost:8000`

## Running Locally

1. Start the backend on port `8000`.
2. Start the frontend on port `3000`.
3. Open `http://localhost:3000` in your browser.
4. Enter a valid URL and customize the QR code.
5. Download the generated PNG or SVG file.

## API Endpoints

Base path: `/api/qr`

- `POST /validate` - checks whether the provided URL is valid
- `POST /preview` - returns a base64-encoded QR preview image
- `POST /download/png` - downloads the QR code as a PNG
- `POST /download/svg` - downloads the QR code as an SVG

Additional backend endpoints:

- `GET /` - health message
- `GET /health` - health check response

## Request Shape

The QR generation endpoints accept a JSON body with the following fields:

- `url`
- `qr_color`
- `bg_color`
- `size` (`small`, `medium`, or `large`)
- `format` (`png` or `svg`)
- `filename`

## Notes

- The URL must begin with `http://` or `https://`.
- History is stored only in the browser, not in the backend.
- Preview and download requests use the same configuration payload.

## Troubleshooting

- If the frontend cannot reach the backend, confirm `NEXT_PUBLIC_API_URL` matches the backend URL.
- If you see CORS errors, update `ALLOWED_ORIGINS` in the backend environment.
- If SVG downloads fail, ensure the backend dependencies installed successfully.

## Future Improvements

- Persist QR history server-side
- Add file upload or batch QR generation
- Add logo embedding in the QR center
- Add deployment automation and a real live demo URL

