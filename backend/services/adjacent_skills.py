from services.llm import ask_llm
import json


# 🔥 FALLBACK (CRITICAL)
def fallback_adjacent(required):
    return [
        {
            "skill": f"Advanced {required[0] if required else 'Programming'}",
            "reason": "Natural progression from current skills"
        }
    ]


# 🔥 CLEAN JSON
def clean_json(text):
    if not text:
        return ""

    text = text.replace("```json", "")
    text = text.replace("```", "")

    return text.strip()


def get_adjacent_skills(required, candidate):
    prompt = f"""
You are a career strategist.

Candidate skills:
{candidate}

Target job requires:
{required}

Suggest 3-5 adjacent skills that:
- are closest to candidate’s current level
- are practical to learn next
- improve job readiness quickly

Return ONLY valid JSON (no explanation):

{{
  "adjacent_skills": [
    {{
      "skill": "name",
      "reason": "why it's a smart next step"
    }}
  ]
}}
"""

    try:
        response = ask_llm(prompt)

        cleaned = clean_json(response)

        data = json.loads(cleaned)

        # 🔥 VALIDATION
        if not isinstance(data, dict):
            return fallback_adjacent(required)

        skills = data.get("adjacent_skills", [])

        if not isinstance(skills, list):
            return fallback_adjacent(required)

        # ensure each item is valid
        valid = []
        for s in skills:
            if isinstance(s, dict) and "skill" in s:
                valid.append({
                    "skill": s.get("skill", ""),
                    "reason": s.get("reason", "")
                })

        return valid if valid else fallback_adjacent(required)

    except Exception as e:
        print("🚨 ADJACENT SKILLS ERROR:", e)
        return fallback_adjacent(required)