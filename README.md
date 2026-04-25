# SmartHire AI — Enterprise Recruitment Platform

SmartHire AI is a production-ready, enterprise-grade recruitment platform powered by artificial intelligence. It automates candidate screening, intelligent job matching, and AI-assisted application workflows for modern talent teams.

---

## Features

| Feature | Description |
|---------|-------------|
| **AI-Powered Matching** | Hybrid SBERT + TF-IDF engine delivers precise candidate-job compatibility scores |
| **Intelligent Resume Parsing** | Extract skills, education, and experience from PDF/DOCX using spaCy NLP |
| **Global Job Aggregation** | Live feeds from Remotive (global remote), Adzuna India, and We Work Remotely |
| **AI Apply Assistant** | GPT-4 powered cover letters, recruiter emails, and interview prep |
| **Advanced Analytics** | Real-time dashboards for match scores, pipelines, and team performance |
| **Enterprise Security** | JWT authentication, bcrypt hashing, role-based access control |

---

## Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   React     │──────│   FastAPI    │──────│   OpenAI    │
│  (Vite)     │      │   Backend    │      │   GPT-4     │
└─────────────┘      └──────────────┘      └─────────────┘
                           │
                    ┌──────┴──────┐
                    │   MongoDB   │
                    │  (Motor)    │
                    └─────────────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
         ┌────┴───┐  ┌────┴───┐  ┌────┴───┐
         │Remotive│  │ Adzuna │  │WWR RSS │
         │(Global)│  │(India) │  │(Remote)│
         └────────┘  └────────┘  └────────┘
```

---

## Quick Start

### Development

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

### Production (Docker)

```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

---

## Environment Variables

```bash
# Required
OPENAI_API_KEY=sk-...
SECRET_KEY=your-super-secret-jwt-key
MONGO_URI=mongodb://localhost:27017

# Optional
ADZUNA_APP_ID=...
ADZUNA_APP_KEY=...
CORS_ORIGINS=https://yourdomain.com
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

---

## Deployment Options

| Platform | Difficulty | Cost |
|----------|-----------|------|
| **Render + Vercel** | Easy | Free tier |
| **Railway + MongoDB Atlas** | Easy | Free tier |
| **DigitalOcean App Platform** | Medium | $5/mo |
| **AWS ECS + CloudFront** | Advanced | Pay per use |

---

## Tech Stack

- **Frontend**: React 19, Vite, React Router, Lucide Icons, CSS Variables
- **Backend**: FastAPI, Motor (async MongoDB), Pydantic
- **AI/ML**: OpenAI GPT-4, Sentence-BERT, scikit-learn, spaCy
- **External APIs**: Remotive, Adzuna India, We Work Remotely RSS
- **Infrastructure**: Docker, Nginx, Gunicorn + Uvicorn

---

## License

MIT License. Built for modern talent teams.

