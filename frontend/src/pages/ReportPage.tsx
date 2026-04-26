import { motion } from 'framer-motion';
import { ReportCard } from '@/components/ReportCard';
import type { InterviewState } from '@/types';

interface ReportPageProps {
  state: InterviewState;
  onRestart: () => void;
}

export const ReportPage = ({ state, onRestart }: ReportPageProps) => {
  const report = state.final_report;

  if (!report) return null;

  // 🔥 SAFE DATA NORMALIZATION
  const safeGaps =
    state.gaps && typeof state.gaps === 'object'
      ? state.gaps
      : null;

  const safeAdjacentSkills = Array.isArray(state.adjacent_skills)
    ? state.adjacent_skills
    : [];

  return (
    <div className="noise bg-obsidian min-h-screen">

      {/* Background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(232,255,71,0.04) 0%, transparent 60%)',
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
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Your Report
          </h1>

          <p className="text-white/40 text-sm">
            Based on {state.history.filter((m) => m.role === 'user').length} answers
          </p>
        </motion.div>

        {/* Skills */}
        <div className="mb-6 flex flex-wrap gap-2">
          {state.skills.map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 text-xs bg-white/10 rounded-md text-white/60"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* REPORT */}
        <ReportCard results={report} />

        {/* 🔥 GAPS + ADJACENT (SAFE) */}
        {(safeGaps || safeAdjacentSkills.length > 0) && (
          <div className="mt-8 p-5 rounded-xl bg-white/5 border border-white/10">

            {/* GAPS */}
            {safeGaps && (
              <>
                <h3 className="text-white font-semibold mb-2">
                  Skill Gaps
                </h3>
                <p className="text-white/60 text-sm mb-4">
                  {safeGaps.gap_summary || "No gap summary available"}
                </p>
              </>
            )}

            {/* ADJACENT SKILLS */}
            {safeAdjacentSkills.length > 0 && (
              <>
                <h3 className="text-white font-semibold mb-2">
                  Suggested Next Skills
                </h3>

                <ul className="text-white/60 text-sm space-y-1">
                  {safeAdjacentSkills.map((s: any, i: number) => (
                    <li key={i}>
                      • {s?.skill || "Unknown"} — {s?.reason || ""}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex gap-4 mt-10">
          <button
            onClick={onRestart}
            className="flex-1 py-3 rounded-xl bg-lime-400 text-black font-semibold"
          >
            Start New Interview
          </button>

          <button
            onClick={() => window.print()}
            className="flex-1 py-3 rounded-xl bg-white/10 text-white"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
};