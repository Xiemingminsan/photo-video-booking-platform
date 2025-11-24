# Deployment (Live)

- Backend: Railway — https://photo-video-booking-platform-production.up.railway.app
- Swagger: https://photo-video-booking-platform-production.up.railway.app/docs
- Frontend: Vercel — https://photo-video-booking-platform.vercel.app
- Database: Supabase (PostgreSQL) — pooler URI configured in env

Environment notes:
- `DATABASE_URL` uses the Supabase session pooler URI
- `SECRET_KEY` is a random 32+ char string
- `ALLOWED_ORIGINS`: `http://localhost:5173,https://photo-video-booking-platform.vercel.app`
- Frontend uses `VITE_API_URL` pointing to the Railway backend

Auto-deploy:
- Railway and Vercel pull from the GitHub repo and auto-deploy on push.
