/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { TopicSelectionScreen } from './components/TopicSelectionScreen';
import { LevelSelectionScreen } from './components/LevelSelectionScreen';
import { GameScreen } from './components/GameScreen';
import { ResultScreen } from './components/ResultScreen';
import { ExamInstructionScreen } from './components/ExamInstructionScreen';
import { ExamGameScreen } from './components/ExamGameScreen';
import { ExamResultScreen } from './components/ExamResultScreen';
import { ExamHistoryScreen } from './components/ExamHistoryScreen';
import { SettingsModal } from './components/SettingsModal';
import { JomCardDemo } from './components/JomCardDemo';
import { MathOperation, Question, ExamQuestionResult, StudentProfile } from './types';
import { generateQuestion } from './engine/questionEngine';
import { getStudentProfile } from './services/storageService';

type AppView =
  | 'home'
  | 'topic-select'
  | 'level-select'
  | 'game'
  | 'result'
  | 'exam-topic-select'
  | 'exam-level-select'
  | 'exam-intro'
  | 'exam-game'
  | 'exam-result'
  | 'exam-history'
  | 'jom-card-demo';

export default function App() {
  const [profile, setProfile] = useState<StudentProfile>(getStudentProfile());
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<AppView>('home');

  // Sync profile on mount
  useEffect(() => {
    setProfile(getStudentProfile());
  }, []);

  const studentName = profile.displayName || 'Syifa';

  // ==========================================
  // 1. TRAINING MODE SESSION STATE (PROTECTED)
  // ==========================================
  const [selectedTopic, setSelectedTopic] = useState<MathOperation>('addition');
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [sessionIndex, setSessionIndex] = useState<number>(1);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [sessionHistory, setSessionHistory] = useState<Set<string>>(() => new Set());
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  // Start a fresh 10-question learning session
  const startLearningSession = (topic: MathOperation, level: number) => {
    setSelectedTopic(topic);
    setSelectedLevel(level);
    setSessionIndex(1);
    setCorrectCount(0);

    const history = new Set<string>();
    const initialQuestion = generateQuestion(topic, level, history);
    history.add(initialQuestion.id);

    setSessionHistory(history);
    setCurrentQuestion({
      ...initialQuestion,
      questionIndex: 1,
      totalQuestions: 10,
    });
    setCurrentView('game');
  };

  // Move to next question or complete training session
  const handleNextQuestion = () => {
    if (sessionIndex < 10) {
      const nextIndex = sessionIndex + 1;
      const history = new Set<string>(sessionHistory);
      const nextQ = generateQuestion(selectedTopic, selectedLevel, history);
      history.add(nextQ.id);

      setSessionHistory(history);
      setSessionIndex(nextIndex);
      setCurrentQuestion({
        ...nextQ,
        questionIndex: nextIndex,
        totalQuestions: 10,
      });
    } else {
      setCurrentView('result');
    }
  };

  // ==========================================
  // 2. EXAM MODE SESSION STATE (SPRINT 10)
  // ==========================================
  const [examTopic, setExamTopic] = useState<MathOperation>('addition');
  const [examLevel, setExamLevel] = useState<number>(1);
  const [examSessionIndex, setExamSessionIndex] = useState<number>(1);
  const [examScore, setExamScore] = useState<number>(0);
  const [examQuestionResults, setExamQuestionResults] = useState<ExamQuestionResult[]>([]);
  const [examSessionHistory, setExamSessionHistory] = useState<Set<string>>(() => new Set());
  const [currentExamQuestion, setCurrentExamQuestion] = useState<Question | null>(null);
  const [examStartedAt, setExamStartedAt] = useState<string>('');

  // Start fresh exam session
  const startExamSession = (topic: MathOperation, level: number) => {
    setExamTopic(topic);
    setExamLevel(level);
    setExamSessionIndex(1);
    setExamScore(0);
    setExamQuestionResults([]);
    setExamStartedAt(new Date().toISOString());

    const history = new Set<string>();
    const initialQ = generateQuestion(topic, level, history);
    history.add(initialQ.id);

    setExamSessionHistory(history);
    setCurrentExamQuestion({
      ...initialQ,
      questionIndex: 1,
      totalQuestions: 10,
    });
    setCurrentView('exam-game');
  };

  // Submit exam answer and advance cleanly
  const handleExamAnswerSubmit = (result: ExamQuestionResult) => {
    const updatedResults = [...examQuestionResults, result];
    setExamQuestionResults(updatedResults);

    let updatedScore = examScore;
    if (result.isCorrect) {
      updatedScore += 1;
      setExamScore(updatedScore);
    }

    if (examSessionIndex < 10) {
      const nextIndex = examSessionIndex + 1;
      const history = new Set<string>(examSessionHistory);
      const nextQ = generateQuestion(examTopic, examLevel, history);
      history.add(nextQ.id);

      setExamSessionHistory(history);
      setExamSessionIndex(nextIndex);
      setCurrentExamQuestion({
        ...nextQ,
        questionIndex: nextIndex,
        totalQuestions: 10,
      });
    } else {
      // Completed all 10 exam questions
      setCurrentView('exam-result');
    }
  };

  return (
    <>
      {/* 1. HOME SCREEN */}
      {currentView === 'home' && (
        <HomeScreen
          studentName={studentName}
          onStartLearning={() => setCurrentView('topic-select')}
          onStartExam={() => setCurrentView('exam-topic-select')}
          onViewHistory={() => setCurrentView('exam-history')}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenCardDemo={() => setCurrentView('jom-card-demo')}
        />
      )}

      {/* 2. TRAINING MODE: TOPIC SELECTION */}
      {currentView === 'topic-select' && (
        <TopicSelectionScreen
          onSelectTopic={(topic) => {
            setSelectedTopic(topic);
            setCurrentView('level-select');
          }}
          onBack={() => setCurrentView('home')}
        />
      )}

      {/* 3. TRAINING MODE: LEVEL SELECTION */}
      {currentView === 'level-select' && (
        <LevelSelectionScreen
          topic={selectedTopic}
          onSelectLevel={(level) => {
            startLearningSession(selectedTopic, level);
          }}
          onBack={() => setCurrentView('topic-select')}
        />
      )}

      {/* 4. TRAINING MODE: GAME SCREEN (10 Questions with retry and XP) */}
      {currentView === 'game' && currentQuestion && (
        <GameScreen
          question={currentQuestion}
          studentName={studentName}
          onBack={() => setCurrentView('level-select')}
          onAnswerCorrect={() => setCorrectCount((prev) => prev + 1)}
          onNextQuestion={handleNextQuestion}
        />
      )}

      {/* 5. TRAINING MODE: RESULT SCREEN */}
      {currentView === 'result' && (
        <ResultScreen
          studentName={studentName}
          topic={selectedTopic}
          level={selectedLevel}
          score={correctCount}
          totalQuestions={10}
          onPlayAgain={() => startLearningSession(selectedTopic, selectedLevel)}
          onHome={() => setCurrentView('home')}
        />
      )}

      {/* 6. EXAM MODE: TOPIC SELECTION */}
      {currentView === 'exam-topic-select' && (
        <TopicSelectionScreen
          onSelectTopic={(topic) => {
            setExamTopic(topic);
            setCurrentView('exam-level-select');
          }}
          onBack={() => setCurrentView('home')}
        />
      )}

      {/* 7. EXAM MODE: LEVEL SELECTION */}
      {currentView === 'exam-level-select' && (
        <LevelSelectionScreen
          topic={examTopic}
          onSelectLevel={(level) => {
            setExamLevel(level);
            setCurrentView('exam-intro');
          }}
          onBack={() => setCurrentView('exam-topic-select')}
        />
      )}

      {/* 8. EXAM MODE: INSTRUCTION SCREEN */}
      {currentView === 'exam-intro' && (
        <ExamInstructionScreen
          topic={examTopic}
          level={examLevel}
          studentName={studentName}
          onStartExam={() => startExamSession(examTopic, examLevel)}
          onBack={() => setCurrentView('exam-level-select')}
        />
      )}

      {/* 9. EXAM MODE: GAME SESSION SCREEN (10 Questions, single submit, locked, no XP) */}
      {currentView === 'exam-game' && currentExamQuestion && (
        <ExamGameScreen
          question={currentExamQuestion}
          sessionIndex={examSessionIndex}
          totalQuestions={10}
          studentName={studentName}
          onAnswerSubmit={handleExamAnswerSubmit}
          onExitExam={() => setCurrentView('home')}
        />
      )}

      {/* 10. EXAM MODE: RESULT SCREEN */}
      {currentView === 'exam-result' && (
        <ExamResultScreen
          studentName={studentName}
          topic={examTopic}
          level={examLevel}
          score={examScore}
          totalQuestions={10}
          questionResults={examQuestionResults}
          startedAt={examStartedAt}
          onRetakeExam={() => startExamSession(examTopic, examLevel)}
          onViewHistory={() => setCurrentView('exam-history')}
          onHome={() => setCurrentView('home')}
        />
      )}

      {/* 11. EXAM HISTORY / REKOD PENCAPAIAN */}
      {currentView === 'exam-history' && (
        <ExamHistoryScreen
          studentName={studentName}
          onStartExam={() => setCurrentView('exam-topic-select')}
          onBack={() => setCurrentView('home')}
        />
      )}

      {/* 12. MATH LAB & TEST BENCH */}
      {currentView === 'jom-card-demo' && (
        <div className="min-h-screen bg-slate-50 py-4 sm:py-6">
          <JomCardDemo onBackToHome={() => setCurrentView('home')} />
        </div>
      )}

      {/* SETTINGS MODAL */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onDataChanged={() => setProfile(getStudentProfile())}
      />
    </>
  );
}

