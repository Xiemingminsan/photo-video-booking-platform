# Photo/Video Booking Platform

Full-stack booking platform with client and admin flows: packages, bookings, add-ons, and delivery uploads.

## Tech Stack
- Backend: FastAPI (Python), SQLAlchemy, Pydantic, JWT auth, PostgreSQL (Supabase)
- Frontend: React (Vite), React Router, Axios
- Deployment: Railway (API), Vercel (UI), Supabase (DB)

## Live URLs
- Frontend: https://photo-video-booking-platform.vercel.app
- Backend: https://photo-video-booking-platform-production.up.railway.app
- Swagger: https://photo-video-booking-platform-production.up.railway.app/docs

## Repository
- GitHub (public): https://github.com/Xiemingminsan/photo-video-booking-platform

## Local Quick Start
Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # or source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # set DATABASE_URL to your Postgres/Supabase URL
uvicorn main:app --reload
```
Frontend
```bash
cd frontend
npm install
cp .env.example .env  # set VITE_API_URL=http://localhost:8000
npm run dev
```

## Default Admin (seed data)
- Email: admin@photobooking.com
- Password: admin123
