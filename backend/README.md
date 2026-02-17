# Norbu.dev AI Backend

This simple Python service connects your static website to a local Large Language Model (LLM) running on your VPS.

## Prerequisites

1.  **Ollama**: Install on your VPS (Linux)
    ```bash
    curl -fsSL https://ollama.com/install.sh | sh
    ollama run llama3:8b
    ```

2.  **Python 3.10+**: Ensure Python is installed.

## Setup

1.  Create a virtual environment:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

2.  Install dependencies:
    ```bash
    pip install fastapi uvicorn httpx pydantic
    ```

3.  Run the server:
    ```bash
    export OLLAMA_URL="http://localhost:11434/api/generate"
    python3 main.py
    ```

## Nginx Configuration (Important!)

Since your website is hosted on `https://norbu.dev`, you need to configure Nginx to proxy `/api/chat` requests to this Python service running on port 8000.

Add this to your Nginx site config:

```nginx
location /api/ {
    proxy_pass http://localhost:8000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

Once this is running, the `chat [message]` command in your terminal will work!
