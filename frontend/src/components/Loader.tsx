import { motion } from 'framer-motion';

interface LoaderProps {
  text?: string;
}

export const Loader = ({ text = 'AI is evaluating…' }: LoaderProps) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center gap-8"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Orbital rings */}
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: '1px solid rgba(232,255,71,0.2)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        />
        {/* Middle ring */}
        <motion.div
          className="absolute inset-3 rounded-full"
          style={{
            border: '1px solid rgba(232,255,71,0.35)',
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
        {/* Inner dot */}
        <motion.div
          className="w-2.5 h-2.5 rounded-full"
          style={{ background: 'var(--accent)' }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Orbiting dot */}
        <motion.div
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            background: 'var(--accent)',
            top: '6px',
            left: '50%',
            marginLeft: '-3px',
            transformOrigin: '3px 34px',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Text */}
      <div className="text-center space-y-2">
        <motion.p
          className="font-display font-medium text-white/80 text-sm tracking-widest uppercase"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {text}
        </motion.p>
        {/* Dot progress */}
        <div className="flex gap-1.5 justify-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1 h-1 rounded-full"
              style={{ background: 'var(--accent)' }}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};
