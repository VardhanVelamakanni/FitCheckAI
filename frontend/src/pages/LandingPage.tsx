import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroSection } from '@/components/HeroSection';
import { InputSection } from '@/components/InputSection';
import { Loader } from '@/components/Loader';
import { startInterview } from '@/services/api';
import type { StartRequest, InterviewState } from '@/types';

interface LandingPageProps {
  onInterviewStart: (state: InterviewState) => void;
}

export const LandingPage = ({ onInterviewStart }: LandingPageProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLElement>(null);

  const scrollToInput = () => {
    document.getElementById('input-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (data: StartRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await startInterview(data);

      console.log("🚀 START RESPONSE:", res);

      // 🔥 VALIDATION
      if (!res || !res.question || !res.session_id) {
        throw new Error("Invalid response from server");
      }

      const safeSkill =
        res.current_skill ||
        res.skills?.[0] ||
        "General";

      console.log("✅ SESSION STORED:", res.session_id);

      // 🔥 FIXED STATE (THIS WAS YOUR BUG)
      onInterviewStart({
        sessionId: res.session_id,   // ✅ CRITICAL FIX
        history: [
          {
            id: crypto.randomUUID(),
            role: 'ai',
            content: res.question,
            skill: safeSkill,
            timestamp: new Date(),
          },
        ],
        currentSkill: safeSkill,
        skills: res.skills || [],
        candidate_skills: res.candidate_skills || [],
        results: res.results || {},
        isDone: false,
      });

    } catch (err) {
      console.error("❌ START ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to start interview. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="noise bg-obsidian min-h-screen">
      <HeroSection onCTAClick={scrollToInput} />

      <div
        id="input-section"
        ref={inputRef as React.RefObject<HTMLDivElement>}
      >
        <InputSection onSubmit={handleSubmit} isLoading={isLoading} />
      </div>

      {/* ERROR TOAST */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
          >
            <div
              className="px-5 py-3 rounded-xl text-sm flex items-center gap-3"
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

      {/* LOADING */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
              background: 'rgba(8,8,8,0.92)',
              backdropFilter: 'blur(12px)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loader text="Building your interview…" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};