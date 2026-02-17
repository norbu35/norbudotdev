from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import httpx
import uvicorn
import os

app = FastAPI()

# Configuration
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")
MODEL_NAME = os.getenv("MODEL_NAME", "llama3:8b")

class ChatRequest(BaseModel):
    prompt: str

@app.post("/api/chat")
async def chat_with_ai(request: ChatRequest):
    """
    Proxies the chat request to a local Ollama instance running on the VPS.
    """
    try:
        # Construct the prompt with system context
        full_prompt = f"""
        System: You are the AI Operating System for Norbu's portfolio website. 
        User is asking: {request.prompt}
        Answer concisely and in a helpful, slightly robotic/cyberpunk tone.
        """
        
        async with httpx.AsyncClient() as client:
            response = await client.post(OLLAMA_URL, json={
                "model": MODEL_NAME,
                "prompt": full_prompt,
                "stream": False
            }, timeout=30.0)
            
            if response.status_code != 200:
                raise HTTPException(status_code=500, detail="AI Core Malfunction")
                
            data = response.json()
            return {"response": data.get("response", "Error: No response from model.")}
            
    except Exception as e:
        print(f"Error connecting to Ollama: {e}")
        return {"response": "Error: Neural Link Offline. Please ensure the backend service is running."}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
