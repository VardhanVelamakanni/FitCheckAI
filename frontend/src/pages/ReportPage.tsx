import { motion } from 'framer-motion';
import { ReportCard } from '@/components/ReportCard';
import type { InterviewState } from '@/types';

interface ReportPageProps {
  state: InterviewState;
  onRestart: () => void;
}

export const ReportPage = ({ state, onRestart }: ReportPageProps) => {
  if (!state.results) return null;

  return (
    <div className="noise bg-obsidian min-h-screen">
      {/* Ambient background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(232,255,71,0.04) 0%, transparent 60%)',
        }}
      />

      {/* Grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6">
            <div
              className="glass px-4 py-1.5 rounded-full flex items-center gap-2"
            >
              <motion.div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: '#4eff91' }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">
                Interview Complete
              </span>
            </div>
          </div>

          <h1 className="font-display font-extrabold text-4xl md:text-5xl gradient-text mb-3">
            Your Report
          </h1>
          <p className="text-white/35 text-sm font-mono">
            Based on {state.history.filter((m) => m.role === 'user').length} answers across{' '}
            {state.skills.length} skill areas
          </p>
        </motion.div>

        {/* Skill coverage */}
        <motion.div
          className="glass rounded-2xl px-6 py-4 mb-6 flex flex-wrap gap-2 items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-white/30 text-xs font-mono tracking-wider mr-1">Skills evaluated:</span>
          {state.skills.map((skill) => (
            <span
              key={skill}
              className="text-xs font-mono px-2.5 py-1 rounded-lg"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              {skill}
            </span>
          ))}
        </motion.div>

        {/* Main report */}
        <ReportCard results={state.results} />

        {/* Footer actions */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mt-10 pt-8"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <motion.button
            onClick={onRestart}
            className="flex-1 py-3.5 rounded-2xl font-display font-semibold text-sm"
            style={{
              background: 'var(--accent)',
              color: '#080808',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Start New Interview →
          </motion.button>
          <motion.button
            onClick={() => window.print()}
            className="flex-1 py-3.5 rounded-2xl font-display font-medium text-sm glass glass-hover"
            style={{ color: 'rgba(255,255,255,0.6)' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Export Report
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};
