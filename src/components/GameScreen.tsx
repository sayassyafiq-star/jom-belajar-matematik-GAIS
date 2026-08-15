import { useState, useEffect } from 'react';
import { NumberCard } from './NumberCard';
import { VisualStimulus } from './VisualStimulus';
import { Question, CardState } from '../types';

interface GameScreenProps {
  question: Question;
  studentName?: string;
  onBack: () => void;
  onAnswerCorrect?: () => void;
  onNextQuestion: () => void;
}

export function GameScreen({
  question,
  studentName = 'Syifa',
  onBack,
  onAnswerCorrect,
  onNextQuestion,
}: GameScreenProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<'unsubmitted' | 'correct' | 'incorrect'>('unsubmitted');
  const [isAnswerLocked, setIsAnswerLocked] = useState<boolean>(false);

  // Reset local state when a new question is loaded
  useEffect(() => {
    setSelectedAnswer(null);
    setSubmissionStatus('unsubmitted');
    setIsAnswerLocked(false);
  }, [question.id]);

  // Handle student selecting a choice card
  const handleSelectChoice = (value: number | string) => {
    if (isAnswerLocked) return; // Disallow changes once question is answered correctly

    setSelectedAnswer(value);
    // If student was in 'incorrect' state, selecting another card clears the incorrect state
    if (submissionStatus === 'incorrect') {
      setSubmissionStatus('unsubmitted');
    }
  };

  // Handle student clicking HANTAR
  const handleSubmit = () => {
    if (selectedAnswer === null || isAnswerLocked) return;

    if (selectedAnswer === question.correctAnswer) {
      setSubmissionStatus('correct');
      setIsAnswerLocked(true);
      if (onAnswerCorrect) {
        onAnswerCorrect();
      }
    } else {
      setSubmissionStatus('incorrect');
    }
  };

  // Helper to compute card visual state
  const getCardState = (choiceValue: number | string): CardState => {
    if (isAnswerLocked && choiceValue === question.correctAnswer) {
      return 'correct';
    }

    if (submissionStatus === 'incorrect' && selectedAnswer === choiceValue) {
      return 'incorrect';
    }

    if (selectedAnswer === choiceValue) {
      return 'selected';
    }

    if (isAnswerLocked) {
      return 'disabled';
    }

    return 'default';
  };

  // Progress calculations
  const total = question.totalQuestions || 10;
  const currentIdx = question.questionIndex || 1;
  const progressPercent = Math.min(100, Math.max(0, Math.round((currentIdx / total) * 100)));

  return (
    <main
      id="game-screen"
      className="relative min-h-screen w-full bg-gradient-to-b from-slate-50 via-indigo-50/20 to-slate-100 flex flex-col justify-between p-3.5 sm:p-5 md:p-6 overflow-x-hidden"
    >
      {/* Background Decorative Ambient Math Symbols */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-15" aria-hidden="true">
        <span className="absolute top-16 left-4 text-4xl text-indigo-400 font-black">+</span>
        <span className="absolute top-32 right-6 text-3xl text-emerald-400 font-black">⭐</span>
        <span className="absolute bottom-28 left-6 text-3xl text-rose-400 font-black">−</span>
        <span className="absolute bottom-16 right-8 text-4xl text-amber-400 font-black">=</span>
      </div>

      {/* 1. TOP HEADER BAR: [← Kembali] [TOPIC BADGE] [SOALAN 1 / 10] & Progress Bar */}
      <header className="relative z-10 w-full max-w-lg mx-auto flex flex-col gap-2.5 pt-1">
        <div className="flex items-center justify-between">
          {/* Back Button */}
          <button
            id="btn-back-to-home"
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 border border-slate-200 shadow-2xs hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-bold text-xs sm:text-sm cursor-pointer transition-all active:scale-95 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-300"
            aria-label="Kembali ke pemilihan tahap"
          >
            <span aria-hidden="true">←</span>
            <span>Kembali</span>
          </button>

          {/* Topic Title Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-black text-xs sm:text-sm uppercase tracking-wider">
            <span aria-hidden="true">{question.operatorSymbol || '➕'}</span>
            <span>
              {question.topicTitle?.toUpperCase() ||
                (question.operation === 'subtraction'
                  ? 'TOLAK'
                  : question.operation === 'multiplication'
                  ? 'DARAB'
                  : question.operation === 'division'
                  ? 'BAHAGI'
                  : question.operation === 'time'
                  ? 'BACAAN JAM'
                  : 'TAMBAH')}
            </span>
          </div>

          {/* Question Step Indicator with Clear "SOALAN X / Y" formatting */}
          <div
            id="question-step-indicator"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs sm:text-sm font-black text-slate-700"
          >
            <span className="text-[10px] sm:text-xs text-indigo-500 font-extrabold uppercase tracking-wider">SOALAN</span>
            <span className="text-indigo-600 font-black">{currentIdx}</span>
            <span className="text-slate-400">/</span>
            <span>{total}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div
          id="game-progress-bar"
          className="w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden shadow-inner"
          role="progressbar"
          aria-valuenow={currentIdx}
          aria-valuemin={1}
          aria-valuemax={total}
          aria-label={`Kemajuan soalan: ${currentIdx} daripada ${total}`}
        >
          <div
            className="h-full bg-indigo-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* 2. MAIN QUESTION AREA: Keyed transition container for smooth question entry */}
      <div
        key={`question-container-${question.id}`}
        className="animate-question-enter relative z-10 w-full max-w-lg mx-auto flex flex-col items-center justify-center my-auto py-3 sm:py-4 gap-4 sm:gap-5"
      >
        {/* Question Prompt & Friendly Encouragement */}
        <div className="text-center space-y-0.5">
          <p className="text-xs sm:text-sm text-indigo-600 font-bold">
            {question.operation === 'time' ? `Jom lihat jam, ${studentName}! ⏱️` : `Jom kira, ${studentName}! ✨`}
          </p>
          <h2
            id="question-prompt"
            className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 tracking-tight drop-shadow-2xs"
          >
            {question.prompt}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold">
            {question.operation === 'subtraction'
              ? 'Kira baki epal yang tinggal dan pilih jawapan yang betul.'
              : question.operation === 'multiplication'
              ? 'Kira jumlah epal dalam semua kumpulan dan pilih jawapan yang betul.'
              : question.operation === 'division'
              ? 'Kongsi epal sama rata dan pilih jawapan yang betul.'
              : question.operation === 'time'
              ? 'Lihat kedudukan jarum jam dan pilih waktu yang betul.'
              : 'Kira jumlah epal dan pilih jawapan yang betul.'}
          </p>
        </div>

        {/* Deterministic Visual Stimulus */}
        <VisualStimulus
          operation={question.operation}
          operandA={question.operandA}
          operandB={question.operandB}
          level={question.level}
          prompt={question.prompt}
          groupA={question.groupA}
          groupB={question.groupB}
          operatorSymbol={question.operatorSymbol}
        />

        {/* 4 Jom Card Choices Grid */}
        <div
          id="choices-grid"
          className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-sm sm:max-w-md place-items-center"
        >
          {question.choices.map((choice) => (
            <NumberCard
              key={`choice-${choice}`}
              id={`choice-card-${choice}`}
              value={choice}
              state={getCardState(choice)}
              size="md"
              onClick={() => handleSelectChoice(choice)}
            />
          ))}
        </div>

        {/* Feedback Messages Banner with Encouraging Tone & XP Reward */}
        <div className="w-full max-w-md min-h-[48px] flex items-center justify-center">
          {submissionStatus === 'correct' && (
            <div
              id="feedback-correct"
              className="flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-800 font-black text-base sm:text-lg shadow-xs animate-card-pop"
            >
              <span className="text-xl" aria-hidden="true">🎉</span>
              <span>Betul! Hebatnya!</span>
              <span
                id="xp-reward-badge"
                className="animate-xp-pop ml-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-900 text-xs sm:text-sm font-black shadow-2xs"
              >
                <span>+10 XP</span>
                <span>⭐</span>
              </span>
            </div>
          )}

          {submissionStatus === 'incorrect' && (
            <div
              id="feedback-incorrect"
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-700 font-bold text-sm sm:text-base shadow-xs animate-card-shake"
            >
              <span className="text-lg" aria-hidden="true">💪</span>
              <span>Cuba lagi!</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. FOOTER ACTION BAR: [ HANTAR ] or [ SOALAN SETERUSNYA → ] */}
      <footer className="relative z-10 w-full max-w-lg mx-auto pt-1 pb-2">
        {submissionStatus === 'correct' ? (
          <button
            id="btn-soalan-seterusnya"
            type="button"
            onClick={onNextQuestion}
            className="btn-tactile-primary w-full flex items-center justify-center gap-2.5 py-4 sm:py-4.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-black text-lg sm:text-xl shadow-md cursor-pointer select-none focus:outline-hidden focus-visible:ring-4 focus-visible:ring-indigo-300"
          >
            <span>SOALAN SETERUSNYA</span>
            <span aria-hidden="true">→</span>
          </button>
        ) : (
          <button
            id="btn-hantar-jawapan"
            type="button"
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            className={`w-full flex items-center justify-center gap-2 py-4 sm:py-4.5 rounded-2xl font-black text-lg sm:text-xl select-none transition-all duration-150 ${
              selectedAnswer !== null
                ? 'btn-tactile-primary bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white cursor-pointer shadow-md focus:outline-hidden focus-visible:ring-4 focus-visible:ring-indigo-300'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed border-2 border-slate-300/60 shadow-none'
            }`}
          >
            <span>HANTAR</span>
          </button>
        )}
      </footer>
    </main>
  );
}
