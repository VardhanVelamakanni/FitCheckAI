import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENROUTER_API_KEY")

MODELS = [
    "qwen/qwen3-next-80b-a3b-instruct:free",   #  PRIMARY
    "openai/gpt-oss-20b:free",                 #  FALLBACK
    "meta-llama/llama-3.2-3b-instruct:free"    #  LAST
]


#  CLEAN RESPONSE
def clean_response(text: str) -> str:
    if not text:
        return ""

    text = text.replace("```json", "")
    text = text.replace("```", "")
    return text.strip()


#  SAFE LLM CALL (fail-fast + fallbacks)
def ask_llm(prompt: str) -> str:
    for model in MODELS:
        try:
            response = requests.post(
                url="https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {API_KEY}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:8000",
                    "X-OpenRouter-Title": "AI Skill Agent"
                },
                json={  #  use json= instead of data=
                    "model": model,
                    "messages": [
                        {
                            "role": "user",
                            "content": f"""
{prompt}

IMPORTANT:
- Do NOT include reasoning steps
- Do NOT include thinking traces
- Return ONLY the final answer
- Follow the required format strictly
"""
                        }
                    ],
                    "temperature": 0.5
                },
                timeout=15
            )

            #  FAIL FAST on rate limit
            if response.status_code == 429:
                print(f" {model} rate limited → skipping")
                continue

            #  Handle other HTTP errors
            if response.status_code != 200:
                print(f" {model} HTTP {response.status_code}")
                continue

            result = response.json()

            #  VALID RESPONSE
            if "choices" in result and len(result["choices"]) > 0:
                content = result["choices"][0]["message"]["content"]
                cleaned = clean_response(content)

                if cleaned:
                    print(f" Response from {model}")
                    return cleaned

            else:
                print(f" {model} invalid response:", result)

        except Exception as e:
            print(f" {model} error:", str(e))
            continue

    # FINAL FALLBACK 
    print(" All models failed — using fallback")
    return "EVALUATE"