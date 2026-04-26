from services.llm import ask_llm
import json


# 🔥 NORMALIZATION (STRONG)
def normalize_skills(skills):

    mapping = {
        "ml": "Machine Learning",
        "machine learning": "Machine Learning",
        "deep learning": "Deep Learning",
        "dl": "Deep Learning",
        "python": "Python",
        "python programming": "Python",
        "sql": "SQL",
        "sql database": "SQL",
        "databases": "SQL",
        "mysql": "SQL",
        "postgresql": "SQL",
        "rest api": "REST APIs",
        "rest apis": "REST APIs",
        "api": "REST APIs",
        "apis": "REST APIs",
        "git version control": "Git",
        "version control": "Git",
    }

    normalized = []
    seen = set()

    for skill in skills:
        s = skill.strip().lower()

        # map → then title case
        mapped = mapping.get(s, s.title())

        if mapped not in seen:
            normalized.append(mapped)
            seen.add(mapped)

    return normalized  # ✅ preserves order


def extract_skills(jd, resume):
    prompt = f"""
You are an expert technical recruiter.

Extract key technical skills AND important projects.

Job Description:
{jd}

Resume:
{resume}

Rules:
- Return ONLY JSON
- Skills must be short (Python, SQL, Git)
- No soft skills
- No duplicates
- Extract 1–3 project names

Format:
{{
  "required": ["skill1"],
  "candidate": ["skill1"],
  "projects": ["project1"]
}}
"""

    response = ask_llm(prompt)

    try:
        data = json.loads(response)

        required = normalize_skills(data.get("required", []))
        candidate = normalize_skills(data.get("candidate", []))

        projects = [
            p.strip()
            for p in data.get("projects", [])
            if isinstance(p, str) and p.strip()
        ]

        # remove duplicates but KEEP ORDER
        seen = set()
        projects_clean = []
        for p in projects:
            if p not in seen:
                projects_clean.append(p)
                seen.add(p)

        return {
            "required": required,
            "candidate": candidate,
            "projects": projects_clean
        }

    except Exception as e:
        print("❌ Skill extraction failed:", e)
        print("Raw response:", response)

        return {
            "required": ["Python"],
            "candidate": [],
            "projects": []
        }