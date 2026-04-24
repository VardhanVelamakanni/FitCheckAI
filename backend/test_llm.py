from services.llm import ask_llm

response = ask_llm("""
You are a senior technical interviewer.

Ask ONE beginner-level question on Python.

Rules:
- Only return the question
- No explanation
- No formatting
""")

print(response)