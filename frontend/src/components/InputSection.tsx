import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import type { StartRequest } from '@/types';

interface InputSectionProps {
  onSubmit: (data: StartRequest) => void;
  isLoading: boolean;
}

export const InputSection = ({ onSubmit, isLoading }: InputSectionProps) => {
  const [jobDescription, setJobDescription] = useState('');
  const [resume, setResume] = useState('');
  const [errors, setErrors] = useState<{ job?: string; resume?: string }>({});

  const validate = () => {
    const next: typeof errors = {};
    if (jobDescription.trim().length < 50) next.job = 'Please provide a more detailed job description (min 50 chars).';
    if (resume.trim().length < 50) next.resume = 'Please provide a more detailed resume (min 50 chars).';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ job_description: jobDescription, resume });
  };

  const jdCount = jobDescription.length;
  const resumeCount = resume.length;

  return (
    <section id="input-section" className="relative min-h-screen flex items-center justify-center px-6 py-24">
      {/* Subtle background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(232,255,71,0.025) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 w-full max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-mono tracking-widest text-white/30 uppercase mb-4 block">
            Step 01 — Setup
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-3">
            Set the stage
          </h2>
          <p className="text-white/40 text-sm max-w-lg mx-auto">
            Drop in the job description and your resume. The AI will extract skills and craft a tailored interview.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          className="space-y-5"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Job Description */}
          <div className="group">
            <div
              className="glass rounded-2xl overflow-hidden transition-all duration-300"
              style={{
                border: errors.job
                  ? '1px solid rgba(255,80,80,0.4)'
                  : jobDescription
                  ? '1px solid rgba(232,255,71,0.2)'
                  : '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div className="flex items-center justify-between px-5 pt-4 pb-2">
                <label className="text-xs font-mono tracking-widest text-white/40 uppercase">
                  Job Description
                </label>
                <span className="text-[10px] font-mono text-white/20">{jdCount} chars</span>
              </div>
              <textarea
                value={jobDescription}
                onChange={(e) => {
                  setJobDescription(e.target.value);
                  if (errors.job) setErrors((p) => ({ ...p, job: undefined }));
                }}
                placeholder="Paste the job description here — role requirements, responsibilities, tech stack..."
                rows={7}
                className="w-full bg-transparent text-white/80 text-sm px-5 pb-4 placeholder-white/20 font-body"
              />
            </div>
            {errors.job && (
              <motion.p
                className="mt-2 text-xs text-red-400/80 px-1"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.job}
              </motion.p>
            )}
          </div>

          {/* Resume */}
          <div className="group">
            <div
              className="glass rounded-2xl overflow-hidden transition-all duration-300"
              style={{
                border: errors.resume
                  ? '1px solid rgba(255,80,80,0.4)'
                  : resume
                  ? '1px solid rgba(232,255,71,0.2)'
                  : '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div className="flex items-center justify-between px-5 pt-4 pb-2">
                <label className="text-xs font-mono tracking-widest text-white/40 uppercase">
                  Resume / CV
                </label>
                <span className="text-[10px] font-mono text-white/20">{resumeCount} chars</span>
              </div>
              <textarea
                value={resume}
                onChange={(e) => {
                  setResume(e.target.value);
                  if (errors.resume) setErrors((p) => ({ ...p, resume: undefined }));
                }}
                placeholder="Paste your resume content here — experience, skills, projects, education..."
                rows={7}
                className="w-full bg-transparent text-white/80 text-sm px-5 pb-4 placeholder-white/20 font-body"
              />
            </div>
            {errors.resume && (
              <motion.p
                className="mt-2 text-xs text-red-400/80 px-1"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.resume}
              </motion.p>
            )}
          </div>

          {/* Submit */}
          <motion.button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-4 rounded-2xl font-display font-semibold text-sm tracking-wide relative overflow-hidden disabled:opacity-60"
            style={{
              background: isLoading
                ? 'rgba(232,255,71,0.4)'
                : 'var(--accent)',
              color: '#080808',
            }}
            whileHover={isLoading ? {} : { scale: 1.01 }}
            whileTap={isLoading ? {} : { scale: 0.99 }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-3">
                <motion.span
                  className="w-3 h-3 rounded-full border-2"
                  style={{ borderColor: 'rgba(0,0,0,0.3)', borderTopColor: '#080808' }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                />
                Generating your interview…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Begin AI Interview
                <span>→</span>
              </span>
            )}
          </motion.button>

          {/* Hint */}
          <p className="text-center text-white/20 text-xs font-mono">
            Your data is never stored — interview sessions are ephemeral
          </p>
        </motion.div>
      </div>
    </section>
  );
};
