import { motion } from 'framer-motion';

interface HeroSectionProps {
  onCTAClick?: () => void; //  optional safe
}

export const HeroSection = ({ onCTAClick }: HeroSectionProps) => {
  const handleClick = () => {
    if (typeof onCTAClick === 'function') {
      onCTAClick();
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">

      {/* BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">

        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(232,255,71,0.04) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            x: '-50%',
            y: '-50%',
          }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(232,255,71,0.06) 0%, transparent 70%)',
            top: '20%',
            right: '15%',
          }}
          animate={{ y: [0, -30, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <motion.div
          className="absolute w-[300px] h-[300px] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(100,200,255,0.03) 0%, transparent 70%)',
            bottom: '20%',
            left: '10%',
          }}
          animate={{ y: [0, 20, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 12, repeat: Infinity, delay: 2 }}
        />
      </div>

      {/* GRID */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* CONTENT */}
      <div className="relative z-10 text-center max-w-5xl mx-auto">

        {/* BADGE */}
        <motion.div
          className="inline-flex items-center gap-2 mb-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="glass px-4 py-2 rounded-full flex items-center gap-2">
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: 'var(--accent)' }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs font-mono tracking-widest text-white/50 uppercase">
              AI-Powered Interview System
            </span>
          </div>
        </motion.div>

        {/* TITLE */}
        <motion.h1
          className="font-display font-extrabold leading-[0.95] tracking-tight mb-8"
          style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="gradient-text block">Don't just</span>
          <span className="gradient-text block">bridge the gap —</span>
          <span className="gradient-text-accent block">
            build the ladder.
          </span>
        </motion.h1>

        {/* SUBTEXT */}
        <motion.p
          className="text-white/45 text-lg md:text-xl max-w-2xl mx-auto mb-14 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Paste your resume and job description. Our AI conducts a real, skill-mapped
          interview — then delivers a detailed fit report and growth roadmap.
        </motion.p>

        {/* CTA */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.button
            onClick={handleClick}
            disabled={!onCTAClick}
            className="font-semibold px-8 py-4 rounded-2xl"
            style={{
              background: 'var(--accent)',
              color: '#080808',
              opacity: onCTAClick ? 1 : 0.5,
            }}
          >
            Start Interview →
          </motion.button>

          <span className="text-white/25 text-xs">
            No sign-up required
          </span>
        </motion.div>

        {/* STATS */}
        <motion.div
          className="flex items-center justify-center gap-10 mt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[
            { value: 'Skill-mapped', label: 'Interview format' },
            { value: 'Instant', label: 'Fit analysis' },
            { value: 'Actionable', label: 'Growth roadmap' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-bold text-white/80 text-base">
                {stat.value}
              </p>
              <p className="text-white/30 text-xs mt-0.5">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* SCROLL */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <span className="text-white/25 text-[10px] uppercase">
          Scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
      </motion.div>
    </section>
  );
};