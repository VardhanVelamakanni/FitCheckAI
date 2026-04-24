from services.llm import ask_llm

def evaluate(skill, history):
    prompt = f"""
You are a strict senior technical interviewer.

Evaluate the candidate for {skill}.

Conversation:
{history}

IMPORTANT:
- Do NOT give perfect scores unless truly exceptional
- Basic correct answers = 5–7 range
- Reserve 9–10 for advanced, real-world depth

Return ONLY valid JSON (no markdown, no explanation):

{{
  "conceptual": number (1-10),
  "practical": number (1-10),
  "clarity": number (1-10),
  "overall": "Strong | Moderate | Weak",
  "reason": "brief explanation"
}}
"""

    return ask_llm(prompt)