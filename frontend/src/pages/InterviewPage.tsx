import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatUI } from '@/components/ChatUI';
import { Loader } from '@/components/Loader';
import { sendAnswer } from '@/services/api'; // ✅ fixed import
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
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: answer,
      timestamp: new Date(),
    };

    const updatedHistory = [...state.history, userMessage];

    // update UI immediately
    onUpdate({ history: updatedHistory });

    setIsThinking(true);
    setError(null);

    try {
      // 🔥 SEND CORRECT DATA TO BACKEND
      const res = await sendAnswer({
        current_skill: state.currentSkill,
        history: updatedHistory.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        answer,
        skills: state.skills,
        candidate_skills: [],
        results: state.results || {},
      });

      // 🧠 IF INTERVIEW COMPLETED
      if (res.done) {
        const finalState: InterviewState = {
          ...state,
          history: updatedHistory,
          results: res.results || {},
          isDone: true,
          final_report: res.final_report,
          gaps: res.gaps,
          adjacent_skills: res.adjacent_skills,
        };

        onComplete(finalState);
      } else {
        // 🧠 CONTINUE INTERVIEW
        const aiMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'ai',
          content: res.question || '',
          skill: res.current_skill,
          timestamp: new Date(),
        };

        onUpdate({
          history: [...updatedHistory, aiMessage],
          currentSkill: res.current_skill || state.currentSkill,
          results: res.results || state.results,
        });
      }

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please retry.'
      );
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="bg-obsidian h-screen overflow-hidden relative">
      
      {/* Background ambient */}
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
          messages={state.history}
          currentSkill={state.currentSkill}
          skills={state.skills}
          isLoading={isThinking}
          onSend={handleSend}
        />
      </motion.div>

      {/* Error toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="px-5 py-3 rounded-xl text-sm font-body flex items-center gap-3"
              style={{
                background: 'rgba(255,80,80,0.12)',
                border: '1px solid rgba(255,80,80,0.3)',
                color: '#ff8080',
              }}
            >
              <span>⚠</span>
              {error}
              <button
                onClick={() => setError(null)}
                className="ml-2 opacity-60 hover:opacity-100 text-xs"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};