import httpx
import logging
import uuid
from datetime import datetime
from typing import Optional, List, Dict

logger = logging.getLogger(__name__)

# In-memory cache to avoid hitting the API too frequently
_cache: Dict[str, dict] = {}
CACHE_TTL_SECONDS = 600  # 10 minutes

REMOTIVE_API_URL = "https://remotive.com/api/remote-jobs"


def _build_cache_key(keyword: Optional[str], location: Optional[str]) -> str:
    return f"{(keyword or '').lower().strip()}|{(location or '').lower().strip()}"


def _is_cache_valid(key: str) -> bool:
    if key not in _cache:
        return False
    cached_at = _cache[key].get("cached_at")
    if not cached_at:
        return False
    return (datetime.utcnow() - cached_at).total_seconds() < CACHE_TTL_SECONDS


def _extract_skills_from_tags(tags: List[str]) -> List[str]:
    """Convert raw Remotive tags into clean skill names."""
    skill_map = {
        "python": "Python", "java": "Java", "javascript": "Javascript",
        "react": "React", "react js": "React", "react native": "React Native",
        "node.js": "Node.js", "angular": "Angular", "angular ": "Angular",
        "vue": "Vue", "typescript": "Typescript", "typescript ": "Typescript",
        "aws": "AWS", "azure": "Azure", "gcp": "GCP",
        "docker": "Docker", "kubernetes": "Kubernetes",
        "sql": "SQL", "mongodb": "MongoDB", "postgresql": "PostgreSQL",
        "mysql": "MySQL", "redis": "Redis",
        "c++": "C++", "c#": "C#", "c": "C", "golang": "Go", "rust": "Rust",
        "ruby/rails": "Ruby on Rails", "php": "PHP", "scala": "Scala",
        "machine learning": "Machine Learning", "ai/ml": "Machine Learning",
        "deep learning": "Deep Learning", "data science": "Data Science",
        "nlp": "NLP", "tensorflow": "TensorFlow", "pytorch": "PyTorch",
        "flask": "Flask", "django": "Django", "fastapi": "FastAPI",
        "spring": "Spring", "laravel": "Laravel",
        ".net": ".NET", "ios": "iOS", "android": "Android",
        "git": "Git", "linux": "Linux", "ci/cd": "CI/CD",
        "html": "HTML", "css": "CSS", "sass": "SASS",
        "next.js": "Next.js", "express": "Express",
        "fullstack": "Full Stack", "backend": "Backend", "frontend": "Frontend",
        "devops": "DevOps", "data engineering": "Data Engineering",
        "big data": "Big Data", "spark": "Spark", "hadoop": "Hadoop",
        "blockchain": "Blockchain", "solidity": "Solidity",
        "saas": "SaaS", "api": "API", "graphql": "GraphQL",
        "figma": "Figma", "tableau": "Tableau",
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
    """Transform a Remotive API job into our internal schema."""
    tags = job.get("tags") or []
    skills = _extract_skills_from_tags(tags)

    # Use the publication date or fallback to now
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
    """Remove HTML tags from a string for plain text display."""
    import re
    # Remove HTML tags
    clean = re.sub(r'<[^>]+>', ' ', html_text)
    # Collapse whitespace
    clean = re.sub(r'\s+', ' ', clean).strip()
    return clean


def fetch_recent_jobs(location: Optional[str] = None, keyword: Optional[str] = None) -> List[dict]:
    """
    Fetches real remote job listings from the Remotive.com API.
    Supports filtering by keyword (search) and location.
    Results are cached for 10 minutes to respect rate limits.
    """
    cache_key = _build_cache_key(keyword, location)

    if _is_cache_valid(cache_key):
        logger.info(f"Returning cached jobs for key: {cache_key}")
        return _cache[cache_key]["jobs"]

    try:
        params = {"limit": 20}
        if keyword:
            params["search"] = keyword

        logger.info(f"Fetching real jobs from Remotive API with params: {params}")
        response = httpx.get(
            REMOTIVE_API_URL,
            params=params,
            headers={"User-Agent": "SmartHireAI/1.0"},
            timeout=15.0,
        )
        response.raise_for_status()
        data = response.json()
        raw_jobs = data.get("jobs", [])

        # Transform into our schema
        jobs = [_transform_remotive_job(j) for j in raw_jobs]

        # Apply location filter client-side (Remotive doesn't have a location param)
        if location:
            loc_lower = location.lower().strip()
            jobs = [j for j in jobs if loc_lower in j["location"].lower()]

        # Cache the result
        _cache[cache_key] = {"jobs": jobs, "cached_at": datetime.utcnow()}
        logger.info(f"Fetched {len(jobs)} real jobs from Remotive API")
        return jobs

    except Exception as e:
        logger.error(f"Failed to fetch jobs from Remotive API: {e}")
        # Return cached results if available (even if stale), otherwise empty
        if cache_key in _cache:
            logger.info("Returning stale cached jobs as fallback")
            return _cache[cache_key]["jobs"]
        return []
