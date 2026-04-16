from datetime import datetime, timedelta
import uuid

# Mock dataset for jobs
MOCK_JOBS = [
    {
        "id": str(uuid.uuid4()),
        "title": "Senior Frontend Developer",
        "company": "Tech Innovators Inc",
        "description": "We are looking for a Senior Frontend Developer to build dynamic web applications. You should be proficient in React, Javascript, and Modern CSS. Knowledge of Node.js is a plus.",
        "location": "Remote",
        "posting_date": datetime.utcnow().isoformat(),
        "skills_required": ["React", "Javascript", "CSS", "Node.js", "Html"]
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Machine Learning Engineer",
        "company": "AI Solutions",
        "description": "Join our AI team! Required experience in Python, Scikit-learn, TensorFlow, and NLP techniques.",
        "location": "New York, NY",
        "posting_date": (datetime.utcnow() - timedelta(hours=5)).isoformat(),
        "skills_required": ["Python", "Scikit-learn", "Tensorflow", "Nlp", "Machine Learning"]
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Backend Python Developer",
        "company": "DataCorp",
        "description": "Looking for a fast backend engineer to work with FastAPI, PostgreSQL, and AWS.",
        "location": "San Francisco, CA",
        "posting_date": (datetime.utcnow() - timedelta(hours=10)).isoformat(),
        "skills_required": ["Python", "Fastapi", "Postgresql", "Aws", "Sql", "Git"]
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Full Stack Engineer",
        "company": "StartupX",
        "description": "Versatile full stack developer needed. Stack: MongoDB, Express, React, Node.js (MERN) and Docker.",
        "location": "Remote",
        "posting_date": (datetime.utcnow() - timedelta(hours=2)).isoformat(),
        "skills_required": ["Mongodb", "Express", "React", "Node.js", "Docker", "Typescript"]
    }
]

def fetch_recent_jobs(location: str = None, keyword: str = None):
    """
    Simulates fetching jobs from an external API (like Adzuna) with filters.
    Returns jobs posted in the last 24 hours.
    """
    # In a real scenario, make an HTTP request here with query params
    filtered = MOCK_JOBS
    
    if location:
        filtered = [j for j in filtered if location.lower() in j["location"].lower()]
    if keyword:
        filtered = [j for j in filtered if keyword.lower() in j["title"].lower() or keyword.lower() in j["description"].lower()]
        
    return filtered

