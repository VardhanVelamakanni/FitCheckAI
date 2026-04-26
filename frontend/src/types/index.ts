// ─── API Request / Response Types ───────────────────────────────────────────

export interface StartRequest {
  jd: string;
  resume: string;
}

export interface StartResponse {
  session_id: string; // 🔥 REQUIRED

  skills: string[];
  candidate_skills: string[];

  current_skill: string;
  question: string;

  results: Record<string, any>;
}


// 🔥 SESSION-BASED REQUEST
export interface AnswerRequest {
  session_id: string;
  answer: string;
}


// 🔥 RESPONSE FROM BACKEND
export interface AnswerResponse {
  done: boolean;

  session_id?: string;

  current_skill?: string;
  question?: string;

  skills?: string[];
  results?: Record<string, any>;

  final_report?: InterviewResults;
}


// ─── Domain Types ───────────────────────────────────────────────────────────

export interface RoadmapStep {
  topic: string;
  why?: string;
  resources?: string[];
  practice?: string;
  time_estimate?: string;
}

export interface Roadmap {
  focus_areas?: string[];
  plan: RoadmapStep[];
  total_time?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
}


// 🔥 FINAL REPORT STRUCTURE
export interface InterviewResults {
  fit_percentage: number;
  hiring_decision: "Hire" | "Maybe" | "No";

  summary?: string;

  strengths: string[];
  gaps: string[];

  adjacent_skills?: (string | { skill: string; reason?: string })[];

  learning_plan?: {
    skill: string;
    topics: string[];
    resources: string[];
    time_estimate: string;
  }[];

  roadmap?: Roadmap;
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
  sessionId?: string;

  history: ChatMessage[];

  currentSkill?: string;   // 🔥 FIX: was strict → now safe
  skills: string[];

  candidate_skills?: string[];

  results: Record<string, any>;

  isDone: boolean;

  final_report?: InterviewResults;
}


// ─── 🔥 FIXED UPDATE TYPE (CRITICAL) ─────────────────────────────────────────

// THIS fixes your "no properties in common" error
export type UpdateInterviewState =
  | Partial<InterviewState>
  | ((prev: InterviewState) => InterviewState);


// ─── App Routing ────────────────────────────────────────────────────────────

export type AppPage = "landing" | "interview" | "report";