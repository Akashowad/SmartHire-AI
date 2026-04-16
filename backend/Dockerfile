FROM python:3.10-slim

WORKDIR /app

# Install system dependencies needed for spaCy, pdfplumber
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY ../requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN python -m spacy download en_core_web_sm

# Copy app code
COPY . .

# Run the Fastapi app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
