import urllib.request
import json

urls = [
    "https://remotive.com/api/remote-jobs?limit=5",
    "https://www.arbeitnow.com/api/job-board-api"
]

for url in urls:
    try:
        print(f"Testing {url}")
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        resp = urllib.request.urlopen(req)
        data = json.loads(resp.read())
        
        if "remotive" in url:
            jobs = data.get("jobs", [])
            print(f"Remotive: Got {len(jobs)} jobs. First: {jobs[0]['title'] if jobs else 'None'}")
        else:
            jobs = data.get("data", [])
            print(f"Arbeitnow: Got {len(jobs)} jobs. First: {jobs[0]['title'] if jobs else 'None'}")
    except Exception as e:
        print(f"Failed {url}: {e}")
