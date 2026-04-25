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
ADZUNA_API_URL = "https://api.adzuna.com/v1/api/jobs/in/search/1"

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
        "fastapi": "FastAPI", "html": "HTML", "css": "CSS", "git": "Git",
        "devops": "DevOps", "agile": "Agile", "scrum": "Scrum", "jira": "Jira",
        "linux": "Linux", "api": "API", "rest": "REST", "graphql": "GraphQL",
        "c++": "C++", "c#": "C#", "go": "Go", "rust": "Rust", "php": "PHP",
        "ruby": "Ruby", "swift": "Swift", "kotlin": "Kotlin", "scala": "Scala",
        "spring": "Spring", "laravel": "Laravel", "rails": "Rails", "express": "Express",
        "next.js": "Next.js", "nuxt": "Nuxt", "svelte": "Svelte", "tailwind": "Tailwind CSS",
        "bootstrap": "Bootstrap", "sass": "Sass", "webpack": "Webpack", "vite": "Vite",
        "jenkins": "Jenkins", "gitlab": "GitLab CI", "github actions": "GitHub Actions",
        "terraform": "Terraform", "ansible": "Ansible", "prometheus": "Prometheus",
        "grafana": "Grafana", "elasticsearch": "Elasticsearch", "redis": "Redis",
        "kafka": "Kafka", "rabbitmq": "RabbitMQ", "nginx": "Nginx", "apache": "Apache",
        "flutter": "Flutter", "react native": "React Native", "ionic": "Ionic",
        "android": "Android", "ios": "iOS", "unity": "Unity", "unreal": "Unreal Engine",
        "blender": "Blender", "figma": "Figma", "sketch": "Sketch", "adobe xd": "Adobe XD",
        "photoshop": "Photoshop", "illustrator": "Illustrator", "premiere": "Premiere Pro",
        "after effects": "After Effects", "davinci": "DaVinci Resolve", "ableton": "Ableton",
        "tableau": "Tableau", "power bi": "Power BI", "looker": "Looker", "spark": "Apache Spark",
        "hadoop": "Hadoop", "airflow": "Apache Airflow", "dbt": "dbt", "snowflake": "Snowflake",
        "bigquery": "BigQuery", "redshift": "Redshift", "databricks": "Databricks",
        "pandas": "Pandas", "numpy": "NumPy", "scipy": "SciPy", "matplotlib": "Matplotlib",
        "seaborn": "Seaborn", "plotly": "Plotly", "opencv": "OpenCV", "pillow": "Pillow",
        "selenium": "Selenium", "cypress": "Cypress", "jest": "Jest", "mocha": "Mocha",
        "pytest": "Pytest", "junit": "JUnit", "postman": "Postman", "insomnia": "Insomnia",
        "swagger": "Swagger", "openapi": "OpenAPI", "grpc": "gRPC", "protobuf": "Protocol Buffers",
        "webrtc": "WebRTC", "socket.io": "Socket.io", "websocket": "WebSocket",
        "oauth": "OAuth", "jwt": "JWT", "sso": "SSO", "ldap": "LDAP", "saml": "SAML",
        "ci/cd": "CI/CD", "tdd": "TDD", "bdd": "BDD", "ddd": "DDD", "microservices": "Microservices",
        "serverless": "Serverless", "faas": "FaaS", "paas": "PaaS", "iaas": "IaaS",
        "saas": "SaaS", "crm": "CRM", "erp": "ERP", "cms": "CMS", "headless": "Headless CMS",
        "jamstack": "Jamstack", "pwa": "PWA", "spa": "SPA", "ssr": "SSR", "ssg": "SSG",
        "csr": "CSR", "mpa": "MPA", "seo": "SEO", "accessibility": "Accessibility", "a11y": "A11y",
        "i18n": "i18n", "l10n": "l10n", "responsive": "Responsive Design", "mobile-first": "Mobile First",
        "ux": "UX Design", "ui": "UI Design", "design system": "Design System", "component library": "Component Library",
        "storybook": "Storybook", "chromatic": "Chromatic", "percy": "Percy", "lighthouse": "Lighthouse",
        "web vitals": "Web Vitals", "core web vitals": "Core Web Vitals", "performance": "Performance",
        "security": "Security", "penetration testing": "Penetration Testing", "vulnerability": "Vulnerability Scanning",
        "compliance": "Compliance", "gdpr": "GDPR", "hipaa": "HIPAA", "soc2": "SOC 2", "iso27001": "ISO 27001",
    }
    skills = []
    seen = set()
    for tag in tags:
        normalized = tag.lower().strip()
        if normalized in skill_map and skill_map[normalized] not in seen:
            skills.append(skill_map[normalized])
            seen.add(skill_map[normalized])
    return skills

def _extract_skills_from_description(description: str) -> List[str]:
    """Fallback skill extraction from job description text."""
    desc_lower = description.lower()
    common_skills = [
        "Python", "Java", "JavaScript", "TypeScript", "React", "Angular", "Vue", "Node.js",
        "Next.js", "Express", "Django", "Flask", "FastAPI", "Spring Boot", "Ruby on Rails",
        "PHP", "Laravel", "Go", "Rust", "C++", "C#", "Swift", "Kotlin", "Flutter",
        "React Native", "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform",
        "Jenkins", "GitLab CI", "GitHub Actions", "CircleCI", "Travis CI",
        "MongoDB", "PostgreSQL", "MySQL", "Redis", "Elasticsearch", "DynamoDB",
        "SQL", "NoSQL", "GraphQL", "REST API", "gRPC", "WebSocket",
        "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Keras",
        "Scikit-learn", "Pandas", "NumPy", "OpenCV", "NLP", "Computer Vision",
        "Data Science", "Big Data", "Spark", "Hadoop", "Kafka", "Airflow",
        "Tableau", "Power BI", "Looker", "Snowflake", "BigQuery", "dbt",
        "Linux", "Bash", "Shell Scripting", "PowerShell", "Nginx", "Apache",
        "Microservices", "Serverless", "CI/CD", "TDD", "Agile", "Scrum",
        "Git", "GitHub", "Bitbucket", "Jira", "Confluence", "Slack",
        "Figma", "Sketch", "Adobe XD", "InVision", "Principle", "Framer",
        "SEO", "Google Analytics", "Google Tag Manager", "Mixpanel", "Amplitude",
    ]
    found = []
    seen = set()
    for skill in common_skills:
        if skill.lower() in desc_lower and skill not in seen:
            found.append(skill)
            seen.add(skill)
    return found[:10]

def _transform_remotive_job(job: dict) -> dict:
    tags = job.get("tags") or []
    skills = _extract_skills_from_tags(tags)
    desc = _clean_html(job.get("description", ""))
    if not skills:
        skills = _extract_skills_from_description(desc)
    pub_date = job.get("publication_date") or datetime.utcnow().isoformat()

    location = job.get("candidate_required_location") or "Worldwide"
    if "india" in location.lower() or "asia" in location.lower():
        source_region = "India/APAC"
    elif "europe" in location.lower() or "uk" in location.lower() or "eu" in location.lower():
        source_region = "Europe"
    elif "america" in location.lower() or "usa" in location.lower() or "canada" in location.lower():
        source_region = "Americas"
    else:
        source_region = "Global"

    return {
        "id": f"rem-{job.get('id', uuid.uuid4())}",
        "title": job.get("title", "Untitled Position"),
        "company": job.get("company_name", "Unknown Company"),
        "company_logo": job.get("company_logo", ""),
        "description": desc,
        "excerpt": desc[:300] + "..." if len(desc) > 300 else desc,
        "location": location,
        "posting_date": pub_date,
        "skills_required": skills,
        "apply_url": job.get("url", ""),
        "category": job.get("category", ""),
        "salary": job.get("salary", ""),
        "source": "Remotive",
        "source_region": source_region,
        "job_type": "Remote",
    }

def _transform_adzuna_job(job: dict) -> dict:
    """Transform Adzuna India job to standard format."""
    title = job.get("title", "Untitled Position")
    company = job.get("company", {}).get("display_name", "Unknown Company")
    desc = _clean_html(job.get("description", ""))
    location = job.get("location", {}).get("display_name", "India")
    salary_max = job.get("salary_max")
    salary_min = job.get("salary_min")
    salary = ""
    if salary_min and salary_max:
        salary = f"Rs.{salary_min:,.0f} - Rs.{salary_max:,.0f}"
    elif salary_max:
        salary = f"Up to Rs.{salary_max:,.0f}"
    elif salary_min:
        salary = f"From Rs.{salary_min:,.0f}"

    skills = _extract_skills_from_description(desc)

    return {
        "id": f"adz-{job.get('id', uuid.uuid4())}",
        "title": title,
        "company": company,
        "company_logo": "",
        "description": desc,
        "excerpt": desc[:300] + "..." if len(desc) > 300 else desc,
        "location": location,
        "posting_date": job.get("created_at", datetime.utcnow().isoformat()),
        "skills_required": skills,
        "apply_url": job.get("redirect_url", ""),
        "category": job.get("category", {}).get("label", ""),
        "salary": salary,
        "source": "Adzuna India",
        "source_region": "India",
        "job_type": job.get("contract_type", "Full-time"),
    }

def _clean_html(html_text: str) -> str:
    import re
    clean = re.sub(r'<[^>]+>', ' ', html_text)
    return re.sub(r'\s+', ' ', clean).strip()

def _fetch_remotive_jobs(keyword: Optional[str], location: Optional[str]) -> List[dict]:
    """Fetch jobs from Remotive API."""
    try:
        params = {"limit": 20}
        if keyword:
            params["search"] = keyword

        logger.info(f"Fetching jobs from Remotive API: keyword={keyword}")
        response = httpx.get(
            REMOTIVE_API_URL,
            params=params,
            headers={"User-Agent": f"SmartHireAI/{settings.VERSION}"},
            timeout=15.0,
        )
        response.raise_for_status()
        raw_jobs = response.json().get("jobs", [])
        jobs = [_transform_remotive_job(j) for j in raw_jobs]

        if location:
            loc_lower = location.lower().strip()
            jobs = [j for j in jobs if loc_lower in j["location"].lower()]

        return jobs
    except Exception as e:
        logger.error(f"Remotive fetch failed: {e}")
        return []

def _fetch_adzuna_india_jobs(keyword: Optional[str], location: Optional[str]) -> List[dict]:
    """Fetch jobs from Adzuna India API (free tier)."""
    try:
        app_id = getattr(settings, 'ADZUNA_APP_ID', '')
        app_key = getattr(settings, 'ADZUNA_APP_KEY', '')

        if not app_id or not app_key:
            logger.info("Adzuna API credentials not configured, skipping")
            return []

        params = {
            "app_id": app_id,
            "app_key": app_key,
            "results_per_page": 20,
            "what": keyword or "",
            "where": location or "",
        }

        logger.info(f"Fetching jobs from Adzuna India: keyword={keyword}")
        response = httpx.get(
            ADZUNA_API_URL,
            params=params,
            timeout=15.0,
        )
        response.raise_for_status()
        raw_jobs = response.json().get("results", [])
        jobs = [_transform_adzuna_job(j) for j in raw_jobs]
        return jobs
    except Exception as e:
        logger.error(f"Adzuna fetch failed: {e}")
        return []

def _fetch_weworkremotely_jobs() -> List[dict]:
    """Fetch from We Work Remotely RSS (public, no API key)."""
    try:
        import xml.etree.ElementTree as ET

        logger.info("Fetching jobs from We Work Remotely RSS")
        response = httpx.get(
            "https://weworkremotely.com/remote-jobs.rss",
            timeout=15.0,
            headers={"User-Agent": f"SmartHireAI/{settings.VERSION}"}
        )
        response.raise_for_status()

        root = ET.fromstring(response.text)
        jobs = []
        for item in root.findall(".//item"):
            title = item.find("title")
            link = item.find("link")
            desc = item.find("description")
            pub_date = item.find("pubDate")

            if title is None:
                continue

            title_text = title.text or ""
            # Parse "Company: Title" format
            parts = title_text.split(": ", 1)
            company = parts[0] if len(parts) > 1 else "Unknown"
            job_title = parts[1] if len(parts) > 1 else title_text

            description = _clean_html(desc.text) if desc is not None else ""
            skills = _extract_skills_from_description(description)

            jobs.append({
                "id": f"wwr-{uuid.uuid4()}",
                "title": job_title,
                "company": company,
                "company_logo": "",
                "description": description,
                "excerpt": description[:300] + "..." if len(description) > 300 else description,
                "location": "Worldwide",
                "posting_date": pub_date.text if pub_date is not None else datetime.utcnow().isoformat(),
                "skills_required": skills,
                "apply_url": link.text if link is not None else "",
                "category": "",
                "salary": "",
                "source": "We Work Remotely",
                "source_region": "Global",
                "job_type": "Remote",
            })
        return jobs
    except Exception as e:
        logger.error(f"We Work Remotely fetch failed: {e}")
        return []

def fetch_recent_jobs(location: Optional[str] = None, keyword: Optional[str] = None, source_filter: Optional[str] = None) -> List[dict]:
    """
    Fetches real job listings from multiple sources with caching.

    Sources:
    - Remotive (global remote jobs)
    - Adzuna India (Indian jobs, requires API key)
    - We Work Remotely (global remote via RSS)
    """
    cache_key = f"{_build_cache_key(keyword, location)}|{source_filter or 'all'}"

    if _is_cache_valid(cache_key):
        logger.info(f"Returning cached jobs for key: {cache_key}")
        return _cache[cache_key]["jobs"]

    # Fetch from all sources in parallel
    remotive_jobs = _fetch_remotive_jobs(keyword, location)
    adzuna_jobs = _fetch_adzuna_india_jobs(keyword, location)
    wwr_jobs = _fetch_weworkremotely_jobs()

    all_jobs = remotive_jobs + adzuna_jobs + wwr_jobs

    # Deduplicate by title + company
    seen = set()
    deduped = []
    for job in all_jobs:
        key = f"{job['title']}|{job['company']}"
        if key not in seen:
            seen.add(key)
            deduped.append(job)

    # Sort by posting date (newest first)
    deduped.sort(key=lambda x: x.get("posting_date", ""), reverse=True)

    # Apply source filter if provided
    if source_filter:
        deduped = [j for j in deduped if source_filter.lower() in j.get("source", "").lower()]

    _cache[cache_key] = {"jobs": deduped, "cached_at": datetime.utcnow()}
    logger.info(f"Fetched {len(deduped)} jobs total (Remotive: {len(remotive_jobs)}, Adzuna: {len(adzuna_jobs)}, WWR: {len(wwr_jobs)})")
    return deduped
