from services.llm import ask_llm
import re


# =============================
# 🔧 HELPERS
# =============================

def normalize(q):
    q = q.lower()
    q = re.sub(r'[^a-z0-9 ]', '', q)
    return q.strip()


def is_similar(q1, q2):
    q1_words = set(q1.split())
    q2_words = set(q2.split())
    overlap = len(q1_words & q2_words) / max(1, len(q1_words))
    return overlap > 0.6


# =============================
# 🎯 MAIN FUNCTION
# =============================

def next_step(skill, history, last_answer, projects=None):

    last_answer_lower = (last_answer or "").lower()
    projects_text = ", ".join(projects) if projects else "None"

    # 🔍 last AI question
    last_question = next(
        (msg["content"] for msg in reversed(history) if msg.get("role") == "ai"),
        None
    )

    # =============================
    # 🧠 INTENT HANDLING
    # =============================

    if any(w in last_answer_lower for w in ["explain", "elaborate", "clarify", "detail"]):
        return ask_llm(f"""
Explain clearly and simply:

"{last_question}"

- Use simple terms
- Give a real-world example
- DO NOT ask a new question
""") or "Let me explain that more clearly."

    if any(w in last_answer_lower for w in ["confused", "don't understand", "not sure"]):
        return ask_llm(f"""
Simplify this question:

"{last_question}"

- Very simple explanation
- Give analogy/example
- DO NOT ask a new question
""") or f"Let me simplify: {last_question}"

    if any(w in last_answer_lower for w in ["don't know", "dont know", "no idea"]):
        return f"No worries 👍 Let's try another question on {skill}."

    # =============================
    # 🔥 PREVIOUS QUESTIONS
    # =============================

    previous_questions = [
        normalize(msg["content"])
        for msg in history
        if msg.get("role") == "ai"
    ]

    question_count = len(previous_questions)

    # =============================
    # 🔥 HARD LIMIT (CRITICAL FIX)
    # =============================

    if question_count >= 4:
        print("🛑 MAX QUESTIONS REACHED → FORCE EVALUATE")
        return "EVALUATE"

    # =============================
    # 📈 DIFFICULTY PROGRESSION
    # =============================

    if question_count <= 1:
        difficulty = "basic"
    elif question_count == 2:
        difficulty = "intermediate"
    elif question_count == 3:
        difficulty = "scenario-based"
    else:
        difficulty = "advanced real-world"

    # =============================
    # 🧠 STRONG PROMPT
    # =============================

    prompt = f"""
You are a strict senior technical interviewer.

Skill: {skill}

Previous questions:
{previous_questions}

Candidate answer:
{last_answer}

Projects:
{projects_text}

TASK:

Ask ONE {difficulty} level question.

STRICT RULES:
- MUST be completely NEW
- MUST NOT repeat concepts
- MUST NOT rephrase previous questions
- MUST explore a DIFFERENT area of the skill
- If already asked about theory → ask practical
- If already asked practical → ask scenario/system design
- Make it feel like a real interview

IMPORTANT:
- No explanation
- No reasoning
- Only the question
"""

    # =============================
    # 🔁 RETRY LOOP
    # =============================

    for _ in range(5):
        response = ask_llm(prompt)

        if not response:
            continue

        cleaned = normalize(response)

        duplicate = any(
            cleaned == pq or
            cleaned in pq or
            pq in cleaned or
            is_similar(cleaned, pq)
            for pq in previous_questions
        )

        if not duplicate:
            print("✅ NEW QUESTION:", response)
            return response
        else:
            print("🚫 DUPLICATE BLOCKED:", response)

    # =============================
    # 🚨 FALLBACK
    # =============================

    return f"Describe a different real-world application of {skill} that has not been discussed yet."