/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';
import { MathOperation, ExamQuestionResult, ExamRecord } from '../types';
import { saveExamRecord } from '../services/storageService';

interface ExamResultScreenProps {
  studentName?: string;
  topic: MathOperation;
  level: number;
  score: number;
  totalQuestions?: number;
  questionResults: ExamQuestionResult[];
  startedAt: string;
  completedAt?: string;
  onRetakeExam: () => void;
  onViewHistory: () => void;
  onHome: () => void;
}

const TOPIC_DETAILS: Record<MathOperation, { title: string; symbol: string }> = {
  addition: { title: 'Tambah', symbol: '➕' },
  subtraction: { title: 'Tolak', symbol: '➖' },
  multiplication: { title: 'Darab', symbol: '✖️' },
  division: { title: 'Bahagi', symbol: '➗' },
  time: { title: 'Bacaan Jam', symbol: '🕐' },
};

export function ExamResultScreen({
  studentName = 'Syifa',
  topic,
  level,
  score,
  totalQuestions = 10,
  questionResults,
  startedAt,
  completedAt = new Date().toISOString(),
  onRetakeExam,
  onViewHistory,
  onHome,
}: ExamResultScreenProps) {
  const isSavedRef = useRef<boolean>(false);
  const correctCount = score;
  const incorrectCount = totalQuestions - score;
  const percentage = Math.round((score / totalQuestions) * 100);

  const topicInfo = TOPIC_DETAILS[topic] || { title: 'Matematik', symbol: '📝' };

  // Save exam record locally on component mount (once only)
  useEffect(() => {
    if (isSavedRef.current) return;
    isSavedRef.current = true;

    const examId = `exam-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const record: ExamRecord = {
      examId,
      studentId: 'student-syifa-001',
      topic,
      level,
      startedAt,
      completedAt,
      totalQuestions,
      correctCount,
      incorrectCount,
      score,
      percentage,
      questionResults,
    };

    saveExamRecord(record);
  }, [topic, level, score, totalQuestions, questionResults, startedAt, completedAt]);

  // Motivational message logic adhering to Sprint 10 Section 24
  const getMotivationalMessage = () => {
    if (score === 10) return `Hebat, ${studentName}! Semua betul! 🎉`;
    if (score >= 8) return `Sangat bagus, ${studentName}! ⭐`;
    if (score >= 5) return `Bagus, ${studentName}! Teruskan berlatih! 💪`;
    if (score >= 1) return `${studentName}, usaha yang baik! Jom teruskan latihan. 🌟`;
    return `Tak mengapa, ${studentName}. Mari cuba lagi bersama! 💪`;
  };

  return (
    <main
      id="exam-result-screen"
      className="min-h-screen w-full bg-gradient-to-b from-slate-50 via-indigo-50/30 to-slate-100 flex flex-col justify-between p-4 sm:p-6 md:p-8"
    >
      <div className="w-full max-w-lg mx-auto my-auto py-4 sm:py-6 space-y-6">
        {/* Main Result Card */}
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-6 text-center">
          {/* Header Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-black uppercase">
            <span>📝 Ujian Selesai</span>
            <span>•</span>
            <span>{topicInfo.symbol} {topicInfo.title} Tahap {level}</span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-indigo-950 tracking-tight">
              🎉 KEPUTUSAN UJIAN
            </h1>
            <p className="text-sm font-semibold text-slate-500">
              Calon: <span className="text-indigo-600 font-bold">{studentName}</span>
            </p>
          </div>

          {/* Big Score Box */}
          <div className="p-6 bg-gradient-to-b from-indigo-500 to-indigo-700 rounded-3xl text-white shadow-md flex flex-col items-center justify-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-200">
              SKOR ANDA
            </span>
            <div className="text-5xl sm:text-6xl font-black tracking-tight">
              {score} <span className="text-3xl text-indigo-200">/ {totalQuestions}</span>
            </div>
            <div className="px-3.5 py-1 rounded-full bg-white/20 text-white text-sm font-black backdrop-blur-xs">
              {percentage}%
            </div>
          </div>

          {/* Breakdown Badges */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center gap-2">
              <span className="text-lg">⭐</span>
              <span className="text-xs sm:text-sm font-bold">
                {correctCount} Betul
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-center gap-2">
              <span className="text-lg">❌</span>
              <span className="text-xs sm:text-sm font-bold">
                {incorrectCount} Salah
              </span>
            </div>
          </div>

          {/* Motivational Message */}
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-sm sm:text-base font-bold text-center">
            {getMotivationalMessage()}
          </div>

          {/* Exam Question Review List (Section 25) */}
          <div className="text-left space-y-2 pt-2 border-t border-slate-100">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Semakan Ujian (10 Soalan):
            </h2>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
              {questionResults.map((res) => (
                <div
                  key={`exam-rev-q-${res.questionNumber}`}
                  className={`p-2 rounded-xl text-xs font-bold flex items-center justify-between border ${
                    res.isCorrect
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800'
                      : 'bg-rose-50/70 border-rose-200 text-rose-800'
                  }`}
                >
                  <span>Soalan {res.questionNumber}</span>
                  <span className="flex items-center gap-1">
                    {res.isCorrect ? '✅ Betul' : '❌ Salah'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              id="btn-retake-exam"
              type="button"
              onClick={onRetakeExam}
              className="btn-tactile-primary w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base cursor-pointer shadow-sm flex items-center justify-center gap-2"
            >
              <span>🔄</span>
              <span>UJI LAGI</span>
            </button>

            <button
              id="btn-view-history-from-result"
              type="button"
              onClick={onViewHistory}
              className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              <span>📊</span>
              <span>REKOD PENCAPAIAN</span>
            </button>

            <button
              id="btn-home-from-exam-result"
              type="button"
              onClick={onHome}
              className="w-full py-2.5 text-slate-500 hover:text-slate-700 font-bold text-xs cursor-pointer transition-all"
            >
              Kembali ke Laman Utama
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
