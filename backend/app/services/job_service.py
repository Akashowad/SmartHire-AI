import httpx
import logging
import uuid
from datetime import datetime
from typing import Optional, List, Dict
from app.core.config import settings

logger = logging.getLogger(__name__)

# In-memory cache
_cache: Dict[str, dict] = {}
CACHE_TTL_SECONDS = 600

REMOTIVE_API_URL = "https://remotive.com/api/remote-jobs"

def _build_cache_key(keyword: Optional[str], location: Optional[str]) -> str:
    return f"{(keyword or '').lower().strip()}|{(location or '').lower().strip()}"

def _is_cache_valid(key: str) -> bool:
    if key not in _cache:
        return False
    cached_at = _cache[key].get("cached_at")
    return cached_at and (datetime.utcnow() - cached_at).total_seconds() < CACHE_TTL_SECONDS

def _extract_skills_from_tags(tags: List[str]) -> List[str]:
    skill_map = {
        "python": "Python", "java": "Java", "javascript": "Javascript",
        "react": "React", "react js": "React", "react native": "React Native",
        "node.js": "Node.js", "angular": "Angular", "vue": "Vue",
        "typescript": "Typescript", "aws": "AWS", "azure": "Azure", "gcp": "GCP",
        "docker": "Docker", "kubernetes": "Kubernetes", "sql": "SQL",
        "mongodb": "MongoDB", "postgresql": "PostgreSQL", "mysql": "MySQL",
        "machine learning": "Machine Learning", "ai/ml": "Machine Learning",
        "data science": "Data Science", "nlp": "NLP", "tensorflow": "TensorFlow",
        "pytorch": "PyTorch", "flask": "Flask", "django": "Django",
        "fastapi": "FastAPI", "html": "HTML", "css": "CSS", "git": "Git"
    }
    skills = []
    seen = set()
    for tag in tags:
        normalized = tag.lower().strip()
        if normalized in skill_map and skill_map[normalized] not in seen:
            skills.append(skill_map[normalized])
            seen.add(skill_map[normalized])
    return skills

def _transform_remotive_job(job: dict) -> dict:
    tags = job.get("tags") or []
    skills = _extract_skills_from_tags(tags)
    pub_date = job.get("publication_date") or datetime.utcnow().isoformat()

    return {
        "id": str(job.get("id", uuid.uuid4())),
        "title": job.get("title", "Untitled Position"),
        "company": job.get("company_name", "Unknown Company"),
        "company_logo": job.get("company_logo", ""),
        "description": _clean_html(job.get("description", "")),
        "excerpt": _clean_html(job.get("description", ""))[:300] + "...",
        "location": job.get("candidate_required_location") or "Worldwide",
        "posting_date": pub_date,
        "skills_required": skills,
        "apply_url": job.get("url", ""),
        "category": job.get("category", ""),
        "salary": job.get("salary", ""),
    }

def _clean_html(html_text: str) -> str:
    import re
    clean = re.sub(r'<[^>]+>', ' ', html_text)
    return re.sub(r'\s+', ' ', clean).strip()

def fetch_recent_jobs(location: Optional[str] = None, keyword: Optional[str] = None) -> List[dict]:
    """Fetches real remote job listings with caching and logging."""
    cache_key = _build_cache_key(keyword, location)

    if _is_cache_valid(cache_key):
        logger.info(f"Returning cached jobs for key: {cache_key}")
        return _cache[cache_key]["jobs"]

    try:
        params = {"limit": 20}
        if keyword:
            params["search"] = keyword

        logger.info(f"Fetching live jobs from Remotive API: {keyword or 'All'}")
        response = httpx.get(
            REMOTIVE_API_URL,
            params=params,
            headers={"User-Agent": f"{settings.PROJECT_NAME}/{settings.VERSION}"},
            timeout=15.0,
        )
        response.raise_for_status()
        raw_jobs = response.json().get("jobs", [])
        jobs = [_transform_remotive_job(j) for j in raw_jobs]

        if location:
            loc_lower = location.lower().strip()
            jobs = [j for j in jobs if loc_lower in j["location"].lower()]

        _cache[cache_key] = {"jobs": jobs, "cached_at": datetime.utcnow()}
        return jobs
    except Exception as e:
        logger.error(f"Failed to fetch jobs: {e}")
        return _cache.get(cache_key, {}).get("jobs", [])
