# SmartHire AI

An AI Job Assistant that analyzes your resume, fetches dynamic mock job listings, and helps you apply with AI-generated feedback and cover letters.

## Features
- **Resume Upload & Parsing**: Drop a PDF. It reads the text and extracts skills using spaCy NLP.
- **Job Fetching System**: Includes a mock API that simulates Adzuna by providing tech job entries.
- **Matching Engine**: Leverages scikit-learn's TF-IDF to calculate cosine similarity percentage.
- **AI Recommendation Module**: OpenAI integration to review your match and suggest skills to improve.
- **Application Assistant**: Automatic personalized cover letter and recruiter email generation.
- **Modern UI**: An aesthetic glassmorphism Dark Mode React portal.

## Tech Stack
- **Backend:** FastAPI, MongoDB (Motor), spaCy, scikit-learn, OpenAI API.
- **Frontend:** React, Vite, Vanilla CSS.

## Requirements
- Python 3.10+
- Node.js 18+
- MongoDB

## Setup Instructions

### 1. Environment Variables
Create a file named `.env` in the `backend/` directory:
```
MONGO_URI=mongodb://localhost:27017
DB_NAME=smarthire
OPENAI_API_KEY=your_openai_api_key_here
```

### 2. Backend Setup
1. Open a terminal in the root directory.
2. Create and activate a Virtual Environment:
```bash
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
```
3. Install dependencies:
```bash
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```
4. Run the server:
```bash
uvicorn backend.app.main:app --reload
```
The API runs at http://localhost:8000. Interactive Docs at http://localhost:8000/docs.

### 3. Frontend Setup
1. Open another terminal in the `frontend/` directory.
2. Install packages:
```bash
npm install
```
3. Run the development environment:
```bash
npm run dev
```

### Docker (Optional)
A `docker-compose.yml` is provided to spin up MongoDB alongside the app instances.
```bash
docker-compose up --build
```
