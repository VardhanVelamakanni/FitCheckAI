from services.llm import ask_llm

def next_step(skill, history, last_answer):
    prompt = f"""
You are a strict senior technical interviewer evaluating the skill: {skill}.

Conversation so far:
{history}

Candidate's latest answer:
{last_answer}

Your task:
Decide ONE of the following:

1) Ask the next question:
   - If the answer is strong → ask a deeper, real-world or application-based question
   - If the answer is weak → simplify or ask for clarification/example
   - Keep the question clear, natural, and well-formatted

OR

2) If you have enough information (2–3 questions), respond ONLY with:
EVALUATE

Rules:
- Ask only ONE question at a time
- Do NOT include explanations
- Do NOT include reasoning
- Do NOT include extra text
- Ensure proper grammar and spacing
"""

    return ask_llm(prompt)