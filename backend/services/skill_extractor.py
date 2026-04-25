from services.llm import ask_llm
import json


# 🔧 Normalize skill names (VERY IMPORTANT)
def normalize_skills(skills):
    mapping = {
        "ml": "Machine Learning",
        "machine learning": "Machine Learning",
        "deep learning": "Deep Learning",
        "dl": "Deep Learning",
        "python programming": "Python",
        "sql database": "SQL"
    }

    normalized = []
    for skill in skills:
        s = skill.strip()
        key = s.lower()
        normalized.append(mapping.get(key, s))

    # remove duplicates
    return list(set(normalized))


def extract_skills(jd, resume):
    prompt = f"""
You are an expert technical recruiter.

Extract key technical skills from the following:

Job Description:
{jd}

Resume:
{resume}

Instructions:
- Return ONLY valid JSON
- No explanation, no markdown
- Keep skill names short (e.g., Python, SQL, Machine Learning)
- Do not include soft skills

Output format:
{{
  "required": ["skill1", "skill2"],
  "candidate": ["skill1", "skill2"]
}}
"""

    response = ask_llm(prompt)

    try:
        data = json.loads(response)

        required = data.get("required", [])
        candidate = data.get("candidate", [])

        # normalize + clean
        required = normalize_skills(required)
        candidate = normalize_skills(candidate)

        return {
            "required": required,
            "candidate": candidate
        }

    except Exception as e:
        print("⚠️ Skill extraction failed:", e)
        print("Raw response:", response)

        # fallback (important for demo stability)
        return {
            "required": ["Python"],
            "candidate": []
        }