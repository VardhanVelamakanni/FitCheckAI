from services.llm import ask_llm
import json


def get_adjacent_skills(required, candidate):
    prompt = f"""
You are a career strategist.

Candidate skills:
{candidate}

Target job requires:
{required}

Suggest adjacent skills that:
- are closest to candidate’s current knowledge
- give fastest improvement toward the job

Return ONLY JSON:

{{
  "adjacent_skills": [
    {{
      "skill": "name",
      "reason": "why it's a smart next step"
    }}
  ]
}}
"""

    response = ask_llm(prompt)

    try:
        return json.loads(response)
    except:
        return {"adjacent_skills": []}