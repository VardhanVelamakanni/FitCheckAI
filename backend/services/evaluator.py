from services.llm import ask_llm
import json


def evaluate(skill, history):
    prompt = f"""
You are a strict senior technical interviewer.

Evaluate the candidate for the skill: {skill}

Conversation:
{history}

IMPORTANT:
- Do NOT give perfect scores unless truly exceptional
- Basic correct answers = 5–7 range
- Reserve 9–10 for advanced, real-world depth
- Be realistic and critical

Return ONLY valid JSON (no markdown, no explanation):

{{
  "level": "Beginner | Intermediate | Advanced",
  "scores": {{
    "conceptual": number (1-10),
    "practical": number (1-10),
    "clarity": number (1-10)
  }},
  "overall": "Strong | Moderate | Weak",
  "strengths": ["point1", "point2"],
  "weaknesses": ["point1", "point2"],
  "reason": "brief explanation"
}}
"""

    response = ask_llm(prompt)

    try:
        data = json.loads(response)
        return data

    except Exception as e:
        print(" Evaluation parsing failed:", e)
        print("Raw response:", response)

        # fallback (VERY IMPORTANT for demo stability)
        return {
            "level": "Beginner",
            "scores": {
                "conceptual": 5,
                "practical": 5,
                "clarity": 5
            },
            "overall": "Moderate",
            "strengths": [],
            "weaknesses": ["Could not properly evaluate"],
            "reason": "Fallback evaluation"
        }