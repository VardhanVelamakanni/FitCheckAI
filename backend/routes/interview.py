from fastapi import APIRouter
from services.llm import ask_llm
from services.interviewer import next_step
from services.evaluator import evaluate
from services.skill_extractor import extract_skills
from services.roadmap import generate_roadmap
from services.report import generate_final_report
from services.adjacent_skills import get_adjacent_skills
from services.gap_analyzer import analyze_gaps

router = APIRouter()


# 🟢 START INTERVIEW
@router.post("/start")
def start_interview(data: dict):
    jd = data.get("jd", "")
    resume = data.get("resume", "")

    skills_data = extract_skills(jd, resume)

    required = skills_data.get("required", ["Python"])
    candidate = skills_data.get("candidate", [])

    skills = required[:2] if required else ["Python"]
    current_skill = skills[0]

    try:
        question = ask_llm(f"""
You are a senior technical interviewer.

Ask ONE clear beginner-level question to assess {current_skill}.

Rules:
- Only return the question
- No explanation
""")
    except Exception as e:
        print("LLM ERROR (start):", e)
        question = f"Explain the basics of {current_skill}."

    if not question or not isinstance(question, str):
        question = f"Explain the basics of {current_skill}."

    history = [{"role": "ai", "content": question}]

    return {
        "skills": skills,
        "candidate_skills": candidate,
        "current_skill": current_skill,
        "question": question,
        "history": history,
        "results": {}
    }


# 🔵 CONTINUE INTERVIEW
@router.post("/answer")
def answer_question(data: dict):

    current_skill = data.get("current_skill")
    history = data.get("history", [])
    answer = data.get("answer", "")
    skills = data.get("skills", [])
    results = data.get("results", {})
    candidate_skills = data.get("candidate_skills", [])

    if not current_skill:
        return {
            "done": True,
            "error": "Missing current_skill",
            "message": "Session lost. Please restart."
        }

    # Add user answer
    history.append({
        "role": "user",
        "content": answer
    })

    # 🔥 LIMIT QUESTIONS PER SKILL
    MAX_QUESTIONS_PER_SKILL = 3

    question_count = len([
        m for m in history if m["role"] == "user"
    ])

    # 🔥 WEAK ANSWER DETECTION
    weak_phrases = [
        "i don't know",
        "idk",
        "not sure",
        "forgot",
        "no idea",
        "umm",
        "uh",
        "maybe"
    ]

    is_weak = (
        len(answer.split()) <= 3 or
        any(p in answer.lower() for p in weak_phrases)
    )

    # 🧠 DECIDE NEXT STEP
    if question_count >= MAX_QUESTIONS_PER_SKILL:
        response = "EVALUATE"

    elif is_weak:
        response = f"""
It seems you're unsure.

💡 Hint:
Think about the basic concept of {current_skill}.

Try answering again briefly.
"""

    else:
        try:
            response = next_step(current_skill, history, answer)
        except Exception as e:
            print("next_step ERROR:", e)
            response = "EVALUATE"

    if not response or not isinstance(response, str):
        response = "EVALUATE"

    # 🔥 PREVENT REPEATING SAME QUESTION
    if len(history) >= 2:
        last_ai = history[-2]["content"] if history[-2]["role"] == "ai" else ""
        if response.strip() == last_ai.strip():
            response = f"Let's try a different angle.\nExplain a basic concept of {current_skill}."

    # 🔥 STRICT EVALUATE CHECK
    if response.strip().startswith("EVALUATE"):

        try:
            eval_result = evaluate(current_skill, history)
        except Exception as e:
            print("evaluate ERROR:", e)
            eval_result = {
                "level": "Beginner",
                "scores": {"conceptual": 5, "practical": 5, "clarity": 5},
                "overall": "Moderate",
                "strengths": [],
                "weaknesses": ["Evaluation failed"],
                "reason": "Fallback"
            }

        try:
            roadmap = generate_roadmap(current_skill, eval_result)
        except Exception as e:
            print("roadmap ERROR:", e)
            roadmap = []

        results[current_skill] = {
            "evaluation": eval_result,
            "roadmap": roadmap
        }

        # 🔄 NEXT SKILL
        try:
            current_index = skills.index(current_skill)
        except:
            current_index = 0

        if current_index + 1 < len(skills):
            next_skill = skills[current_index + 1]

            try:
                question = ask_llm(f"""
You are a senior technical interviewer.

Ask ONE beginner-level question to assess {next_skill}.
Only return the question.
""")
            except Exception as e:
                print("LLM ERROR (next skill):", e)
                question = f"Explain basics of {next_skill}."

            if not question:
                question = f"Explain basics of {next_skill}."

            return {
                "done": False,
                "current_skill": next_skill,
                "skills": skills,
                "candidate_skills": candidate_skills,
                "question": question,
                "history": [{"role": "ai", "content": question}],
                "results": results
            }

        # 🧠 FINAL PIPELINE
        try:
            gaps = analyze_gaps(skills, candidate_skills, results)
        except Exception as e:
            print("gap ERROR:", e)
            gaps = []

        try:
            adjacent = get_adjacent_skills(skills, candidate_skills)
        except Exception as e:
            print("adjacent ERROR:", e)
            adjacent = []

        # 🔥 SAFE OUTPUT
        if not isinstance(adjacent, list):
            adjacent = []

        try:
            final_report = generate_final_report(
                results,
                skills,
                candidate_skills,
                gaps,
                adjacent
            )
        except Exception as e:
            print("report ERROR:", e)
            final_report = {}

        return {
            "done": True,
            "results": results,
            "gaps": gaps,
            "adjacent_skills": adjacent,
            "final_report": final_report
        }

    # 🔁 CONTINUE SAME SKILL
    history.append({
        "role": "ai",
        "content": response
    })

    return {
        "done": False,
        "current_skill": current_skill,
        "skills": skills,
        "candidate_skills": candidate_skills,
        "question": response,
        "history": history,
        "results": results
    }