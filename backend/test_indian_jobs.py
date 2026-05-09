#!/usr/bin/env python3
"""
Test script for Indian job fetching functionality.
Run this to test the new job APIs integration.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.services.job_service import fetch_recent_jobs

def test_indian_jobs():
    """Test fetching Indian jobs."""
    print("🔍 Testing Indian job fetching...")

    try:
        # Test 1: Fetch all jobs in India
        print("\n📋 Fetching all jobs in India...")
        all_jobs = fetch_recent_jobs(location="India")
        print(f"✅ Found {len(all_jobs)} jobs in India")

        if all_jobs:
            print("\n📄 Sample job:")
            job = all_jobs[0]
            print(f"Title: {job['title']}")
            print(f"Company: {job['company']}")
            print(f"Location: {job['location']}")
            print(f"Source: {job['source']} ({job['source_region']})")
            print(f"Skills: {', '.join(job['skills_required'][:5])}...")

        # Test 2: Fetch developer jobs in India
        print("\n👨‍💻 Fetching Python developer jobs in India...")
        dev_jobs = fetch_recent_jobs(keyword="python developer", location="India")
        print(f"✅ Found {len(dev_jobs)} Python developer jobs in India")

        # Test 3: Show job sources
        print("\n📊 Job sources breakdown:")
        sources = {}
        for job in all_jobs[:20]:  # Check first 20 jobs
            source = job['source']
            sources[source] = sources.get(source, 0) + 1

        for source, count in sources.items():
            print(f"  {source}: {count} jobs")

        print("\n✅ Indian job fetching test completed successfully!")

    except Exception as e:
        print(f"❌ Error testing Indian jobs: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_indian_jobs()