from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.interview import router as interview_router

app = FastAPI(
    title="AI Interview Backend",
    description="API for AI-powered skill assessment and roadmap generation",
    version="1.0.0"
)

# 🌐 CORS (allow frontend to connect)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for hackathon/demo; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔗 Routes
app.include_router(interview_router)


# 🧪 Health check (VERY useful for deployment)
@app.get("/")
def root():
    return {"message": "AI Interview API is running 🚀"}


@app.get("/health")
def health():
    return {"status": "ok"}