from services.llm import ask_llm
import json


def generate_final_report(results, required_skills, candidate_skills, gaps, adjacent):

    # =============================
    # 🔥 EXTRACT SCORES
    # =============================
    percentages = [
        v.get("percentage", 50)
        for v in results.values()
        if isinstance(v, dict)
    ]

    if not percentages:
        avg_percentage = 50
    else:
        avg_percentage = sum(percentages) / len(percentages)

    avg_percentage = round(avg_percentage)

    # =============================
    # 🎯 DECISION LOGIC (FIXED)
    # =============================
    if avg_percentage < 40:
        decision = "No"
    elif avg_percentage <= 60:
        decision = "Maybe"
    else:
        decision = "Hire"

    final_score = avg_percentage

    # =============================
    # 🔍 GAP ANALYSIS (PER SKILL)
    # =============================
    weak_skills = [
        k for k, v in results.items()
        if isinstance(v, dict) and v.get("tag") != "good"
    ]

    strong_skills = [
        k for k, v in results.items()
        if isinstance(v, dict) and v.get("tag") == "good"
    ]

    # =============================
    # 🧠 LLM: ADJACENT SKILLS + PLAN
    # =============================
    try:
        plan_response = ask_llm(f"""
You are a senior career mentor.

Required skills:
{required_skills}

Candidate skills:
{candidate_skills}

Weak skills:
{weak_skills}

Suggest:

1) Adjacent skills the candidate can realistically learn next
2) A structured learning plan

Return ONLY JSON:

{{
  "adjacent_skills": [
    {{
      "skill": "name",
      "reason": "why relevant"
    }}
  ],
  "learning_plan": [
    {{
      "skill": "skill name",
      "topics": ["topic1", "topic2"],
      "resources": ["resource1", "resource2"],
      "time_estimate": "X weeks"
    }}
  ]
}}
""")

        parsed = json.loads(plan_response)

        adjacent_skills = parsed.get("adjacent_skills", [])
        learning_plan = parsed.get("learning_plan", [])

    except Exception as e:
        print("⚠️ PLAN ERROR:", e)

        adjacent_skills = []
        learning_plan = []

    # =============================
    # 🧠 SUMMARY
    # =============================
    try:
        summary = ask_llm(f"""
You are a hiring manager.

Required skills:
{required_skills}

Candidate skills:
{candidate_skills}

Results:
{results}

Write a concise hiring summary.

Rules:
- 2–3 lines
- Mention strengths
- Mention gaps
- Be realistic
""")
    except:
        summary = ""

    # =============================
    # 🔥 FINAL OUTPUT
    # =============================
    final_report = {
        "fit_percentage": final_score,
        "hiring_decision": decision,
        "summary": summary or f"Overall performance: {final_score}%",
        "strengths": strong_skills,
        "gaps": weak_skills,

        # 🔥 NEW FEATURES
        "adjacent_skills": adjacent_skills,
        "learning_plan": learning_plan,

        "next_steps": [
            "Focus on weak skills",
            "Build real-world projects",
            "Strengthen fundamentals"
        ]
    }

    return final_report