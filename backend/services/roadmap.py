from services.llm import ask_llm

def generate_roadmap(skill, evaluation):
    prompt = f"""
You are a career mentor.

Candidate skill: {skill}

Evaluation:
{evaluation}

Create a personalized learning roadmap.

Rules:
- Be realistic (no hype)
- Focus on practical improvement
- Keep it concise
- Suggest only 2–4 steps

Return ONLY valid JSON:

{{
  "level": "Strong | Moderate | Weak",
  "gap": "What exactly the candidate lacks",
  "steps": [
    {{
      "title": "step name",
      "description": "what to do",
      "time": "estimated time"
    }}
  ],
  "total_time": "overall estimate"
}}
"""
    return ask_llm(prompt)