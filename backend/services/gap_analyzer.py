from services.llm import ask_llm
import json


def analyze_gaps(required_skills, candidate_skills, results):
    prompt = f"""
You are a hiring manager.

Job requires:
{required_skills}

Candidate has:
{candidate_skills}

Evaluation results:
{results}

Identify:

1. Missing skills
2. Weak skills
3. Why candidate is not fully ready

Return ONLY JSON:

{{
  "missing_skills": [],
  "weak_skills": [],
  "gap_summary": "clear explanation"
}}
"""

    response = ask_llm(prompt)

    try:
        return json.loads(response)
    except:
        return {
            "missing_skills": [],
            "weak_skills": [],
            "gap_summary": ""
        }