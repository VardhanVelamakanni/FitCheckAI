import { motion } from 'framer-motion';
import type { InterviewResults } from '@/types';

interface ReportCardProps {
  results: InterviewResults;
}

const decisionConfig = {
  'Strong Hire': { color: '#4eff91', bg: 'rgba(78,255,145,0.1)', border: 'rgba(78,255,145,0.25)' },
  Hire: { color: '#e8ff47', bg: 'rgba(232,255,71,0.1)', border: 'rgba(232,255,71,0.25)' },
  Maybe: { color: '#ffb347', bg: 'rgba(255,179,71,0.1)', border: 'rgba(255,179,71,0.25)' },
  'No Hire': { color: '#ff6b6b', bg: 'rgba(255,107,107,0.1)', border: 'rgba(255,107,107,0.25)' },
};

const priorityColor = {
  high: '#ff6b6b',
  medium: '#ffb347',
  low: '#e8ff47',
};

export const ReportCard = ({ results }: ReportCardProps) => {
  const decision = decisionConfig[results.hiring_decision] ?? decisionConfig['Maybe'];
  const fitPct = Math.min(100, Math.max(0, results.fit_percentage));

  return (
    <div className="space-y-5">
      {/* ── Top row: Fit % + Decision ─────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Fit Score */}
        <motion.div
          className="glass rounded-2xl p-6 flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="text-white/35 text-xs font-mono tracking-widest uppercase mb-6">Fit Score</p>
          <div className="relative w-32 h-32">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
              <motion.circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 52}`}
                strokeDashoffset={`${2 * Math.PI * 52 * (1 - fitPct / 100)}`}
                initial={{ strokeDashoffset: `${2 * Math.PI * 52}` }}
                animate={{ strokeDashoffset: `${2 * Math.PI * 52 * (1 - fitPct / 100)}` }}
                transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                className="font-display font-extrabold text-3xl text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {fitPct}%
              </motion.span>
              <span className="text-white/30 text-[10px] font-mono">match</span>
            </div>
          </div>
        </motion.div>

        {/* Hiring Decision */}
        <motion.div
          className="glass rounded-2xl p-6 flex flex-col items-center justify-center gap-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-white/35 text-xs font-mono tracking-widest uppercase">Decision</p>
          <motion.div
            className="px-6 py-3 rounded-xl font-display font-bold text-xl"
            style={{
              background: decision.bg,
              border: `1px solid ${decision.border}`,
              color: decision.color,
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
          >
            {results.hiring_decision}
          </motion.div>
          {results.summary && (
            <p className="text-white/40 text-sm text-center leading-relaxed">{results.summary}</p>
          )}
        </motion.div>
      </div>

      {/* ── Strengths & Gaps ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Strengths */}
        <motion.div
          className="glass rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1.5 h-4 rounded-full" style={{ background: '#4eff91' }} />
            <p className="font-display font-semibold text-white text-sm">Strengths</p>
          </div>
          <ul className="space-y-2.5">
            {results.strengths.map((s, i) => (
              <motion.li
                key={i}
                className="flex items-start gap-3 text-sm text-white/65"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.06 }}
              >
                <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#4eff91' }} />
                {s}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Gaps */}
        <motion.div
          className="glass rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1.5 h-4 rounded-full" style={{ background: '#ff6b6b' }} />
            <p className="font-display font-semibold text-white text-sm">Gaps</p>
          </div>
          <ul className="space-y-2.5">
            {results.gaps.map((g, i) => (
              <motion.li
                key={i}
                className="flex items-start gap-3 text-sm text-white/65"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + i * 0.06 }}
              >
                <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#ff6b6b' }} />
                {g}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* ── Adjacent Skills ───────────────────────────────────────────── */}
      {results.adjacent_skills.length > 0 && (
        <motion.div
          className="glass rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1.5 h-4 rounded-full" style={{ background: 'var(--accent)' }} />
            <p className="font-display font-semibold text-white text-sm">Adjacent Skills to Explore</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {results.adjacent_skills.map((skill, i) => (
              <motion.span
                key={i}
                className="text-xs font-mono px-3 py-1.5 rounded-lg"
                style={{
                  background: 'rgba(232,255,71,0.07)',
                  border: '1px solid rgba(232,255,71,0.15)',
                  color: 'rgba(232,255,71,0.75)',
                }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.05 }}
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Growth Roadmap ────────────────────────────────────────────── */}
      {results.roadmap.length > 0 && (
        <motion.div
          className="glass rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1.5 h-4 rounded-full" style={{ background: '#a78bff' }} />
            <p className="font-display font-semibold text-white text-sm">Growth Roadmap</p>
          </div>
          <div className="relative">
            {/* Timeline line */}
            <div
              className="absolute left-[11px] top-0 bottom-0 w-px"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            />
            <div className="space-y-6">
              {results.roadmap.map((item, i) => (
                <motion.div
                  key={i}
                  className="flex gap-5"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 + i * 0.08 }}
                >
                  {/* Node */}
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div
                      className="w-5 h-5 rounded-full border-2 mt-0.5"
                      style={{
                        borderColor: priorityColor[item.priority],
                        background: `${priorityColor[item.priority]}20`,
                      }}
                    />
                  </div>
                  {/* Content */}
                  <div className="pb-2">
                    <div className="flex items-center gap-2 mb-1.5">
                      <p className="font-display font-semibold text-white text-sm">{item.title}</p>
                      <span
                        className="text-[9px] font-mono px-1.5 py-0.5 rounded uppercase tracking-wider"
                        style={{
                          color: priorityColor[item.priority],
                          background: `${priorityColor[item.priority]}15`,
                          border: `1px solid ${priorityColor[item.priority]}30`,
                        }}
                      >
                        {item.priority}
                      </span>
                      {item.timeline && (
                        <span className="text-white/25 text-[10px] font-mono">{item.timeline}</span>
                      )}
                    </div>
                    <p className="text-white/50 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
