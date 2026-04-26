from services.llm import ask_llm
import json


def analyze_gaps(required_skills, candidate_skills, results):

    # 🔥 CLEAN INPUTS
    required_skills = [s.strip() for s in required_skills if isinstance(s, str)]
    candidate_skills = [s.strip() for s in candidate_skills if isinstance(s, str)]

    # =============================
    # 🧠 CORE GAP LOGIC (NO LLM)
    # =============================

    missing_skills = [
        skill for skill in required_skills
        if skill not in candidate_skills
    ]

    weak_skills = [
        skill for skill, data in results.items()
        if data.get("level") in ["bad", "okayish"]
    ]

    strong_skills = [
        skill for skill, data in results.items()
        if data.get("level") == "good"
    ]

    print("📊 GAP DEBUG:")
    print("Missing:", missing_skills)
    print("Weak:", weak_skills)
    print("Strong:", strong_skills)

    # =============================
    # 🧠 GENERATE SUMMARY (LLM ONLY FOR TEXT)
    # =============================
    try:
        summary = ask_llm(f"""
You are a hiring manager.

Required skills:
{required_skills}

Candidate skills:
{candidate_skills}

Strong skills:
{strong_skills}

Weak skills:
{weak_skills}

Missing skills:
{missing_skills}

Write a concise hiring gap summary.

Rules:
- Be realistic
- Mention strengths briefly
- Focus on gaps
- 2–3 lines max
""")
    except:
        summary = ""

    return {
        "missing_skills": missing_skills,
        "weak_skills": weak_skills,
        "gap_summary": summary or "Candidate needs improvement in key required areas."
    }