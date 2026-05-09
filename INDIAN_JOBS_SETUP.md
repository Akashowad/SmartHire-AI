# Indian Job APIs Integration Guide

This guide explains how to fetch real job listings from India for your SmartHire AI application.

## Supported Job APIs

### 1. JSearch API (Recommended)
- **Website**: [RapidAPI JSearch](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)
- **Coverage**: Global jobs including comprehensive Indian job market
- **Pricing**: Free tier available, paid plans for higher limits
- **Setup**:
  1. Sign up at RapidAPI
  2. Subscribe to JSearch API
  3. Get your API key from the dashboard

### 2. Adzuna API
- **Website**: [Adzuna Jobs API](https://developer.adzuna.com/)
- **Coverage**: Indian job market specifically
- **Pricing**: Free tier with limited requests, paid plans available
- **Setup**:
  1. Sign up at Adzuna Developer Portal
  2. Create an application to get App ID and App Key

### 3. Remotive API (Already Integrated)
- **Coverage**: Global remote jobs
- **Pricing**: Free
- **No API key required**

## Environment Setup

1. **Copy environment file**:
   ```bash
   cp backend/.env.example backend/.env
   ```

2. **Add your API keys to `backend/.env`**:
   ```env
   JSEARCH_API_KEY=your_actual_jsearch_api_key
   ADZUNA_APP_ID=your_actual_adzuna_app_id
   ADZUNA_APP_KEY=your_actual_adzuna_app_key
   ```

## Testing the Integration

### Test Indian Jobs Fetching
```python
# In your Python shell or test file
from app.services.job_service import fetch_recent_jobs

# Fetch all Indian jobs
indian_jobs = fetch_recent_jobs(location="India")
print(f"Found {len(indian_jobs)} Indian jobs")

# Fetch developer jobs in India
dev_jobs = fetch_recent_jobs(keyword="python developer", location="India")
print(f"Found {len(dev_jobs)} Python developer jobs in India")
```

### API Endpoints
Your existing `/api/jobs` endpoint will now return Indian jobs when:
- `location` parameter contains "India" or is not specified
- API keys are properly configured

## Job Sources Included

When fetching jobs for India, the system will aggregate from:
1. **JSearch API**: Comprehensive job listings from multiple Indian job boards
2. **Adzuna API**: Direct Indian job market data
3. **Remotive API**: Remote jobs that may be available in India

## Features

- **Automatic deduplication**: Removes duplicate job listings
- **Skill extraction**: Automatically extracts skills from job descriptions
- **Caching**: 10-minute cache to reduce API calls and improve performance
- **Fallback handling**: If one API fails, others continue to work
- **Location filtering**: Filters jobs by location when specified

## Troubleshooting

### No Indian jobs appearing?
1. Check that API keys are set in `.env` file
2. Verify API keys are valid and have credits
3. Check backend logs for API errors
4. Test individual APIs directly

### API rate limits?
- JSearch: Check your RapidAPI plan limits
- Adzuna: Check your Adzuna plan limits
- Implement caching (already done) to reduce calls

### Want more job sources?
Consider adding:
- LinkedIn Jobs API (requires partnership)
- Naukri.com API (limited access)
- Indeed API (global with India focus)

## Cost Estimation

- **JSearch**: ~$0.01 per 100 requests (free tier available)
- **Adzuna**: Free tier with 100 requests/day
- **Remotive**: Free (no API key needed)

Total estimated cost: $0-5/month depending on usage.</content>
<parameter name="filePath">f:\SmartHire AI\INDIAN_JOBS_SETUP.md