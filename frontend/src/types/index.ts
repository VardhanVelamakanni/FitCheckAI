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

  final_report?: InterviewResults;
  gaps?: any;
  adjacent_skills?: (string | { skill: string; reason?: string })[];
}


// ─── Domain Types ───────────────────────────────────────────────────────────

export interface RoadmapItem {
  title: string;
  description: string;
  timeline?: string;
  priority: "high" | "medium" | "low";
}

export interface InterviewResults {
  fit_percentage: number;
  hiring_decision: "Strong Hire" | "Hire" | "Maybe" | "No Hire";
  summary?: string;

  strengths: string[];
  gaps: string[];

  // 🔥 important additions
  adjacent_skills?: (string | { skill: string; reason?: string })[];
  roadmap?: RoadmapItem[];
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
  sessionId: string; // (kept for structure, not used)
  history: ChatMessage[];
  currentSkill: string;
  skills: string[];

  results: Record<string, any>; // per-skill evaluations
  isDone: boolean;

  //  Final stage outputs
  final_report?: InterviewResults;
  gaps?: any;
  adjacent_skills?: (string | { skill: string; reason?: string })[];
}

export type AppPage = "landing" | "interview" | "report";