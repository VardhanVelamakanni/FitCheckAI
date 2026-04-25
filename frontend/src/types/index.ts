// ─── API Request / Response Types ───────────────────────────────────────────

export interface StartRequest {
  jd: string;          
  resume: string;
}

export interface StartResponse {
  skills: string[];
  candidate_skills: string[];
  current_skill: string;
  question: string;
  history: {
    role: "ai" | "user";
    content: string;
  }[];
  results: Record<string, any>;
}

export interface AnswerRequest {
  current_skill: string;
  history: {
    role: "ai" | "user";
    content: string;
  }[];
  answer: string;
  skills: string[];
  candidate_skills: string[];
  results: Record<string, any>;
}

export interface AnswerResponse {
  done: boolean;
  current_skill?: string;
  question?: string;
  history?: {
    role: "ai" | "user";
    content: string;
  }[];
  skills?: string[];
  candidate_skills?: string[];
  results?: Record<string, any>;

  // 🔥 Final output fields
  final_report?: InterviewResults;
  gaps?: {
    missing_skills: string[];
    weak_skills: string[];
    gap_summary: string;
  };
  adjacent_skills?: {
    skill: string;
    reason: string;
  }[];
}

// ─── Domain Types ───────────────────────────────────────────────────────────

export interface InterviewResults {
  fit_percentage: number;
  hiring_decision: "Hire" | "Maybe" | "No";
  summary: string;
  strengths: string[];
  gaps: string[];
  next_steps: string[];
}

// ─── Chat Types ─────────────────────────────────────────────────────────────

export type MessageRole = "ai" | "user";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  skill?: string;
  timestamp: Date;
}

// ─── App State ──────────────────────────────────────────────────────────────

export interface InterviewState {
  sessionId: string; // optional (not used but kept for structure)
  history: ChatMessage[];
  currentSkill: string;
  skills: string[];
  results: any; // 🔥 flexible because backend evolves
  isDone: boolean;

  // 🔥 Final stage data
  final_report?: InterviewResults;
  gaps?: any;
  adjacent_skills?: any;
}

export type AppPage = "landing" | "interview" | "report";