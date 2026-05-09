# SmartHire AI Deployment

Use this file to keep the public deployment URLs for project submissions, portfolio entries, and README updates.

## Live URLs

- Frontend (Vercel): `https://smarthire-ai.vercel.app`
- Backend (Render): `https://your-backend.onrender.com`

Replace the Render URL after the backend is deployed.

## Environment Variables Required

### Backend (Render)
```env
MONGO_URI=your_mongodb_connection_string
DB_NAME=smarthire
SECRET_KEY=your_generated_secret_key
OPENAI_API_KEY=your_openai_api_key
JSEARCH_API_KEY=your_jsearch_rapidapi_key
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_app_key
CORS_ORIGINS=https://smarthire-ai.vercel.app
```

### Frontend (Vercel)
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

## Local Development

1. Backend
   - `cd backend`
   - `venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`
   - Open `http://127.0.0.1:8000/`
2. Frontend
   - `cd frontend`
   - `npm install`
   - `npm run dev -- --host 0.0.0.0 --port 5173`
   - Open `http://localhost:5173/`

## Vercel Frontend Deployment

1. Connect your GitHub repository to Vercel
2. Set the root directory to `frontend`
3. Add environment variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
4. Deploy

## Render Backend Deployment

1. Create a new Web Service from your GitHub repo
2. Set the root directory to `backend`
3. Add all the backend environment variables listed above
4. Set build command: `pip install -r requirements.txt`
5. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Deploy

## API Keys Setup

### JSearch API (RapidAPI)
1. Sign up at [RapidAPI JSearch](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)
2. Subscribe to the API
3. Copy your API key

### Adzuna API
1. Sign up at [Adzuna Developer](https://developer.adzuna.com/)
2. Create an app to get App ID and App Key

### MongoDB
1. Create a MongoDB Atlas cluster
2. Get your connection string

### OpenAI
1. Get your API key from OpenAI dashboard

