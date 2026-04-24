from fastapi import APIRouter
from services.llm import ask_llm
from services.interviewer import next_step
from services.evaluator import evaluate

router = APIRouter()


#  START INTERVIEW
@router.post("/start")
def start_interview(data: dict):
    # For now, hardcode skill (we'll connect JD later)
    skill = "Python"

    prompt = f"""
You are a senior technical interviewer.

Ask ONE beginner-level question to assess {skill}.

Rules:
- Only return the question
- No explanation
- No formatting
"""

    question = ask_llm(prompt)

    # Initialize conversation history
    history = [
        {"role": "ai", "content": question}
    ]

    return {
        "skill": skill,
        "question": question,
        "history": history
    }


#  CONTINUE INTERVIEW
@router.post("/answer")
def answer_question(data: dict):
    skill = data["skill"]
    history = data["history"]
    answer = data["answer"]

    # Add user's answer to history
    history.append({
        "role": "user",
        "content": answer
    })

    # Ask next question OR decide to evaluate
    response = next_step(skill, history, answer)

    #  If model decides to evaluate
    from services.roadmap import generate_roadmap

    if "EVALUATE" in response:
        result = evaluate(skill, history)

        roadmap = generate_roadmap(skill, result)

        return {
            "done": True,
            "evaluation": result,
            "roadmap": roadmap,
            "history": history
        }
    #  Otherwise continue interview
    else:
        history.append({
            "role": "ai",
            "content": response
        })

        return {
            "done": False,
            "question": response,
            "history": history
        }