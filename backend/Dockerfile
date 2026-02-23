FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py .

# Use environment variable for Ollama host
ENV OLLAMA_URL="http://p-agt-nc-norbu-os-ollama:11434/api/generate"
ENV MODEL_NAME="norbu-os"

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]