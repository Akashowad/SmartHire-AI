import pdfplumber
import spacy
from typing import Dict, List

# Load the spaCy model for Named Entity Recognition
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    import urllib.request
    print("Warning: spacy model not found. Proceeding without advanced NER")
    nlp = None

# A basic list of skills to match via simple text search if NER is insufficient
COMMON_SKILLS = [
    "python", "java", "c++", "c#", "javascript", "react", "node.js", "express",
    "fastapi", "django", "flask", "sql", "mysql", "postgresql", "mongodb",
    "docker", "kubernetes", "aws", "azure", "gcp", "machine learning",
    "deep learning", "nlp", "scikit-learn", "tensorflow", "pytorch",
    "html", "css", "git", "linux", "typescript", "angular", "vue"
]

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Takes PDF bytes and extracts text."""
    import io
    text = ""
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            selected_text = page.extract_text()
            if selected_text:
                text += selected_text + "\n"
    return text

def parse_resume(text: str) -> Dict:
    """Parses text to find skills, education, and experience."""
    skills_found = set()
    
    # 1. Simple Keyword Matching
    lower_text = text.lower()
    for skill in COMMON_SKILLS:
        if skill in lower_text:
            skills_found.add(skill.capitalize())
            
    education = []
    experience = []
    
    # 2. NLP Entity Extraction
    if nlp is not None:
        doc = nlp(text)
        for ent in doc.ents:
            if ent.label_ == "ORG":
                # Very basic heuristic for experience
                experience.append(ent.text)
            # You could add further rules for education (e.g., looking for "University")

    # Clean up and deduplicate
    experience = list(set([exp.strip() for exp in experience if len(exp.strip()) > 3]))[:10] # avoid too many noise words
    
    return {
        "skills": list(skills_found),
        "education": education,
        "experience": experience
    }
