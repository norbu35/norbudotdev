from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import httpx
import uvicorn
import os

# Rate Limiter Setup
limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS Configuration (Strict)
origins = [
    "https://norbu.dev",
    "https://www.norbu.dev",
    "http://localhost:1111", # Dev env
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["*"],
)

# Configuration
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")
MODEL_NAME = os.getenv("MODEL_NAME", "norbu-os")

class ChatRequest(BaseModel):
    prompt: str = Field(..., max_length=200, description="User prompt, max 200 chars")

@app.post("/api/chat")
@limiter.limit("5/minute")
async def chat_with_ai(request: Request, body: ChatRequest):
    """
    Proxies chat request to local Ollama instance with strict safeguards.
    """
    try:
        # Construct the prompt with system context
        full_prompt = f"""
        System: You are the AI Operating System for Norbu's portfolio website. 
        User is asking: {body.prompt}
        Answer concisely and in a helpful, slightly robotic/cyberpunk tone.
        """
        
        async with httpx.AsyncClient() as client:
            response = await client.post(OLLAMA_URL, json={
                "model": MODEL_NAME,
                "prompt": full_prompt,
                "stream": False,
                "options": {
                    "num_ctx": 2048,      # Limit context window memory
                    "num_predict": 150,   # Limit response length (tokens)
                    "temperature": 0.7,   # Creativity balance
                    "top_k": 40,
                    "top_p": 0.9,
                }
            }, timeout=15.0) # Strict timeout
            
            if response.status_code != 200:
                print(f"Ollama Error: {response.text}")
                raise HTTPException(status_code=500, detail="AI Core Malfunction")
                
            data = response.json()
            return {"response": data.get("response", "Error: No response from model.")}
            
    except httpx.ReadTimeout:
        return {"response": "Error: Neural Link Timeout. System busy."}
    except Exception as e:
        print(f"Error connecting to Ollama: {e}")
        return {"response": "Error: Neural Link Offline. Backend service unavailable."}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
