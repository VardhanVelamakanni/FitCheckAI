from fastapi import FastAPI
from routes import interview

app = FastAPI()

app.include_router(interview.router)

@app.get("/")
def home():
    return {"message": "Backend running"}