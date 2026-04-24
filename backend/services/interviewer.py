from services.llm import ask_llm

def next_step(skill, history, last_answer):
    prompt = f"""
You are a senior technical interviewer evaluating the skill: {skill}.

Conversation so far:
{history}

Candidate's latest answer:
{last_answer}

Decide ONE of the following:

1) Ask the next question (adaptive):
   - If answer is strong → go deeper (application / design)
   - If weak → simplify or ask for example
   - Keep it concise

OR

2) If you have enough signal (2–3 questions), return:
EVALUATE

Rules:
- Ask only ONE question
- No explanations
- Natural interview tone
"""

    return ask_llm(prompt)