from services.llm import ask_llm


def next_step(skill, history, last_answer, projects=None):
    # convert projects list to readable string
    projects_text = ", ".join(projects) if projects else "None"

    prompt = f"""
You are a strict senior technical interviewer evaluating the skill: {skill}.

Candidate projects:
{projects_text}

Conversation so far:
{history}

Candidate's latest answer:
{last_answer}

Your task:
Decide ONE of the following:

1) Ask the next question:
   - If the answer is strong → ask a deeper, real-world or application-based question
   - If the answer is weak → simplify or ask for clarification/example
   - If projects are available, occasionally ask questions based on them
   - Questions should feel like a real technical interview

OR

2) If you have enough information (2–3 questions), respond ONLY with:
EVALUATE

Rules:
- Ask only ONE question at a time
- Do NOT include explanations
- Do NOT include reasoning
- Do NOT include extra text
- Use proper grammar and formatting
"""

    return ask_llm(prompt)