import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatUI } from '@/components/ChatUI';
import { sendAnswer } from '@/services/api';
import type { ChatMessage, InterviewState } from '@/types';

interface InterviewPageProps {
  state: InterviewState;
  onUpdate: (updates: Partial<InterviewState>) => void;
  onComplete: (state: InterviewState) => void;
}

export const InterviewPage = ({ state, onUpdate, onComplete }: InterviewPageProps) => {
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async (answer: string) => {
    if (!answer.trim()) return;

    console.log("🧠 STATE:", state);

    // 🔥 ALWAYS SAFE SKILL (NEVER BREAK)
    const safeSkill =
      state.currentSkill ||
      state.skills?.[0] ||
      "General";

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: answer,
      timestamp: new Date(),
    };

    const updatedHistory = [...(state.history || []), userMessage];

    onUpdate({ history: updatedHistory });

    setIsThinking(true);
    setError(null);

    try {
      const payload = {
        current_skill: safeSkill,
        history: updatedHistory.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        answer,
        skills: state.skills || [],
        candidate_skills: [],
        results: state.results || {},
      };

      console.log("📤 PAYLOAD:", payload);

      const res = await sendAnswer(payload);

      console.log("📥 RESPONSE:", res);

      if (!res) throw new Error("No backend response");

      // ✅ FINAL
      if (res.done) {
        onComplete({
          ...state,
          history: updatedHistory,
          results: res.results || {},
          isDone: true,
          final_report: res.final_report,
          gaps: res.gaps,
          adjacent_skills: res.adjacent_skills,
          currentSkill: safeSkill, // 🔥 preserve
        });
        return;
      }

      // 🔥 SAFE RESPONSE HANDLING
      const nextSkill =
        res.current_skill ||
        safeSkill;

      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'ai',
        content:
          res.question && res.question !== "EVALUATE"
            ? res.question
            : "Let's continue…",
        skill: nextSkill,
        timestamp: new Date(),
      };

      onUpdate({
        history: [...updatedHistory, aiMessage],
        currentSkill: nextSkill,
        results: res.results ?? state.results,
      });

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
          currentSkill={state.currentSkill || state.skills?.[0] || "General"}
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