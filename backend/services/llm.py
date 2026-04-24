import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENROUTER_API_KEY")

MODELS = [
    "google/gemma-4-26b-a4b-it:free",
    "openrouter/free",
    "meta-llama/llama-3.2-3b-instruct:free"
]


#  Clean model output (VERY IMPORTANT)
def clean_response(text):
    if not text:
        return ""

    # remove markdown wrappers
    text = text.replace("```json", "")
    text = text.replace("```", "")

    return text.strip()


def ask_llm(prompt):
    for model in MODELS:
        try:
            response = requests.post(
                url="https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {API_KEY}",
                    "HTTP-Referer": "http://localhost:8000",
                    "X-OpenRouter-Title": "AI Skill Agent"
                },
                data=json.dumps({
                    "model": model,
                    "messages": [
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    "temperature": 0.7
                }),
                timeout=30
            )

            result = response.json()

            #  Check valid response
            if "choices" in result and len(result["choices"]) > 0:
                content = result["choices"][0]["message"]["content"]
                return clean_response(content)

            else:
                print(f"❌ {model} failed response:", result)

        except Exception as e:
            print(f"⚠️ {model} error:", str(e))

    return "Error: All models failed"