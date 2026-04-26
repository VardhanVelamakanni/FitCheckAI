import { useState } from 'react';
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

    if (jobDescription.trim().length < 50) {
      next.job = 'Please provide a more detailed job description (min 50 chars).';
    }

    if (resume.trim().length < 50) {
      next.resume = 'Please provide a more detailed resume (min 50 chars).';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (isLoading) return;

    const jdTrimmed = jobDescription.trim();
    const resumeTrimmed = resume.trim();

    if (!validate()) return;

    // FIXED FIELD NAME
    onSubmit({
      jd: jdTrimmed,
      resume: resumeTrimmed,
    });
  };

  const jdCount = jobDescription.length;
  const resumeCount = resume.length;

  const isDisabled =
    isLoading ||
    jobDescription.trim().length < 10 ||
    resume.trim().length < 10;

  return (
    <section
      id="input-section"
      className="relative min-h-screen flex items-center justify-center px-6 py-24"
    >
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(232,255,71,0.025) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 w-full max-w-3xl mx-auto">
        
        {/* Header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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

        {/* FORM */}
        <div className="space-y-5">

          {/* JD */}
          <div>
            <div
              className="glass rounded-2xl overflow-hidden"
              style={{
                border: errors.job
                  ? '1px solid rgba(255,80,80,0.4)'
                  : jobDescription
                  ? '1px solid rgba(232,255,71,0.2)'
                  : '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div className="flex justify-between px-5 pt-4 pb-2">
                <label className="text-xs text-white/40 uppercase">
                  Job Description
                </label>
                <span className="text-[10px] text-white/20">
                  {jdCount}
                </span>
              </div>

              <textarea
                value={jobDescription}
                onChange={(e) => {
                  setJobDescription(e.target.value);
                  if (errors.job) setErrors((p) => ({ ...p, job: undefined }));
                }}
                rows={7}
                placeholder="Paste job description..."
                className="w-full bg-transparent text-white px-5 pb-4"
              />
            </div>

            {errors.job && (
              <p className="text-red-400 text-xs mt-2">{errors.job}</p>
            )}
          </div>

          {/* RESUME */}
          <div>
            <div
              className="glass rounded-2xl overflow-hidden"
              style={{
                border: errors.resume
                  ? '1px solid rgba(255,80,80,0.4)'
                  : resume
                  ? '1px solid rgba(232,255,71,0.2)'
                  : '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div className="flex justify-between px-5 pt-4 pb-2">
                <label className="text-xs text-white/40 uppercase">
                  Resume
                </label>
                <span className="text-[10px] text-white/20">
                  {resumeCount}
                </span>
              </div>

              <textarea
                value={resume}
                onChange={(e) => {
                  setResume(e.target.value);
                  if (errors.resume) setErrors((p) => ({ ...p, resume: undefined }));
                }}
                rows={7}
                placeholder="Paste resume..."
                className="w-full bg-transparent text-white px-5 pb-4"
              />
            </div>

            {errors.resume && (
              <p className="text-red-400 text-xs mt-2">{errors.resume}</p>
            )}
          </div>

          {/* BUTTON */}
          <motion.button
            onClick={handleSubmit}
            disabled={isDisabled}
            className="w-full py-4 rounded-2xl font-semibold"
            style={{
              background: isDisabled ? 'gray' : 'var(--accent)',
              color: '#080808',
            }}
          >
            {isLoading ? 'Generating...' : 'Begin AI Interview →'}
          </motion.button>

          <p className="text-center text-white/20 text-xs">
            Your data is never stored
          </p>
        </div>
      </div>
    </section>
  );
};