from services.llm import ask_llm
import json


def generate_roadmap(skill, evaluation):
    prompt = f"""
You are an expert career mentor.

Skill: {skill}

Candidate evaluation:
{evaluation}

IMPORTANT:
- Use the weaknesses to build the roadmap
- Be specific and actionable
- Include real resources (YouTube, docs, platforms like LeetCode, Coursera)

Return ONLY JSON:

{{
  "focus_areas": ["area1", "area2"],
  "plan": [
    {{
      "topic": "what to learn",
      "why": "why this is needed",
      "resources": ["resource1", "resource2"],
      "practice": "how to practice",
      "time_estimate": "X days/weeks"
    }}
  ],
  "total_time": "overall time estimate",
  "difficulty": "Easy | Medium | Hard"
}}
"""

    response = ask_llm(prompt)

    try:
        return json.loads(response)
    except:
        return {
            "focus_areas": [],
            "plan": [],
            "total_time": "",
            "difficulty": ""
        }