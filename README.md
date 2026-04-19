# SmartHire AI - Next-Gen Career Assistant 🚀

SmartHire AI is a premium, AI-powered SaaS application designed to help job seekers find and apply for real-world remote opportunities with ease. Using advanced NLP and GPT-powered intelligence, it matches your skills to live job feeds and generates tailored application materials in seconds.

## ✨ Key Features

*   **🔍 Live Remote Job Feed**: Fetches real-time listings from the Remotive API.
*   **🧠 Intelligent Matching**: Uses TF-IDF & Cosine Similarity to calculate a 0-100% compatibility score.
*   **📄 AI Resume Parsing**: Automated extraction of skills, education, and experience from PDF/Word files.
*   **✉️ AI Apply Assist**: Generates professional cover letters and recruiter email templates tailored to each role.
*   **🚀 Batch Auto-Apply**: Apply to multiple top-matching jobs with AI-tailored content in one click.
*   **📊 Application History**: Track all your AI-processed applications in a centralized dashboard.
*   **🎨 Premium UI**: Stunning Dark Glassmorphism design system built for professional users.

## 🛠️ Tech Stack

*   **Frontend**: React, Vite, Context API, Vanilla CSS (Glassmorphism)
*   **Backend**: FastAPI (Python), Service-Based Architecture
*   **Database**: MongoDB (Persistence)
*   **AI/ML**: OpenAI GPT-3.5, spaCy (NLP), scikit-learn (TF-IDF)
*   **API**: Remotive Public API

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   Python (3.10+)
*   MongoDB Instance
*   OpenAI API Key

### Backend Setup
1. `cd backend`
2. `pip install -r requirements.txt`
3. Create a `.env` file with `OPENAI_API_KEY`, `MONGO_URI`, and `DB_NAME`.
4. `uvicorn app.main:app --reload`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## ⚖️ License
MIT License. Created by [Akashowad](https://github.com/Akashowad).
