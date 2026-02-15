# 🚀 Deployment Guide for BiteDash

This project is a full-stack application. For the best experience, we recommend deploying the Backend on Render and the Frontend on Vercel.

## 1. Backend (Render)

1. Log in to [Render](https://render.com/).
2. Click **New +** and select **Blueprint**.
3. Connect your GitHub repository.
4. Render will use the `render.yaml` file to set up the backend.
5. In the Render Dashboard, go to your Backend service and add these **Environment Variables**:
   - `MONGODB_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: A secure random string for tokens.
   - `ALLOWED_ORIGINS`: Set this to your frontend URL (e.g., `https://bitedash.vercel.app`).

## 2. Frontend (Vercel)

1. Log in to [Vercel](https://vercel.com/).
2. Click **Add New** -> **Project**.
3. Import the GitHub repository.
4. **IMPORTANT**: In the "Environment Variables" section, add:
   - `VITE_API_BASE_URL`: `https://YOUR_BACKEND_URL.onrender.com/api`
   - `VITE_SOCKET_URL`: `https://YOUR_BACKEND_URL.onrender.com`
5. Set the **Root Directory** to `frontend`.
6. Click **Deploy**.

## 3. Environment Variables Reminder

Ensure all services have their respective `.env` variables configured in their project dashboards.

- **Backend**: `MONGODB_URI`, `JWT_SECRET`, `PORT`, `ALLOWED_ORIGINS`
- **Frontend**: `VITE_API_BASE_URL`, `VITE_SOCKET_URL`, `VITE_GOOGLE_MAPS_API_KEY`
