# InterviewAI — Frontend

> "Don't just bridge the gap — build the ladder."

A modern, production-quality AI-powered interview frontend built with React + TypeScript + Tailwind + Framer Motion.

---

## Stack

| Tool | Purpose |
|---|---|
| React 18 + TypeScript | UI framework + typing |
| Vite | Build tool |
| Tailwind CSS | Utility-first styling |
| Framer Motion | Animations & transitions |
| Axios | HTTP client |

---

## Folder Structure

```
src/
├── pages/
│   ├── LandingPage.tsx      # Hero + Input flow
│   ├── InterviewPage.tsx    # Chat interface
│   └── ReportPage.tsx       # Results display
├── components/
│   ├── HeroSection.tsx      # Full-screen animated hero
│   ├── InputSection.tsx     # JD + Resume textareas
│   ├── ChatUI.tsx           # Chat container + input bar
│   ├── MessageBubble.tsx    # Individual message
│   ├── Loader.tsx           # Animated loading indicator
│   └── ReportCard.tsx       # Results cards (fit%, decision, roadmap)
├── services/
│   └── api.ts               # Axios instance + typed endpoints
├── types/
│   └── index.ts             # All TypeScript types
├── App.tsx                  # Root + page state machine
├── main.tsx                 # Entry point
└── index.css                # Global styles + CSS variables
```

---

## Getting Started

```bash
# Install dependencies
cd frontend
npm install

# Start dev server (ensure backend runs on http://localhost:8000)
npm run dev

# Build for production
npm run build
```

---

## API Integration

The frontend connects to `http://localhost:8000` with two endpoints:

### `POST /start`
```json
// Request
{ "job_description": "...", "resume": "..." }

// Response
{
  "session_id": "abc123",
  "question": "Tell me about your React experience...",
  "current_skill": "React",
  "skills": ["React", "TypeScript", "System Design"]
}
```

### `POST /answer`
```json
// Request
{ "session_id": "abc123", "answer": "I've worked with React for 4 years..." }

// Response — mid-interview
{ "question": "Next question...", "current_skill": "TypeScript", "done": false }

// Response — final
{
  "question": "",
  "current_skill": "",
  "done": true,
  "results": {
    "fit_percentage": 82,
    "hiring_decision": "Strong Hire",
    "strengths": ["Strong React fundamentals", ...],
    "gaps": ["Limited system design exposure", ...],
    "adjacent_skills": ["Next.js", "GraphQL", ...],
    "roadmap": [
      {
        "title": "Learn system design fundamentals",
        "description": "...",
        "timeline": "3 months",
        "priority": "high"
      }
    ],
    "summary": "Strong frontend candidate with clear growth trajectory."
  }
}
```

---

## Design System

- **Background**: `#080808` (obsidian)
- **Accent**: `#e8ff47` (electric yellow-green)
- **Glass**: `rgba(255,255,255,0.04)` with `backdrop-blur`
- **Font Display**: Syne (headings)
- **Font Body**: DM Sans (body copy)
- **Font Mono**: JetBrains Mono (labels, codes)

---

## App Flow

```
LandingPage (Hero + Input)
    ↓ POST /start
InterviewPage (Chat loop)
    ↓ POST /answer × N  (until done: true)
ReportPage (Results)
    ↓ Restart → LandingPage
```
