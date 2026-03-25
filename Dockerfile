FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt
# Additionally install packages added during Phase 1
RUN pip install --no-cache-dir flask-restx schedule locust

# Copy application code
COPY backend/ ./backend/
COPY database/ ./database/
COPY ml/ ./ml/
COPY models/ ./models/
COPY app.py .

# Environment variables
ENV FLASK_APP=app.py
ENV FLASK_ENV=production
ENV PYTHONPATH=/app

# Expose port
EXPOSE 5000

# Run application
CMD ["python", "app.py"]
