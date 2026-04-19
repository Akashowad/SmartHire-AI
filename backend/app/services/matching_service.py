import logging
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Tuple

logger = logging.getLogger(__name__)

def calculate_match(resume_text: str, job_description: str) -> float:
    """Calculates a match percentage using TF-IDF and Cosine Similarity."""
    if not resume_text or not job_description:
        logger.warning("Empty text provided for matching.")
        return 0.0

    try:
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform([resume_text, job_description])
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        match_score = round(similarity * 100, 2)
        logger.info(f"Calculated match score: {match_score}%")
        return match_score
    except Exception as e:
        logger.error(f"Error calculating match: {e}")
        return 0.0

def extract_missing_skills(resume_skills: List[str], job_skills: List[str]) -> Tuple[List[str], List[str]]:
    """Returns matching and missing skills between resume and job."""
    res_set = set([s.lower() for s in resume_skills])
    job_set = set([s.lower() for s in job_skills])
    
    matching = list(job_set.intersection(res_set))
    missing = list(job_set.difference(res_set))
    
    logger.debug(f"Skill analysis: {len(matching)} matching, {len(missing)} missing.")
    return matching, missing
