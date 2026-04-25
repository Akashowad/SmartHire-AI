# SmartHire AI — Enterprise Recruitment Platform

SmartHire AI is an enterprise-grade, AI-powered recruitment platform designed to help talent teams source, screen, and hire top candidates with unprecedented speed and accuracy. Built for modern organizations that demand intelligent automation without sacrificing human judgment.

---

## Overview

SmartHire AI combines state-of-the-art natural language processing, semantic matching algorithms, and GPT-4 powered content generation to transform how companies identify and engage talent. From resume parsing to automated outreach, every step is optimized for scale, precision, and compliance.

---

## Core Capabilities

| Capability | Description |
|------------|-------------|
| **AI Resume Parsing** | Extract structured data from PDF and DOCX resumes using spaCy NLP pipelines |
| **Semantic Matching** | Hybrid SBERT + TF-IDF scoring for precise candidate-job compatibility |
| **Intelligent Job Aggregation** | Live remote job feeds with real-time filtering and categorization |
| **AI Content Generation** | GPT-4 powered cover letters, recruiter emails, and interview prep |
| **Automated Application** | Browser automation for high-volume application processing |
| **Advanced Analytics** | Pipeline tracking, match score distributions, and hiring velocity metrics |
| **Enterprise Security** | JWT authentication, bcrypt hashing, audit trails, RBAC |

---

## Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   React     │──────│   FastAPI    │──────│   OpenAI    │
│   (Vite)    │      │   Backend    │      │   GPT-4     │
└─────────────┘      └──────────────┘      └─────────────┘
                            │
                     ┌──────┴──────┐
                     │   MongoDB   │
                     │  (Motor)    │
                     └─────────────┘
                            │
                     ┌──────┴──────┐
                     │   Remotive  │
                     │    API      │
                     └─────────────┘
```

### Data Flow

1. **Candidate Upload** — Resumes (PDF/DOCX) are parsed via spaCy NLP
2. **Skill Extraction** — Structured data: skills, education, experience, certifications
3. **Job Feed** — Live listings aggregated from external sources
4. **AI Matching** — Hybrid SBERT semantic + TF-IDF statistical scoring (0–100%)
5. **Content Generation** — GPT-4 creates tailored cover letters, emails, interview questions
6. **Application Tracking** — MongoDB persists all candidate interactions and pipeline status
7. **Dashboard** — React frontend displays analytics, job feeds, and AI insights

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, React Router DOM, Lucide React, CSS Custom Properties |
| **Backend** | FastAPI (Python), Service-Based Architecture, JWT Authentication |
| **Database** | MongoDB with Motor (Async Driver) |
| **AI/ML** | OpenAI GPT-4, spaCy (NLP), Sentence Transformers (SBERT), scikit-learn (TF-IDF) |
| **External APIs** | Remotive Public API |
| **Security** | bcrypt password hashing, JWT tokens, HTTP Bearer authentication, CORS |

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- MongoDB instance (or Docker Compose)
- OpenAI API key

### Environment Setup

Create a `.env` file in the project root:

```bash
OPENAI_API_KEY=your_openai_key_here
SECRET_KEY=your-super-secret-jwt-key-here
```

### Option 1: Docker Compose (Recommended)

```bash
docker-compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Option 2: Manual Setup

#### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user account |
| POST | `/api/auth/login` | Authenticate and receive JWT token |
| GET | `/api/auth/me` | Retrieve current user profile |

### Resumes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/resumes/upload-resume` | Upload and parse resume (PDF/DOCX) |
| GET | `/api/resumes/my-resumes` | List user's uploaded resumes |

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs/` | Fetch live job listings with filtering |

### Matching
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/matches/` | Calculate compatibility score |
| GET | `/api/matches/my-matches` | Retrieve match history |

### AI Services
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/cover-letter` | Generate tailored cover letter |
| POST | `/api/ai/recommendations` | Skill gap analysis and match reasoning |
| POST | `/api/ai/analyze` | Full hiring analysis (score, ATS, interviews) |

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/applications/apply` | Record application with AI content |
| GET | `/api/applications/` | Retrieve application history |

---

## Project Structure

```
smarthire-ai/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application entry point
│   │   ├── core/
│   │   │   └── config.py        # Settings and environment variables
│   │   ├── models/
│   │   │   └── schemas.py       # Pydantic data models
│   │   ├── routes/
│   │   │   ├── auth.py          # Authentication endpoints
│   │   │   ├── resumes.py       # Resume upload and parsing
│   │   │   ├── jobs.py          # Job feed proxy
│   │   │   ├── matches.py       # Matching engine endpoints
│   │   │   ├── ai.py            # OpenAI integration
│   │   │   └── applications.py  # Application tracking
│   │   ├── services/
│   │   │   ├── auth_service.py  # Password and JWT logic
│   │   │   ├── resume_service.py # Document parsing
│   │   │   ├── job_service.py   # External API client
│   │   │   ├── matching_service.py # SBERT + TF-IDF scoring
│   │   │   └── ai_service.py    # GPT-4 prompt engineering
│   │   └── utils/
│   │       └── database.py      # MongoDB connection management
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Router configuration
│   │   ├── api.js               # HTTP client with authentication
│   │   ├── context/
│   │   │   ├── AuthContext.jsx  # Authentication state
│   │   │   └── AppContext.jsx   # Application data state
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Site navigation
│   │   │   ├── Footer.jsx       # Site footer
│   │   │   ├── Layout.jsx       # Page wrapper
│   │   │   ├── JobCard.jsx      # Job listing component
│   │   │   ├── UploadModal.jsx  # Resume upload interface
│   │   │   ├── AnalysisResult.jsx # AI analysis display
│   │   │   ├── ApplicationAssistant.jsx # AI content generator
│   │   │   └── AutoApplyProgress.jsx # Application progress overlay
│   │   └── pages/
│   │       ├── Home.jsx         # Landing page
│   │       ├── Features.jsx     # Feature showcase
│   │       ├── Pricing.jsx      # Pricing tiers
│   │       ├── About.jsx        # Company information
│   │       ├── Contact.jsx      # Contact form
│   │       ├── Login.jsx        # Authentication
│   │       ├── Signup.jsx       # Registration
│   │       └── Dashboard.jsx    # Main application dashboard
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## Security

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens with configurable expiration (default 60 minutes)
- HTTP Bearer authentication on all protected endpoints
- CORS restricted to known origins in production
- All user data scoped to authenticated identity

---

## License

MIT License. Copyright (c) 2024 SmartHire AI, Inc.

---

*Built for modern talent teams.*

