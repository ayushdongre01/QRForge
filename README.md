# QRForge
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green)
![AWS](https://img.shields.io/badge/AWS-Cloud-orange)
![License](https://img.shields.io/badge/License-MIT-blue)

QRForge is a full-stack QR code generator with a FastAPI backend and a Next.js frontend. It lets you validate URLs, generate live QR previews, and download QR codes as PNG or SVG with customizable colors, size, and filename.

## Motivation

QRForge was built to explore full-stack development with modern tools such as **Next.js and FastAPI**, while learning how to deploy scalable backend services on **AWS infrastructure**. This project demonstrates real-world experience with cloud deployment, RESTful API design, and frontend-backend communication over HTTPS.

## Demo

**Live Frontend:** https://qrforge-app.vercel.app/

**API Documentation:** https://d3o2cgux7ehhxg.cloudfront.net/docs

## Screenshots

![QRForge – Home Page](https://github.com/ayushdongre01/QRForge/blob/main/images/1.png)
![QRForge – Input Form](https://github.com/ayushdongre01/QRForge/blob/main/images/2.png)
![QRForge – QR Preview 1](https://github.com/ayushdongre01/QRForge/blob/main/images/3.png)
![QRForge – QR Preview 2](https://github.com/ayushdongre01/QRForge/blob/main/images/4.png)
![QRForge – QR Preview 3](https://github.com/ayushdongre01/QRForge/blob/main/images/5.png)
![QRForge – History](https://github.com/ayushdongre01/QRForge/blob/main/images/6.png)

## Features

- **URL Validation with Backend Verification** – Input validation and URL format checking
- **Real-time QR Preview Generation** – Instant frontend feedback from backend API calls
- **Multiple Export Formats** – PNG and SVG with lossless quality
- **Customizable QR Styling** – Adjustable foreground and background colors
- **Dynamic QR Size Selection** – Small, medium, and large presets
- **Client-side QR History** – localStorage-based session persistence
- **RESTful API Design** – Comprehensive FastAPI backend with Pydantic validation
- **Simple Health & Monitoring Endpoints** – Backend health checks and status monitoring

## Tech Stack

**Frontend:**
- Next.js 14
- React 18
- TypeScript
- CSS Modules

**Backend:**
- FastAPI
- Pydantic
- Uvicorn

**QR Generation:**
- qrcode[pil]
- Pillow
- CairoSVG

**Infrastructure & Deployment:**
- Vercel (Frontend hosting)
- AWS Elastic Beanstalk (Backend deployment)
- AWS CloudFront (HTTPS + CDN & cache optimization)

## Architecture

```
User Browser (HTTPS)
     │
     ▼
Next.js Frontend (Vercel CDN)
     │
     ▼
AWS CloudFront CDN Layer
     │
     ▼
FastAPI Backend (AWS Elastic Beanstalk)
     │
     ▼
QR Generation Service
```

This architecture provides:
- **HTTPS Security** – All frontend-to-backend communication is encrypted
- **Global CDN** – CloudFront ensures low latency for frontend assets
- **Managed Backend Environment** – Elastic Beanstalk simplifies deployment and server management

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

## Deployment

**Frontend** is deployed on **Vercel**, providing edge caching and automatic deployments from the main branch.

**Backend** is deployed on **AWS Elastic Beanstalk**, which provides auto-scaling, load balancing, and environment management.

To enable secure HTTPS communication from the Vercel frontend to the Beanstalk backend, the backend is served through **AWS CloudFront**, which provides:
- HTTPS termination and SSL/TLS encryption
- CDN caching for API responses
- DDoS protection via AWS Shield
- Lower latency for global users

**Example flow:**
1. User visits https://qrforge-app.vercel.app/
2. Frontend requests to https://d3o2cgux7ehhxg.cloudfront.net/api/qr/preview
3. CloudFront routes to Elastic Beanstalk backend
4. Backend generates QR and returns response

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

- **Server-side QR History Persistence** – Database integration with history tracking and user sessions
- **Logo Embedding** – Feature to embed logos in QR code center with error correction analysis
- **Batch QR Generation** – Generate multiple QR codes with CSV/JSON input
- **Rate Limiting & API Authentication** – API key management and request throttling
- **Advanced Monitoring** – CloudWatch integration for logging and metrics
- **Docker-based Deployment** – Containerized backend for consistent environments

