import { motion } from 'framer-motion';

interface ReportCardProps {
  results: any;
}

/* ✅ TYPES */
type AdjacentSkill = {
  skill: string;
  reason?: string;
};

type RoadmapItem = {
  topic: string;
  why?: string;
  resources?: string[];
  practice?: string;
  time_estimate?: string;
};

const decisionConfig: Record<string, any> = {
  'Strong Hire': { color: '#4eff91', bg: 'rgba(78,255,145,0.1)', border: 'rgba(78,255,145,0.25)' },
  Hire: { color: '#e8ff47', bg: 'rgba(232,255,71,0.1)', border: 'rgba(232,255,71,0.25)' },
  Maybe: { color: '#ffb347', bg: 'rgba(255,179,71,0.1)', border: 'rgba(255,179,71,0.25)' },
  'No Hire': { color: '#ff6b6b', bg: 'rgba(255,107,107,0.1)', border: 'rgba(255,107,107,0.25)' },
};

export const ReportCard = ({ results }: ReportCardProps) => {
  const safeResults = results || {};

  const strengths: string[] = Array.isArray(safeResults.strengths) ? safeResults.strengths : [];
  const gaps: string[] = Array.isArray(safeResults.gaps) ? safeResults.gaps : [];

  const adjacentSkills: (AdjacentSkill | string)[] = Array.isArray(safeResults.adjacent_skills)
    ? safeResults.adjacent_skills
    : [];

  const roadmap: RoadmapItem[] = Array.isArray(safeResults?.roadmap?.plan)
    ? safeResults.roadmap.plan
    : [];

  const fitPct = Math.min(100, Math.max(0, safeResults.fit_percentage || 0));

  const decision =
    decisionConfig[safeResults.hiring_decision] ??
    decisionConfig['Maybe'];

  return (
    <div className="space-y-6">

      {/* TOP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* FIT */}
        <motion.div className="glass rounded-2xl p-6 flex flex-col items-center justify-center">
          <p className="text-white/35 text-xs font-mono mb-6">Fit Score</p>

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
                animate={{ strokeDashoffset: `${2 * Math.PI * 52 * (1 - fitPct / 100)}` }}
                transition={{ duration: 1.2 }}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white">{fitPct}%</span>
              <span className="text-white/30 text-xs">match</span>
            </div>
          </div>
        </motion.div>

        {/* DECISION */}
        <motion.div className="glass rounded-2xl p-6 flex flex-col items-center justify-center gap-4">
          <p className="text-white/35 text-xs">Decision</p>

          <div
            className="px-6 py-3 rounded-xl font-bold text-xl"
            style={{
              background: decision.bg,
              border: `1px solid ${decision.border}`,
              color: decision.color,
            }}
          >
            {safeResults.hiring_decision || 'Maybe'}
          </div>

          {safeResults.summary && (
            <p className="text-white/40 text-sm text-center">
              {safeResults.summary}
            </p>
          )}
        </motion.div>
      </div>

      {/* STRENGTHS + GAPS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <div className="glass rounded-2xl p-6">
          <p className="text-white font-semibold mb-4">Strengths</p>
          {strengths.length > 0
            ? strengths.map((s, i) => (
                <p key={i} className="text-white/60 text-sm">• {s}</p>
              ))
            : <p className="text-white/30 text-sm">No strengths detected</p>}
        </div>

        <div className="glass rounded-2xl p-6">
          <p className="text-white font-semibold mb-4">Gaps</p>
          {gaps.length > 0
            ? gaps.map((g, i) => (
                <p key={i} className="text-white/60 text-sm">• {g}</p>
              ))
            : <p className="text-white/30 text-sm">No major gaps</p>}
        </div>
      </div>

      {/* ADJACENT SKILLS */}
      {adjacentSkills.length > 0 && (
        <div className="glass rounded-2xl p-6">
          <p className="text-white font-semibold mb-4">Suggested Next Skills</p>
          <div className="flex flex-wrap gap-2">
            {adjacentSkills.map((s, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1 rounded bg-white/10 text-white/70"
              >
                {typeof s === 'string' ? s : s.skill || 'Unknown'}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 🚀 POWERFUL LEARNING PLAN */}
      {roadmap.length > 0 && (
        <div className="glass rounded-2xl p-6 border border-lime-400/20">

          <h3 className="text-white font-semibold text-lg mb-2">
            🚀 Personalized Learning Plan
          </h3>

          {/* META */}
          {safeResults.roadmap?.total_time && (
            <p className="text-white/50 text-sm mb-1">
              Total Time: {safeResults.roadmap.total_time}
            </p>
          )}

          {safeResults.roadmap?.difficulty && (
            <p className="text-white/50 text-sm mb-4">
              Difficulty: {safeResults.roadmap.difficulty}
            </p>
          )}

          {roadmap.map((item, i) => (
            <div
              key={i}
              className="mb-5 p-4 rounded-xl bg-white/5 border border-white/10"
            >

              {/* TOPIC */}
              <div className="text-white font-medium text-base">
                {item.topic}
              </div>

              {/* WHY */}
              {item.why && (
                <div className="text-white/40 text-xs mt-1">
                  {item.why}
                </div>
              )}

              {/* TIME */}
              <div className="text-lime-400 text-xs mt-2">
                ⏱ {item.time_estimate || 'Few days'}
              </div>

              {/* PRACTICE */}
              {item.practice && (
                <div className="text-white/50 text-xs mt-2">
                  🧠 Practice: {item.practice}
                </div>
              )}

              {/* RESOURCES */}
              {Array.isArray(item.resources) && item.resources.length > 0 && (
                <div className="mt-3 space-y-1">
                  {item.resources.map((r, idx) => (
                    <a
                      key={idx}
                      href={r}
                      target="_blank"
                      className="block text-lime-400 text-xs underline hover:text-lime-300"
                    >
                      📘 {r}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};