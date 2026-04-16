from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List

def calculate_match(resume_text: str, job_description: str) -> float:
    """
    Calculates a match percentage using TF-IDF and Cosine Similarity.
    """
    # Create the Vectorizer
    vectorizer = TfidfVectorizer(stop_words='english')
    
    # Fit and transform the texts
    try:
        tfidf_matrix = vectorizer.fit_transform([resume_text, job_description])
        # Calculate cosine similarity between the first document (resume) and second (job)
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        # Return percentage
        return round(similarity * 100, 2)
    except Exception as e:
        print(f"Error calculating match: {e}")
        return 0.0

def extract_missing_skills(resume_skills: List[str], job_skills: List[str]) -> tuple:
    """
    Returns matching skills and missing skills.
    """
    res_set = set([s.lower() for s in resume_skills])
    job_set = set([s.lower() for s in job_skills])
    
    matching = job_set.intersection(res_set)
    missing = job_set.difference(res_set)
    
    return list(matching), list(missing)
