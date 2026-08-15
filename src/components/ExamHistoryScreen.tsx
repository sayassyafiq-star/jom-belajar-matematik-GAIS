/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ExamRecord, MathOperation } from '../types';
import { getAllExamRecords, getStudentProfile } from '../services/storageService';

interface ExamHistoryScreenProps {
  studentName?: string;
  onStartExam: () => void;
  onBack: () => void;
}

const TOPIC_CONFIG: Record<MathOperation, { title: string; symbol: string; badgeColor: string }> = {
  addition: { title: 'Tambah', symbol: '➕', badgeColor: 'bg-indigo-100 text-indigo-800' },
  subtraction: { title: 'Tolak', symbol: '➖', badgeColor: 'bg-rose-100 text-rose-800' },
  multiplication: { title: 'Darab', symbol: '✖️', badgeColor: 'bg-amber-100 text-amber-800' },
  division: { title: 'Bahagi', symbol: '➗', badgeColor: 'bg-emerald-100 text-emerald-800' },
  time: { title: 'Bacaan Jam', symbol: '🕐', badgeColor: 'bg-purple-100 text-purple-800' },
};

export function ExamHistoryScreen({ studentName, onStartExam, onBack }: ExamHistoryScreenProps) {
  const [records, setRecords] = useState<ExamRecord[]>([]);
  const student = getStudentProfile();
  const activeDisplayName = studentName || student.displayName || 'Syifa';

  useEffect(() => {
    setRecords(getAllExamRecords());
  }, []);

  const totalExams = records.length;
  const averageScore =
    totalExams > 0
      ? Math.round(records.reduce((acc, r) => acc + (r.score || 0), 0) / totalExams)
      : 0;

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('ms-MY', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <main
      id="exam-history-screen"
      className="min-h-screen w-full bg-gradient-to-b from-slate-50 via-indigo-50/20 to-slate-100 flex flex-col justify-between p-4 sm:p-6 md:p-8"
    >
      {/* Top Header */}
      <header className="w-full max-w-2xl mx-auto flex items-center justify-between gap-3 pt-2">
        <button
          id="btn-back-from-history"
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all cursor-pointer"
        >
          <span>←</span>
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 text-xs font-black uppercase">
            📊 Rekod Pencapaian
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="w-full max-w-2xl mx-auto my-auto py-6 space-y-6">
        {/* Profile & Summary Banner */}
        <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-xs">
              {activeDisplayName.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-indigo-950">
                {activeDisplayName}
              </h1>
              <p className="text-xs font-semibold text-slate-400">
                {student.fullName} • Rekod Tempatan Peranti
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center">
            <div className="px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-center min-w-[80px]">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Jumlah Ujian</span>
              <span className="text-lg font-black text-indigo-950">{totalExams}</span>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-indigo-50 border border-indigo-100 text-center min-w-[80px]">
              <span className="text-[10px] font-bold text-indigo-500 block uppercase">Purata Skor</span>
              <span className="text-lg font-black text-indigo-700">{averageScore}/10</span>
            </div>
          </div>
        </div>

        {/* History List or Empty State */}
        {totalExams === 0 ? (
          <div
            id="empty-exam-history"
            className="p-8 sm:p-12 bg-white rounded-3xl border border-dashed border-slate-300 text-center space-y-4 shadow-2xs"
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl">
              📝
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-black text-slate-800">
                Belum ada rekod ujian.
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-500">
                Jom cuba ujian pertama anda! 🌟
              </p>
            </div>

            <button
              id="btn-start-first-exam"
              type="button"
              onClick={onStartExam}
              className="btn-tactile-primary px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm sm:text-base shadow-sm cursor-pointer inline-flex items-center gap-2"
            >
              <span>📝</span>
              <span>MULA UJIAN</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-wider">
                Sejarah Ujian ({totalExams} Rekod)
              </h2>
              <button
                type="button"
                onClick={onStartExam}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                + Ujian Baharu
              </button>
            </div>

            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {records.map((record) => {
                const topicInfo = TOPIC_CONFIG[record.topic] || {
                  title: record.topic,
                  symbol: '📝',
                  badgeColor: 'bg-slate-100 text-slate-800',
                };

                const isGood = record.percentage >= 80;
                const isModerate = record.percentage >= 50 && record.percentage < 80;

                return (
                  <div
                    key={record.examId}
                    className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-indigo-200 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-xl shrink-0">
                        {topicInfo.symbol}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-indigo-950">
                            {topicInfo.title}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${topicInfo.badgeColor}`}>
                            Tahap {record.level}
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-400 block mt-0.5">
                          {formatDate(record.completedAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                      <div className="text-right">
                        <span className="text-sm sm:text-base font-black text-indigo-950">
                          {record.score} / {record.totalQuestions}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 block">
                          {record.correctCount} Betul, {record.incorrectCount} Salah
                        </span>
                      </div>

                      <div
                        className={`px-3 py-1 rounded-xl text-xs font-black min-w-[54px] text-center ${
                          isGood
                            ? 'bg-emerald-100 text-emerald-800'
                            : isModerate
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {record.percentage}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="w-full max-w-2xl mx-auto text-center pb-2">
        <p className="text-xs font-semibold text-slate-400">
          Data Disimpan Secara Tempatan • Tiada Internet Diperlukan
        </p>
      </footer>
    </main>
  );
}
