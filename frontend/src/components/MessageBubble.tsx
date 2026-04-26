import { motion } from 'framer-motion';
import type { ChatMessage } from '@/types';

interface MessageBubbleProps {
  message: ChatMessage;
  index: number;
}

export const MessageBubble = ({ message, index }: MessageBubbleProps) => {
  const isAI = message?.role === 'ai';

  // ✅ SAFE FALLBACKS
  const safeContent =
    typeof message?.content === 'string' && message.content.trim()
      ? message.content
      : '...';

  const safeSkill =
    typeof message?.skill === 'string' ? message.skill : null;

  // ✅ SAFE TIMESTAMP
  let safeTime = '';
  try {
    const date =
      message?.timestamp instanceof Date
        ? message.timestamp
        : new Date(message?.timestamp || Date.now());

    safeTime = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    safeTime = '';
  }

  return (
    <motion.div
      className={`flex gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.35,
        delay: index === 0 ? 0.1 : 0,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {isAI && (
        <div className="flex-shrink-0 mt-1">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-display font-bold"
            style={{
              background:
                'linear-gradient(135deg, rgba(232,255,71,0.2), rgba(232,255,71,0.05))',
              border: '1px solid rgba(232,255,71,0.3)',
              color: 'var(--accent)',
            }}
          >
            AI
          </div>
        </div>
      )}

      <div
        className={`max-w-[75%] flex flex-col gap-1.5 ${
          isAI ? 'items-start' : 'items-end'
        }`}
      >
        {/* Skill tag */}
        {isAI && safeSkill && (
          <span
            className="text-[10px] font-mono px-2 py-0.5 rounded-full tracking-wider uppercase"
            style={{
              background: 'rgba(232,255,71,0.08)',
              border: '1px solid rgba(232,255,71,0.2)',
              color: 'rgba(232,255,71,0.7)',
            }}
          >
            {safeSkill}
          </span>
        )}

        {/* Message */}
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isAI ? 'rounded-tl-sm' : 'rounded-tr-sm'
          }`}
          style={
            isAI
              ? {
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.88)',
                }
              : {
                  background: 'rgba(232,255,71,0.1)',
                  border: '1px solid rgba(232,255,71,0.2)',
                  color: 'rgba(255,255,255,0.9)',
                }
          }
        >
          {safeContent}
        </div>

        {/* Timestamp */}
        {safeTime && (
          <span className="text-[10px] text-white/25 font-mono">
            {safeTime}
          </span>
        )}
      </div>

      {!isAI && (
        <div className="flex-shrink-0 mt-1">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-display font-bold"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.6)',
            }}
          >
            U
          </div>
        </div>
      )}
    </motion.div>
  );
};