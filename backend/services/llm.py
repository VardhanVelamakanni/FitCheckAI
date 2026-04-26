import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENROUTER_API_KEY")

MODELS = [
    "qwen/qwen3-next-80b-a3b-instruct:free",
    "openai/gpt-oss-20b:free",
    "meta-llama/llama-3.2-3b-instruct:free"
]


#  CLEAN RESPONSE
def clean_response(text: str) -> str:
    if not text:
        return ""

    text = text.replace("```json", "")
    text = text.replace("```", "")
    return text.strip()


#  SAFE JSON PARSER
def try_parse_json(text: str):
    try:
        return json.loads(text)
    except:
        return None


#  CORE LLM CALL
def call_model(model: str, prompt: str):
    return requests.post(
        url="https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:8000",
            "X-OpenRouter-Title": "AI Skill Agent"
        },
        json={
            "model": model,
            "messages": [
                {
                    "role": "user",
                    "content": f"""
{prompt}

STRICT RULES:
- NO explanations
- NO reasoning
- NO markdown
- NO extra text
- Follow output format EXACTLY
"""
                }
            ],
            "temperature": 0.4,
            "max_tokens": 600
        },
        timeout=20
    )


#  MAIN FUNCTION
def ask_llm(prompt: str, expect_json: bool = False):

    for model in MODELS:
        for attempt in range(2):  #  retry per model
            try:
                response = call_model(model, prompt)

                #  rate limit → skip model
                if response.status_code == 429:
                    print(f" {model} rate limited → skipping")
                    break

                if response.status_code != 200:
                    print(f" {model} HTTP {response.status_code}")
                    continue

                result = response.json()

                if "choices" not in result or not result["choices"]:
                    print(f" {model} bad response format")
                    continue

                content = result["choices"][0]["message"]["content"]
                cleaned = clean_response(content)

                if not cleaned:
                    continue

                #  JSON mode (VERY IMPORTANT FOR YOUR APP)
                if expect_json:
                    parsed = try_parse_json(cleaned)
                    if parsed is not None:
                        print(f" JSON from {model}")
                        return parsed
                    else:
                        print(f" {model} invalid JSON → retry")
                        continue

                print(f" Response from {model}")
                return cleaned

            except Exception as e:
                print(f" {model} error:", str(e))
                continue

    # 🚨 FINAL FALLBACKS
    print(" All models failed")

    if expect_json:
        return {}

    return "Sorry, I couldn't process that. Let's continue."