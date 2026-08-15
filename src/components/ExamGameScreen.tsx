/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Question, ExamQuestionResult } from '../types';
import { VisualStimulus } from './VisualStimulus';
import { NumberCard } from './NumberCard';

interface ExamGameScreenProps {
  question: Question;
  sessionIndex: number;
  totalQuestions?: number;
  studentName?: string;
  onAnswerSubmit: (result: ExamQuestionResult) => void;
  onExitExam: () => void;
}

export function ExamGameScreen({
  question,
  sessionIndex,
  totalQuestions = 10,
  studentName = 'Syifa',
  onAnswerSubmit,
  onExitExam,
}: ExamGameScreenProps) {
  const [selectedChoice, setSelectedChoice] = useState<number | string | null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  const handleSelect = (choice: number | string) => {
    if (isLocked) return;
    setSelectedChoice(choice);
  };

  const handleSubmit = () => {
    if (selectedChoice === null || isLocked) return;

    // Lock choices immediately to enforce single submission
    setIsLocked(true);

    const isCorrect = String(selectedChoice) === String(question.correctAnswer);

    const result: ExamQuestionResult = {
      questionNumber: sessionIndex,
      questionId: question.id,
      prompt: question.prompt,
      studentAnswer: selectedChoice,
      correctAnswer: question.correctAnswer,
      isCorrect,
    };

    // Smooth neutral transition to next question without revealing answers
    setTimeout(() => {
      onAnswerSubmit(result);
      setSelectedChoice(null);
      setIsLocked(false);
    }, 400);
  };

  // Topic display labels
  const topicLabels: Record<string, { label: string; symbol: string }> = {
    addition: { label: 'Tambah', symbol: '➕' },
    subtraction: { label: 'Tolak', symbol: '➖' },
    multiplication: { label: 'Darab', symbol: '✖️' },
    division: { label: 'Bahagi', symbol: '➗' },
    time: { label: 'Bacaan Jam', symbol: '🕐' },
  };

  const currentTopic = topicLabels[question.operation] || {
    label: question.operation,
    symbol: '📝',
  };

  const progressPercent = ((sessionIndex - 1) / totalQuestions) * 100;

  return (
    <main
      id="exam-game-screen"
      className="min-h-screen w-full bg-slate-50 flex flex-col justify-between p-3 sm:p-5 md:p-6"
    >
      {/* Top Header */}
      <header className="w-full max-w-xl mx-auto flex items-center justify-between gap-3 pt-1">
        <button
          id="btn-exit-exam"
          type="button"
          onClick={() => {
            if (window.confirm('Adakah anda pasti mahu menamatkan ujian ini?')) {
              onExitExam();
            }
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs hover:bg-rose-50 hover:text-rose-600 text-slate-500 font-bold text-xs transition-all cursor-pointer"
        >
          <span>✕</span>
          <span>Tamat Ujian</span>
        </button>

        {/* Exam Badge */}
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-900 text-xs font-black uppercase">
            📝 Mod Ujian
          </span>
          <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-bold">
            {currentTopic.symbol} {currentTopic.label} • T{question.level}
          </span>
        </div>
      </header>

      {/* Progress Section */}
      <div className="w-full max-w-xl mx-auto mt-3">
        <div className="flex items-center justify-between text-xs font-black text-slate-600 mb-1.5 px-1">
          <span className="tracking-wide">
            SOALAN {sessionIndex} / {totalQuestions}
          </span>
          <span className="text-slate-400 font-bold">
            Calon: {studentName}
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={sessionIndex}
          aria-valuemin={1}
          aria-valuemax={totalQuestions}
          aria-label="Kemajuan Ujian"
          className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden"
        >
          <div
            className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
            style={{ width: `${Math.max(progressPercent, 5)}%` }}
          />
        </div>
      </div>

      {/* Main Stimulus & Question Card */}
      <div className="w-full max-w-xl mx-auto my-auto py-3 sm:py-4 flex flex-col gap-4">
        {/* Math Visual Stimulus (Same mathematical engine and visuals) */}
        <div className="p-4 sm:p-6 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col items-center justify-center min-h-[160px]">
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
        </div>

        {/* 4 Jom Cards Choices Grid */}
        <div className="space-y-3">
          <div className="text-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pilih jawapan yang betul:
            </span>
          </div>

          <div
            id="exam-choices-grid"
            className="grid grid-cols-2 gap-3 sm:gap-4 max-w-md mx-auto"
          >
            {question.choices.map((choice, index) => {
              const isSelected = selectedChoice === choice;

              return (
                <NumberCard
                  key={`exam-choice-${index}-${choice}`}
                  id={`exam-choice-card-${index}`}
                  value={choice}
                  selected={isSelected}
                  disabled={isLocked}
                  state={isSelected ? 'selected' : 'default'}
                  onClick={() => handleSelect(choice)}
                  size="md"
                />
              );
            })}
          </div>
        </div>

        {/* Submit Action Button */}
        <div className="w-full max-w-md mx-auto pt-2">
          <button
            id="btn-submit-exam-answer"
            type="button"
            disabled={selectedChoice === null || isLocked}
            onClick={handleSubmit}
            className={`btn-tactile-primary w-full py-3.5 sm:py-4 rounded-2xl font-extrabold text-base sm:text-lg shadow-sm flex items-center justify-center gap-2 transition-all ${
              selectedChoice === null || isLocked
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed border-none shadow-none'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
            }`}
          >
            <span>HANTAR JAWAPAN</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <footer className="w-full max-w-xl mx-auto text-center pb-1">
        <p className="text-[11px] font-semibold text-slate-400">
          Ujian Matematik • Jawapan pertama adalah muktamad
        </p>
      </footer>
    </main>
  );
}
