from services.llm import ask_llm
import json


# 🔥 FALLBACK (CRITICAL FOR DEMO)
def fallback_roadmap(skill):
    return {
        "focus_areas": [f"Basics of {skill}"],
        "plan": [
            {
                "topic": f"Learn fundamentals of {skill}",
                "why": "Build strong foundation",
                "resources": [
                    "https://www.youtube.com/",
                    "https://www.w3schools.com/",
                    "https://leetcode.com/"
                ],
                "practice": "Solve beginner problems",
                "time_estimate": "3-5 days"
            }
        ],
        "total_time": "1 week",
        "difficulty": "Easy"
    }


# 🔥 CLEAN JSON RESPONSE
def clean_json(text):
    if not text:
        return ""

    text = text.replace("```json", "")
    text = text.replace("```", "")

    return text.strip()


def generate_roadmap(skill, evaluation):
    prompt = f"""
You are an expert career mentor.

Skill: {skill}

Candidate evaluation:
{evaluation}

IMPORTANT:
- Use weaknesses to create roadmap
- Keep it practical and realistic
- Include real links (YouTube, docs, LeetCode, Coursera)
- Give time estimates

Return ONLY valid JSON (no text, no explanation):

{{
  "focus_areas": ["area1", "area2"],
  "plan": [
    {{
      "topic": "what to learn",
      "why": "why this is needed",
      "resources": ["https://..."],
      "practice": "how to practice",
      "time_estimate": "X days/weeks"
    }}
  ],
  "total_time": "overall time estimate",
  "difficulty": "Easy | Medium | Hard"
}}
"""

    try:
        response = ask_llm(prompt)

        cleaned = clean_json(response)

        data = json.loads(cleaned)

        # 🔥 VALIDATION (VERY IMPORTANT)
        if not isinstance(data, dict):
            return fallback_roadmap(skill)

        if "plan" not in data or not isinstance(data["plan"], list):
            return fallback_roadmap(skill)

        return data

    except Exception as e:
        print("🚨 ROADMAP ERROR:", e)
        return fallback_roadmap(skill)