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

# API URLs and Keys
REMOTIVE_API_URL = "https://remotive.com/api/remote-jobs"
JSEARCH_API_URL = "https://jsearch.p.rapidapi.com/search"
ADZUNA_API_URL = "https://api.adzuna.com/v1/api/jobs"
JSEARCH_API_KEY = settings.JSEARCH_API_KEY if hasattr(settings, 'JSEARCH_API_KEY') else None
ADZUNA_APP_ID = settings.ADZUNA_APP_ID if hasattr(settings, 'ADZUNA_APP_ID') else None
ADZUNA_APP_KEY = settings.ADZUNA_APP_KEY if hasattr(settings, 'ADZUNA_APP_KEY') else None

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
        "publication_date": pub_date,
        "skills_required": skills,
        "apply_url": job.get("url", ""),
        "category": job.get("category", ""),
        "salary": job.get("salary", ""),
        "source": "Remotive",
        "source_region": "Global",
    }

def _transform_jsearch_job(job: dict) -> dict:
    """Transform JSearch API job data to our format."""
    skills = []
    if job.get("job_required_skills"):
        skills = [skill.strip() for skill in job["job_required_skills"].split(",") if skill.strip()]

    return {
        "id": str(job.get("job_id", uuid.uuid4())),
        "title": job.get("job_title", "Untitled Position"),
        "company": job.get("employer_name", "Unknown Company"),
        "company_logo": job.get("employer_logo", ""),
        "description": _clean_html(job.get("job_description", "")),
        "excerpt": _clean_html(job.get("job_description", ""))[:300] + "...",
        "location": job.get("job_city", "") + ", " + job.get("job_country", "") if job.get("job_city") else job.get("job_country", "India"),
        "publication_date": job.get("job_posted_at_datetime_utc", datetime.utcnow().isoformat()),
        "skills_required": skills,
        "apply_url": job.get("job_apply_link", ""),
        "category": job.get("job_employment_type", ""),
        "salary": job.get("job_min_salary", "") + " - " + job.get("job_max_salary", "") if job.get("job_min_salary") else "",
        "source": "JSearch",
        "source_region": "India",
    }

def _transform_adzuna_job(job: dict) -> dict:
    """Transform Adzuna API job data to our format."""
    skills = []
    if job.get("tags"):
        skills = [tag.strip() for tag in job["tags"] if tag.strip()]

    return {
        "id": str(job.get("id", uuid.uuid4())),
        "title": job.get("title", "Untitled Position"),
        "company": job.get("company", {}).get("display_name", "Unknown Company"),
        "company_logo": "",
        "description": _clean_html(job.get("description", "")),
        "excerpt": _clean_html(job.get("description", ""))[:300] + "...",
        "location": job.get("location", {}).get("display_name", "India"),
        "publication_date": job.get("created", datetime.utcnow().isoformat()),
        "skills_required": skills,
        "apply_url": job.get("redirect_url", ""),
        "category": job.get("contract_type", ""),
        "salary": job.get("salary_min", "") + " - " + job.get("salary_max", "") if job.get("salary_min") else "",
        "source": "Adzuna",
        "source_region": "India",
    }

def _clean_html(html_text: str) -> str:
    import re
    clean = re.sub(r'<[^>]+>', ' ', html_text)
    return re.sub(r'\s+', ' ', clean).strip()

def _fetch_jsearch_jobs(keyword: Optional[str] = None, location: Optional[str] = "India") -> List[dict]:
    """Fetch jobs from JSearch API (includes Indian jobs)."""
    if not JSEARCH_API_KEY:
        logger.warning("JSearch API key not configured")
        return []

    try:
        querystring = {
            "query": f"{keyword or 'developer'} in {location or 'India'}",
            "page": "1",
            "num_pages": "1",
            "country": "IN"  # India specific
        }

        headers = {
            "X-RapidAPI-Key": JSEARCH_API_KEY,
            "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
        }

        logger.info(f"Fetching jobs from JSearch API: {querystring['query']}")
        response = httpx.get(
            JSEARCH_API_URL,
            headers=headers,
            params=querystring,
            timeout=15.0,
        )
        response.raise_for_status()
        data = response.json()

        if data.get("status") == "OK":
            jobs = [_transform_jsearch_job(job) for job in data.get("data", [])]
            return jobs
        else:
            logger.error(f"JSearch API error: {data}")
            return []
    except Exception as e:
        logger.error(f"Failed to fetch from JSearch API: {e}")
        return []

def _fetch_adzuna_jobs(keyword: Optional[str] = None, location: Optional[str] = "India") -> List[dict]:
    """Fetch jobs from Adzuna API (Indian jobs)."""
    if not ADZUNA_APP_ID or not ADZUNA_APP_KEY:
        logger.warning("Adzuna API credentials not configured")
        return []

    try:
        # Adzuna uses country-specific endpoints
        url = f"{ADZUNA_API_URL}/in/search/1"
        params = {
            "app_id": ADZUNA_APP_ID,
            "app_key": ADZUNA_APP_KEY,
            "results_per_page": 20,
            "what": keyword or "developer",
            "where": location or "India"
        }

        logger.info(f"Fetching jobs from Adzuna API: {params['what']} in {params['where']}")
        response = httpx.get(url, params=params, timeout=15.0)
        response.raise_for_status()
        data = response.json()

        jobs = [_transform_adzuna_job(job) for job in data.get("results", [])]
        return jobs
    except Exception as e:
        logger.error(f"Failed to fetch from Adzuna API: {e}")
        return []

def fetch_recent_jobs(location: Optional[str] = None, keyword: Optional[str] = None) -> List[dict]:
    """Fetches real job listings from multiple sources including Indian jobs with caching and logging."""
    cache_key = _build_cache_key(keyword, location)

    if _is_cache_valid(cache_key):
        logger.info(f"Returning cached jobs for key: {cache_key}")
        return _cache[cache_key]["jobs"]

    try:
        all_jobs = []

        # Fetch from Remotive (global remote jobs)
        logger.info(f"Fetching global remote jobs from Remotive API: {keyword or 'All'}")
        remotive_jobs = _fetch_remotive_jobs(keyword, location)
        all_jobs.extend(remotive_jobs)

        # Fetch Indian jobs if location includes India or no location specified
        if not location or "india" in location.lower():
            logger.info(f"Fetching Indian jobs for: {keyword or 'All'}")

            # JSearch API (comprehensive job search)
            jsearch_jobs = _fetch_jsearch_jobs(keyword, "India")
            all_jobs.extend(jsearch_jobs)

            # Adzuna API (Indian job board)
            adzuna_jobs = _fetch_adzuna_jobs(keyword, "India")
            all_jobs.extend(adzuna_jobs)

        # Remove duplicates based on job ID
        seen_ids = set()
        unique_jobs = []
        for job in all_jobs:
            if job["id"] not in seen_ids:
                seen_ids.add(job["id"])
                unique_jobs.append(job)

        # Apply location filter if specified
        if location:
            loc_lower = location.lower().strip()
            if "india" not in loc_lower:
                # If not India-specific, filter by location
                unique_jobs = [j for j in unique_jobs if loc_lower in j["location"].lower()]

        # Sort by publication date (newest first)
        unique_jobs.sort(key=lambda x: x.get("publication_date", ""), reverse=True)

        # Limit results
        unique_jobs = unique_jobs[:50]  # Return up to 50 jobs

        _cache[cache_key] = {"jobs": unique_jobs, "cached_at": datetime.utcnow()}
        logger.info(f"Successfully fetched {len(unique_jobs)} unique jobs from {len(all_jobs)} total jobs")
        return unique_jobs

    except Exception as e:
        logger.error(f"Failed to fetch jobs: {e}")
        return _cache.get(cache_key, {}).get("jobs", [])

def _fetch_remotive_jobs(keyword: Optional[str] = None, location: Optional[str] = None) -> List[dict]:
    """Fetch jobs from Remotive API."""
    try:
        params = {"limit": 20}
        if keyword:
            params["search"] = keyword

        response = httpx.get(
            REMOTIVE_API_URL,
            params=params,
            headers={"User-Agent": f"{settings.PROJECT_NAME}/{settings.VERSION}"},
            timeout=15.0,
        )
        response.raise_for_status()
        raw_jobs = response.json().get("jobs", [])
        jobs = [_transform_remotive_job(j) for j in raw_jobs]
        return jobs
    except Exception as e:
        logger.error(f"Failed to fetch from Remotive API: {e}")
        return []
