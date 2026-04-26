from fastapi import APIRouter
from services.evaluator import evaluate
from services.report import generate_final_report
import uuid

router = APIRouter()

# 🔥 SESSION STORE
SESSIONS = {}


def get_session(session_id: str):
    return SESSIONS.setdefault(session_id, {
        "skills": [],
        "current_index": 0,
        "q_count_map": {},
        "history_map": {},
        "results": {},
        "candidate_skills": []
    })


# =============================
# 🟢 START
# =============================
@router.post("/start")
def start_interview(data: dict):

    # 🔥 NO LLM HERE (CRITICAL FIX)
    skills = ["Python", "SQL"]

    session_id = str(uuid.uuid4())
    sess = get_session(session_id)

    sess["skills"] = skills
    sess["candidate_skills"] = []
    sess["current_index"] = 0
    sess["results"] = {}
    sess["q_count_map"] = {}
    sess["history_map"] = {}

    first_skill = skills[0]

    sess["q_count_map"][first_skill] = 1
    sess["history_map"][first_skill] = []

    # 🔥 STATIC QUESTIONS (NO LLM)
    q1 = f"What are the core concepts of {first_skill}?"

    sess["history_map"][first_skill].append({
        "role": "ai",
        "content": q1
    })

    return {
        "session_id": session_id,
        "skills": skills,
        "candidate_skills": [],
        "current_skill": first_skill,
        "question": q1,
        "results": {}
    }


# =============================
# 🔵 ANSWER
# =============================
@router.post("/answer")
def answer_question(data: dict):

    session_id = data.get("session_id")
    answer = data.get("answer", "")

    if not session_id or session_id not in SESSIONS:
        return {
            "done": True,
            "final_report": {
                "fit_percentage": 0,
                "hiring_decision": "No",
                "summary": "Session expired or invalid"
            }
        }

    sess = get_session(session_id)

    skills = sess["skills"]
    idx = sess["current_index"]
    current_skill = skills[idx]

    sess["q_count_map"].setdefault(current_skill, 1)
    sess["history_map"].setdefault(current_skill, [])

    q_count = sess["q_count_map"][current_skill]

    print("🔥", current_skill, "| Q:", q_count)

    # SAVE USER ANSWER
    sess["history_map"][current_skill].append({
        "role": "user",
        "content": answer
    })

    # =============================
    # ASK NEXT QUESTION (MAX 3)
    # =============================
    if q_count < 3:

        questions = [
            f"Explain the fundamentals of {current_skill}.",
            f"What are real-world use cases of {current_skill}?",
            f"How would you apply {current_skill} in a project?"
        ]

        next_q = questions[q_count]

        sess["q_count_map"][current_skill] += 1

        sess["history_map"][current_skill].append({
            "role": "ai",
            "content": next_q
        })

        return {
            "done": False,
            "current_skill": current_skill,
            "question": next_q,
            "skills": skills,
            "results": sess["results"],
            "session_id": session_id
        }

    # =============================
    # EVALUATE AFTER 3 QUESTIONS
    # =============================
    eval_result = evaluate(
        current_skill,
        sess["history_map"][current_skill]
    )

    sess["results"][current_skill] = eval_result

    # =============================
    # MOVE TO NEXT SKILL
    # =============================
    if idx + 1 < len(skills):

        sess["current_index"] += 1
        next_skill = skills[idx + 1]

        sess["q_count_map"][next_skill] = 1
        sess["history_map"][next_skill] = []

        q1 = f"What are the core concepts of {next_skill}?"

        sess["history_map"][next_skill].append({
            "role": "ai",
            "content": q1
        })

        return {
            "done": False,
            "current_skill": next_skill,
            "question": q1,
            "skills": skills,
            "results": sess["results"],
            "session_id": session_id
        }

    # =============================
    # FINAL REPORT
    # =============================
    final_report = generate_final_report(
        results=sess["results"],
        required_skills=skills,
        candidate_skills=sess["candidate_skills"],
        gaps=None,
        adjacent=None
    )

    SESSIONS.pop(session_id, None)

    return {
        "done": True,
        "results": sess["results"],
        "final_report": final_report
    }