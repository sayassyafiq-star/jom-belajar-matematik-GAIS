/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MathOperation } from '../types';

interface ExamInstructionScreenProps {
  topic: MathOperation;
  level: number;
  studentName?: string;
  onStartExam: () => void;
  onBack: () => void;
}

const TOPIC_NAMES: Record<MathOperation, { title: string; symbol: string; color: string }> = {
  addition: { title: 'Tambah', symbol: '➕', color: 'bg-indigo-100 text-indigo-800' },
  subtraction: { title: 'Tolak', symbol: '➖', color: 'bg-rose-100 text-rose-800' },
  multiplication: { title: 'Darab', symbol: '✖️', color: 'bg-amber-100 text-amber-800' },
  division: { title: 'Bahagi', symbol: '➗', color: 'bg-emerald-100 text-emerald-800' },
  time: { title: 'Bacaan Jam', symbol: '🕐', color: 'bg-purple-100 text-purple-800' },
};

export function ExamInstructionScreen({
  topic,
  level,
  studentName = 'Syifa',
  onStartExam,
  onBack,
}: ExamInstructionScreenProps) {
  const topicInfo = TOPIC_NAMES[topic] || {
    title: 'Matematik',
    symbol: '📝',
    color: 'bg-indigo-100 text-indigo-800',
  };

  return (
    <main
      id="exam-instruction-screen"
      className="min-h-screen w-full bg-gradient-to-b from-slate-50 via-indigo-50/20 to-slate-100 flex flex-col justify-between p-4 sm:p-6 md:p-8"
    >
      {/* Top Header */}
      <header className="w-full max-w-lg mx-auto flex items-center justify-between gap-3 pt-2">
        <button
          id="btn-back-from-exam-intro"
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all cursor-pointer"
        >
          <span>←</span>
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${topicInfo.color}`}>
            {topicInfo.symbol} {topicInfo.title} • Tahap {level}
          </span>
        </div>
      </header>

      {/* Main Card */}
      <div className="w-full max-w-lg mx-auto my-auto py-6 space-y-6">
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-6 text-center">
          {/* Badge Icon */}
          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center text-3xl shadow-2xs">
            📝
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-indigo-950 tracking-tight">
              UJIAN MATEMATIK
            </h1>
            <p className="text-sm font-semibold text-slate-500">
              Selamat menduduki ujian, <span className="text-indigo-600 font-bold">{studentName}</span>!
            </p>
          </div>

          {/* Instruction Points */}
          <div className="p-4 sm:p-5 bg-slate-50/90 rounded-2xl border border-slate-200 text-left space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Panduan Ujian:
            </h2>

            <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-slate-700">
              <li className="flex items-start gap-2.5">
                <span className="text-indigo-600 font-bold text-base leading-none">1.</span>
                <span><strong>10 soalan</strong> akan diberikan dalam sesi ini.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-indigo-600 font-bold text-base leading-none">2.</span>
                <span>Pilih <strong>satu jawapan</strong> bagi setiap soalan.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-indigo-600 font-bold text-base leading-none">3.</span>
                <span>Setiap soalan hanya boleh dijawab <strong>sekali sahaja</strong>.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-indigo-600 font-bold text-base leading-none">4.</span>
                <span>Jawapan <strong>tidak boleh diubah</strong> selepas dihantar.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-indigo-600 font-bold text-base leading-none">5.</span>
                <span>Keputusan penuh akan dipaparkan <strong>selepas semua 10 soalan selesai</strong>.</span>
              </li>
            </ul>
          </div>

          {/* Action Button */}
          <button
            id="btn-start-exam-now"
            type="button"
            onClick={onStartExam}
            className="btn-tactile-primary w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-lg sm:text-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            <span>📝</span>
            <span>MULA UJIAN</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-lg mx-auto text-center pb-2">
        <p className="text-xs font-semibold text-slate-400">
          Mod Ujian • Tiada Pembayang Semasa Ujian
        </p>
      </footer>
    </main>
  );
}
