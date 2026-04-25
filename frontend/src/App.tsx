import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LandingPage } from '@/pages/LandingPage';
import { InterviewPage } from '@/pages/InterviewPage';
import { ReportPage } from '@/pages/ReportPage';
import type { AppPage, InterviewState } from '@/types';

const initialInterviewState: InterviewState = {
  sessionId: '',
  history: [],
  currentSkill: '',
  skills: [],
  results: null,
  isDone: false,
};

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export default function App() {
  const [page, setPage] = useState<AppPage>('landing');
  const [interviewState, setInterviewState] =
    useState<InterviewState>(initialInterviewState);

  //  START INTERVIEW (MAP BACKEND → FRONTEND)
  const handleInterviewStart = (backendData: any) => {
    const mappedState: InterviewState = {
      sessionId: '', // not used but kept for structure
      history: backendData.history || [],
      currentSkill: backendData.current_skill || '',
      skills: backendData.skills || [],
      results: backendData.results || {},
      isDone: false,
    };

    setInterviewState(mappedState);
    setPage('interview');
  };

  //  UPDATE DURING INTERVIEW
  const handleStateUpdate = (backendData: any) => {
    const updatedState: Partial<InterviewState> = {
      history: backendData.history,
      currentSkill: backendData.current_skill,
      skills: backendData.skills,
      results: backendData.results,
      isDone: backendData.done,
    };

    setInterviewState((prev) => ({
      ...prev,
      ...updatedState,
    }));
  };

  //  COMPLETE INTERVIEW
  const handleInterviewComplete = (backendData: any) => {
    const finalState: InterviewState = {
      sessionId: '',
      history: backendData.history || [],
      currentSkill: backendData.current_skill || '',
      skills: backendData.skills || [],
      results: backendData.results || {},
      isDone: true,
    };

    // attach extra final data (important)
    (finalState as any).final_report = backendData.final_report;
    (finalState as any).gaps = backendData.gaps;
    (finalState as any).adjacent_skills = backendData.adjacent_skills;

    setInterviewState(finalState);
    setPage('report');
  };

  //  RESTART
  const handleRestart = () => {
    setInterviewState(initialInterviewState);
    setPage('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence mode="wait">
      {page === 'landing' && (
        <motion.div
          key="landing"
          variants={pageVariants}
          initial="initial"
          animate="enter"
          exit="exit"
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <LandingPage onInterviewStart={handleInterviewStart} />
        </motion.div>
      )}

      {page === 'interview' && (
        <motion.div
          key="interview"
          variants={pageVariants}
          initial="initial"
          animate="enter"
          exit="exit"
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <InterviewPage
            state={interviewState}
            onUpdate={handleStateUpdate}
            onComplete={handleInterviewComplete}
          />
        </motion.div>
      )}

      {page === 'report' && (
        <motion.div
          key="report"
          variants={pageVariants}
          initial="initial"
          animate="enter"
          exit="exit"
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <ReportPage state={interviewState} onRestart={handleRestart} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}