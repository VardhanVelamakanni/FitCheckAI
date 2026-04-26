import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageBubble } from './MessageBubble';
import type { ChatMessage } from '@/types';

interface ChatUIProps {
  messages: ChatMessage[];
  currentSkill: string;
  skills: string[];
  isLoading: boolean;
  onSend: (answer: string) => void;
}

export const ChatUI = ({
  messages = [],
  currentSkill = '',
  skills = [],
  isLoading,
  onSend,
}: ChatUIProps) => {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ✅ ensure safe defaults
  const safeMessages = Array.isArray(messages) ? messages : [];
  const safeSkills = Array.isArray(skills) ? skills : [];
  const safeCurrentSkill = currentSkill || '';

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [safeMessages, isLoading]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
  }, [input]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ✅ SAFE indexOf
  const completedSkills = safeSkills.indexOf(safeCurrentSkill);

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">

      {/* HEADER */}
      <div
        className="flex-shrink-0 glass border-b px-6 py-4"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-3xl mx-auto flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center font-display font-bold text-xs"
              style={{
                background: 'var(--accent)',
                color: '#080808',
              }}
            >
              AI
            </div>

            <div>
              <p className="font-display font-semibold text-white text-sm">
                Interview Session
              </p>
              <p className="text-white/30 text-xs font-mono">
                {safeCurrentSkill
                  ? `Evaluating: ${safeCurrentSkill}`
                  : 'Preparing…'}
              </p>
            </div>
          </div>

          {/* Progress */}
          {safeSkills.length > 0 && (
            <div className="hidden sm:flex items-center gap-1.5">
              {safeSkills.map((skill, i) => (
                <motion.div
                  key={skill}
                  className="h-1.5 rounded-full"
                  style={{
                    width: skill === safeCurrentSkill ? '32px' : '12px',
                    background:
                      i < completedSkills
                        ? 'var(--accent)'
                        : skill === safeCurrentSkill
                        ? 'rgba(232,255,71,0.6)'
                        : 'rgba(255,255,255,0.1)',
                  }}
                  animate={{ width: skill === safeCurrentSkill ? '32px' : '12px' }}
                  transition={{ duration: 0.4 }}
                />
              ))}
              <span className="text-white/25 text-[10px] font-mono ml-1">
                {Math.max(completedSkills, 0)}/{safeSkills.length}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <AnimatePresence initial={false}>
            {safeMessages.map((msg, i) => (
              <MessageBubble key={msg.id} message={msg} index={i} />
            ))}
          </AnimatePresence>

          {/* Loader */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div
                  className="flex items-center gap-3 px-5 py-4 rounded-2xl rounded-tl-sm"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: 'rgba(232,255,71,0.6)' }}
                        animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                  <span className="text-white/30 text-xs font-mono">
                    Thinking…
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>
      </div>

      {/* INPUT */}
      <div
        className="flex-shrink-0 glass border-t px-4 py-4"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-3xl mx-auto">
          <div
            className="flex items-end gap-3 rounded-2xl px-4 py-3"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: input
                ? '1px solid rgba(232,255,71,0.2)'
                : '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your answer…"
              rows={1}
              disabled={isLoading}
              className="flex-1 bg-transparent text-white/85 text-sm placeholder-white/20"
            />

            <motion.button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background:
                  input.trim() && !isLoading
                    ? 'var(--accent)'
                    : 'rgba(255,255,255,0.06)',
                color:
                  input.trim() && !isLoading
                    ? '#080808'
                    : 'rgba(255,255,255,0.4)',
              }}
            >
              →
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};