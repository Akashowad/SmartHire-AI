# SmartHire AI 🚀

An AI-powered Job Assistant Agent that connects your career profile to the real world. SmartHire AI analyzes your resume (PDF/Word), matches you against **real live job listings**, and automates the application process using cutting-edge AI.

## 🌟 Key Features
- **Smart Resume Parsing**: Support for **PDF and Word (.docx)** uploads. Extracts skills and experience using spaCy NLP.
- **Real-Time Job Integration**: Integrated with the **Remotive API** to fetch 100% real, live remote job listings from top companies worldwide.
- **AI Matching Engine**: Uses scikit-learn's TF-IDF and Cosine Similarity to calculate a precise match percentage between your profile and live job descriptions.
- **AI Auto-Apply**: One-click "Auto-Apply" feature that uses OpenAI to generate tailored cover letters and recruiter outreach emails for specific roles.
- **Batch Application**: "Auto-Apply to Top Matches" functionality to process multiple high-fit opportunities simultaneously.
- **Premium UI/UX**: High-end glassmorphism design with dark mode, smooth transitions, and real-time AI progress animations.

## 🛠️ Tech Stack
- **Backend:** FastAPI, MongoDB (Motor), spaCy, scikit-learn, OpenAI API, python-docx, pdfplumber.
- **Frontend:** React, Vite, CSS3 (Glassmorphism), Lucide/Emoji-based iconography.

## 📋 Requirements
- Python 3.10+
- Node.js 18+
- MongoDB (Running locally or via Docker)
- OpenAI API Key (For AI features)

## 🚀 Setup Instructions

### 1. Environment Variables
Create a `.env` file in the `backend/` directory:
```env
MONGO_URI=mongodb://localhost:27017
DB_NAME=smarthire
OPENAI_API_KEY=sk-...
```

### 2. Backend Setup
```bash
# Navigate to backend
cd backend

# Install dependencies
pip install -r requirements.txt
pip install python-docx pdfplumber httpx

# Download NLP model
python -m spacy download en_core_web_sm

# Start the server
uvicorn app.main:app --reload --port 8000
```
*Interactive API documentation available at `http://localhost:8000/docs`*

### 3. Frontend Setup
```bash
# Navigate to frontend
cd frontend

# Install & Run
npm install
npm run dev
```
*Access the portal at `http://localhost:5173/`*

## 🐳 Docker Deployment
```bash
docker-compose up --build
```
