from fastapi import APIRouter
from services.llm import ask_llm
from services.interviewer import next_step
from services.evaluator import evaluate
from services.skill_extractor import extract_skills
from services.roadmap import generate_roadmap
from services.report import generate_final_report

router = APIRouter()


#  START INTERVIEW
@router.post("/start")
def start_interview(data: dict):
    jd = data.get("jd", "")
    resume = data.get("resume", "")

    skills_data = extract_skills(jd, resume)
    required = skills_data.get("required", ["Python"])

    # limit to 2 skills for hackathon simplicity
    skills = required[:2]
    current_skill = skills[0]

    prompt = f"""
You are a senior technical interviewer.

Ask ONE clear and well-formatted beginner-level question to assess {current_skill}.

Rules:
- Only return the question
- No explanation
- No extra spaces or formatting issues
- Use proper grammar
"""

    question = ask_llm(prompt)

    history = [
        {"role": "ai", "content": question}
    ]

    return {
        "skills": skills,
        "current_skill": current_skill,
        "question": question,
        "history": history,
        "results": {}
    }


#  CONTINUE INTERVIEW
@router.post("/answer")
def answer_question(data: dict):
    current_skill = data["current_skill"]
    history = data["history"]
    answer = data["answer"]
    skills = data["skills"]
    results = data.get("results", {})

    # ➕ Add user answer
    history.append({
        "role": "user",
        "content": answer
    })

    #  Get next step
    response = next_step(current_skill, history, answer)

    #  If evaluation triggered
    if "EVALUATE" in response:
        eval_result = evaluate(current_skill, history)
        roadmap = generate_roadmap(current_skill, eval_result)

        # store result
        results[current_skill] = {
            "evaluation": eval_result,
            "roadmap": roadmap
        }

        #  move to next skill
        current_index = skills.index(current_skill)

        if current_index + 1 < len(skills):
            next_skill = skills[current_index + 1]

            prompt = f"""
You are a senior technical interviewer.

Ask ONE clear and well-formatted beginner-level question to assess {next_skill}.

Rules:
- Only return the question
- No explanation
- No extra spaces or formatting issues
- Use proper grammar
"""

            question = ask_llm(prompt)

            return {
                "done": False,
                "current_skill": next_skill,
                "skills": skills,
                "question": question,
                "history": [{"role": "ai", "content": question}],
                "results": results
            }

        #  ALL SKILLS DONE
        final_report = generate_final_report(results)

        return {
            "done": True,
            "results": results,
            "final_report": final_report
        }

    #  Continue same skill
    history.append({
        "role": "ai",
        "content": response
    })

    return {
        "done": False,
        "current_skill": current_skill,
        "skills": skills,
        "question": response,
        "history": history,
        "results": results
    }