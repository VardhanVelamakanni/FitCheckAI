# FitCheckAI

## Resume vs Job Description AI Interview System

FitCheckAI is an AI-powered interview platform that evaluates a candidate's resume against a target job description, conducts a personalized technical interview, and generates detailed feedback with a customized learning roadmap. The system leverages multiple large language models to assess candidate-job alignment, identify skill gaps, and simulate real interview experiences.

---

## Features

* Resume parsing and analysis
* Job Description (JD) analysis
* Semantic resume-to-JD matching
* AI-generated technical interviews
* Multi-LLM orchestration with fallback support
* Skill gap identification
* Interview performance evaluation
* Personalized learning roadmap
* Structured feedback and recommendations

---

## Tech Stack

### Frontend

* React
* TypeScript
* Tailwind CSS

### Backend

* FastAPI
* Python

### AI & Machine Learning

* LangChain
* GPT
* Qwen
* Gemma
* Embeddings
* Vector Search

---

## Workflow

1. Upload your resume.
2. Paste the target Job Description.
3. The system analyzes the resume against the job requirements.
4. An adaptive interview is generated based on the candidate's profile.
5. Complete the interview.
6. Receive:

   * Resume–JD match score
   * Interview evaluation
   * Skill gap analysis
   * Strengths and improvement areas
   * Personalized learning roadmap

---

## Screenshots

### Interview Interface

<img width="863" height="631" alt="Screenshot 2026-04-26 141442" src="https://github.com/user-attachments/assets/c3aa9665-3c64-4031-a257-66bbbea80495" />


---

### Feedback Dashboard

<img width="913" height="933" alt="Screenshot 2026-04-26 131457" src="https://github.com/user-attachments/assets/c05e5b18-0fdd-4c65-bfdf-8e54ed85f1b8" />


---

## Future Improvements

* Voice-based AI interviews
* Company-specific interview modes
* ATS score prediction
* Resume optimization suggestions
* Coding assessments
* Interview history and analytics

---

## Installation

```bash
git clone https://github.com/VardhanVelamakanni/FitCheckAI.git
cd FitCheckAI
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## Author

**Hemavardhan Velamakanni**

Computer Vision | Machine Learning | Generative AI
