import logging
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Tuple

logger = logging.getLogger(__name__)

# Lazy-load SBERT model for semantic matching
_sbert_model = None

def _get_sbert_model():
    global _sbert_model
    if _sbert_model is None:
        try:
            from sentence_transformers import SentenceTransformer
            _sbert_model = SentenceTransformer('all-MiniLM-L6-v2')
            logger.info("SBERT model loaded successfully")
        except Exception as e:
            logger.warning(f"Could not load SBERT model: {e}. Falling back to TF-IDF.")
            _sbert_model = False
    return _sbert_model

def calculate_match(resume_text: str, job_description: str) -> float:
    """Calculates a match percentage using SBERT + TF-IDF hybrid scoring."""
    if not resume_text or not job_description:
        logger.warning("Empty text provided for matching.")
        return 0.0

    try:
        model = _get_sbert_model()
        if model and model is not False:
            import torch
            with torch.no_grad():
                emb1 = model.encode(resume_text, convert_to_tensor=True)
                emb2 = model.encode(job_description, convert_to_tensor=True)
                semantic_sim = float(torch.nn.functional.cosine_similarity(emb1.unsqueeze(0), emb2.unsqueeze(0))[0])
            # Also compute TF-IDF as a secondary signal
            vectorizer = TfidfVectorizer(stop_words='english')
            tfidf_matrix = vectorizer.fit_transform([resume_text, job_description])
            tfidf_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            # Hybrid: 70% semantic + 30% lexical
            match_score = round((semantic_sim * 0.7 + tfidf_sim * 0.3) * 100, 2)
            logger.info(f"Hybrid match score: {match_score}% (SBERT={semantic_sim:.3f}, TF-IDF={tfidf_sim:.3f})")
            return match_score
    except Exception as e:
        logger.warning(f"SBERT matching failed: {e}. Using TF-IDF only.")

    # Pure TF-IDF fallback
    try:
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform([resume_text, job_description])
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        match_score = round(similarity * 100, 2)
        logger.info(f"TF-IDF match score: {match_score}%")
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
