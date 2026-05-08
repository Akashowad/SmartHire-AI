# SmartHire AI Deployment

Use this file to keep the public deployment URLs for project submissions, portfolio entries, and README updates.

## Live URLs

- Frontend (Vercel): `https://smarthire-ai.vercel.app`
- Backend (Render): `https://your-backend.onrender.com`

Replace the Render URL after the backend is deployed.

## Vercel Frontend

1. Open your Vercel dashboard.
2. Open the SmartHire AI project.
3. Copy the production domain, for example `https://smarthire-ai.vercel.app`.
4. If the backend is deployed, add this environment variable in Vercel:

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

5. Redeploy the frontend after changing environment variables.

## Render Backend

1. Create a new Render Web Service for the `backend` folder.
2. Add environment variables such as `OPENAI_API_KEY`, `MONGO_URI`, `DB_NAME`, and `CORS_ORIGINS`.
3. Set `CORS_ORIGINS` to your Vercel URL:

```env
CORS_ORIGINS=https://smarthire-ai.vercel.app
```

4. Copy the Render service URL, for example `https://your-backend.onrender.com`.

