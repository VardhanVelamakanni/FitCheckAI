from services.llm import ask_llm

def generate_final_report(results):
    prompt = f"""
You are an expert career evaluator.

Given the following skill evaluation results:

{results}

Generate a final candidate report.

Requirements:
- Be realistic and concise
- Identify strengths and weaknesses clearly
- Estimate overall job readiness
- Combine roadmap time into total estimate

Return ONLY valid JSON:

{{
  "summary": {{
    "strengths": ["..."],
    "weaknesses": ["..."],
    "overall_readiness": "Not Ready | Partially Ready | Job Ready",
    "confidence": "Low | Medium | High"
  }},
  "total_time_to_ready": "X weeks",
  "advice": "short actionable advice"
}}
"""
    return ask_llm(prompt)