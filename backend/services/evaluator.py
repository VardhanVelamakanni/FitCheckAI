from services.llm import ask_llm
import json


# 🔧 SAFE PARSE (LLM can return strings)
def safe_int(val, default=5):
    try:
        return int(val)
    except:
        try:
            return int(float(val))
        except:
            return default


def evaluate(skill, history):
    prompt = f"""
You are a strict senior technical interviewer.

Evaluate the candidate for the skill: {skill}

Conversation:
{history}

Rules:
- Be realistic
- Basic answers → 5–6
- Moderate → 6–7
- Strong → 7–9
- Exceptional → 9–10
- Avoid giving very high scores unless clearly deserved

Return ONLY valid JSON:

{{
  "level": "Beginner | Intermediate | Advanced",
  "scores": {{
    "conceptual": number,
    "practical": number,
    "clarity": number
  }},
  "strengths": [],
  "weaknesses": [],
  "reason": ""
}}
"""

    response = ask_llm(prompt)

    try:
        data = json.loads(response)

        scores = data.get("scores", {})

        conceptual = safe_int(scores.get("conceptual", 5))
        practical = safe_int(scores.get("practical", 5))
        clarity = safe_int(scores.get("clarity", 5))

        # =============================
        # 🔥 SCORE CALCULATION
        # =============================
        avg_score = (conceptual + practical + clarity) / 3
        percentage = round(avg_score * 10)

        # =============================
        # 🎯 FINAL TAG LOGIC (ALIGNED WITH REPORT)
        # =============================
        if percentage >= 65:
            level_tag = "good"
        elif percentage >= 50:
            level_tag = "okayish"
        else:
            level_tag = "bad"

        return {
            "level": data.get("level", "Intermediate"),
            "scores": {
                "conceptual": conceptual,
                "practical": practical,
                "clarity": clarity
            },
            "percentage": percentage,
            "tag": level_tag,
            "strengths": data.get("strengths", []),
            "weaknesses": data.get("weaknesses", []),
            "reason": data.get("reason", "")
        }

    except Exception as e:
        print("❌ Evaluation parsing failed:", e)
        print("Raw response:", response)

        # =============================
        # 🔥 STABLE FALLBACK
        # =============================
        return {
            "level": "Beginner",
            "scores": {
                "conceptual": 5,
                "practical": 5,
                "clarity": 5
            },
            "percentage": 50,
            "tag": "okayish",
            "strengths": [],
            "weaknesses": ["Evaluation failed"],
            "reason": "Fallback evaluation"
        }