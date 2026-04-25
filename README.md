# SmartHire AI — Enterprise Recruitment Platform

SmartHire is a recruitment tool that parses resumes, matches candidates to jobs, and helps teams hire faster. It uses NLP for resume extraction, semantic matching for scoring, and GPT for generating cover letters and interview prep.

---

## Overview

SmartHire reads resumes, scores how well candidates fit open roles, and generates application materials. The goal is to cut down the manual parts of recruiting so teams can focus on talking to the right people.

---

## What It Does

| Capability | Description |
|------------|-------------|
| **Resume Parsing** | Pull skills, education, and experience out of PDF and DOCX files using spaCy |
| **Candidate Matching** | Compare resumes to job descriptions with SBERT + TF-IDF hybrid scoring |
| **Job Feed** | Pull in live remote job listings with keyword and location filters |
| **Content Generator** | Generate cover letters, recruiter emails, and interview questions with GPT |
| **Auto-Apply** | Browser automation to speed up application submission |
| **Analytics** | Track your pipeline, match scores, and hiring speed |
| **Security** | JWT auth, bcrypt passwords, role-based access control |

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

1. Upload a resume (PDF/DOCX) — it gets parsed for skills and experience
2. Browse live job listings pulled from external sources
3. See a match score for each candidate-job pair
4. Generate cover letters, emails, and interview questions
5. Track everything in a central dashboard

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, React Router, Lucide icons |
| **Backend** | FastAPI (Python), Service-Based Architecture, JWT Authentication |
| **Database** | MongoDB with Motor (Async Driver) |
| **AI/ML** | OpenAI GPT, spaCy, Sentence Transformers, scikit-learn |
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

## API

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

## Structure

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

*Built to save recruiting time.*

