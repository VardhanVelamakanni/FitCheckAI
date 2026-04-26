import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatUI } from '@/components/ChatUI';
import { sendAnswer } from '@/services/api';
import type { ChatMessage, InterviewState, UpdateInterviewState } from '@/types';

interface InterviewPageProps {
  state: InterviewState;
  onUpdate: (updates: UpdateInterviewState) => void;  
  onComplete: (state: InterviewState) => void;
}

export const InterviewPage = ({ state, onUpdate, onComplete }: InterviewPageProps) => {
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async (answer: string) => {
    if (!answer.trim()) return;

    // 🚨 CRITICAL: ensure session exists
    if (!state.sessionId) {
      console.error("❌ No sessionId found");
      setError("Session not initialized. Please restart interview.");
      return;
    }

    console.log("🧠 USING SESSION:", state.sessionId);

    const currentSkill = state.currentSkill || state.skills?.[0];

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: answer,
      timestamp: new Date(),
      skill: currentSkill,
    };

    const updatedHistory = [...(state.history || []), userMessage];

    // 🔥 Use functional update to avoid stale state
    onUpdate((prev: InterviewState) => ({
      ...prev,
      history: updatedHistory,
    }));

    setIsThinking(true);
    setError(null);

    try {
      const payload = {
        session_id: state.sessionId,  // 🔥 REQUIRED
        answer,
      };

      console.log("📤 SEND:", payload);

      const res = await sendAnswer(payload);

      console.log("📥 RECV:", res);

      if (!res) {
        throw new Error("No backend response");
      }

      // 🚨 If backend ends early → debug
      if (res.done) {
        console.warn("⚠️ Backend ended early → likely session issue");

        onComplete({
          ...state,
          history: updatedHistory,
          results: res.results || {},
          isDone: true,
          final_report: res.final_report,
        });

        return;
      }

      if (!res.current_skill) {
        throw new Error("Backend missing current_skill");
      }

      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'ai',
        content: res.question || "Let's continue…",
        skill: res.current_skill,
        timestamp: new Date(),
      };

      console.log("📊 NEXT SKILL:", res.current_skill);

      // 🔥 SAFE STATE UPDATE
      onUpdate((prev: InterviewState) => ({
        ...prev,
        history: [...updatedHistory, aiMessage],
        currentSkill: res.current_skill,
        results: res.results ?? prev.results,
        skills: res.skills ?? prev.skills,
      }));

    } catch (err) {
      console.error("❌ ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="bg-obsidian h-screen overflow-hidden relative">

      {/* Background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(232,255,71,0.02) 0%, transparent 70%)',
        }}
      />

      <motion.div
        className="h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <ChatUI
          messages={state.history || []}
          currentSkill={state.currentSkill || state.skills?.[0]}
          skills={state.skills || []}
          isLoading={isThinking}
          onSend={handleSend}
        />
      </motion.div>

      {/* ERROR */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="px-5 py-3 rounded-xl text-sm flex gap-3 bg-red-500/10 border border-red-400/30 text-red-300">
              ⚠ {error}
              <button onClick={() => setError(null)}>✕</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};