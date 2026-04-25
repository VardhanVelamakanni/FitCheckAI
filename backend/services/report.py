from services.llm import ask_llm
import json


def generate_final_report(results, required_skills, candidate_skills, gaps, adjacent):
    prompt = f"""
You are an expert hiring manager.

Evaluation:
{results}

Required skills:
{required_skills}

Candidate skills:
{candidate_skills}

Gaps:
{gaps}

Adjacent skills:
{adjacent}

Create a final hiring report.

IMPORTANT:
- Be realistic (not overly positive)
- Give clear reasoning
- Provide a % fit score

Return ONLY JSON:

{{
  "fit_percentage": number,
  "hiring_decision": "Hire | Maybe | No",
  "summary": "clear explanation",
  "strengths": [],
  "gaps": [],
  "next_steps": []
}}
"""

    response = ask_llm(prompt)

    try:
        return json.loads(response)
    except:
        return {
            "fit_percentage": 60,
            "hiring_decision": "Maybe",
            "summary": "",
            "strengths": [],
            "gaps": [],
            "next_steps": []
        }