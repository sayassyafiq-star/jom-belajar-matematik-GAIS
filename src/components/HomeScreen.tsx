import { useState } from 'react';
import { AppTitle } from './AppTitle';
import { StudentGreeting } from './StudentGreeting';
import { HomeActions } from './HomeActions';
import { SettingsButton } from './SettingsButton';
import { TopicsPreview } from './TopicsPreview';
import { ActionFeedbackModal } from './ActionFeedbackModal';
import { ActionType, ActionFeedback } from '../types';

interface HomeScreenProps {
  studentName?: string;
  onStartLearning?: () => void;
  onStartExam?: () => void;
  onViewHistory?: () => void;
  onOpenSettings?: () => void;
  onOpenCardDemo?: () => void;
}

export function HomeScreen({
  studentName = "Syifa",
  onStartLearning,
  onStartExam,
  onViewHistory,
  onOpenSettings,
  onOpenCardDemo,
}: HomeScreenProps) {
  const [activeFeedback, setActiveFeedback] = useState<ActionFeedback | null>(null);

  const handleAction = (action: ActionType) => {
    console.log(`[Jom Belajar Matematik] Action triggered: ${action}`);

    // If start learning is clicked
    if (action === 'start' && onStartLearning) {
      onStartLearning();
      return;
    }

    // If start exam is clicked
    if (action === 'exam' && onStartExam) {
      onStartExam();
      return;
    }

    // If performance / exam history is clicked
    if (action === 'performance' && onViewHistory) {
      onViewHistory();
      return;
    }

    // If settings button is clicked
    if (action === 'settings' && onOpenSettings) {
      onOpenSettings();
      return;
    }

    // If math_lab action is clicked, launch Math Lab / Engine Test Bench
    if (action === 'math_lab' && onOpenCardDemo) {
      onOpenCardDemo();
      return;
    }

    // Fallback feedback for unhandled actions
    switch (action) {
      case 'start':
        setActiveFeedback({
          type: 'start',
          title: 'Mula Belajar 🎮',
          message: 'Modul pembelajaran interaktif dibuka.',
        });
        break;
      case 'exam':
        setActiveFeedback({
          type: 'exam',
          title: 'Mula Ujian 📝',
          message: 'Sistem ujian matematik dibuka.',
        });
        break;
      case 'math_lab':
        setActiveFeedback({
          type: 'math_lab',
          title: 'Math Lab 🧪',
          message: 'Ruang penjana latihan tersuai dan eksperimen matematik.',
        });
        break;
      case 'performance':
        setActiveFeedback({
          type: 'performance',
          title: 'Prestasi & Rekod 📊',
          message: 'Sejarah dan rekod ujian anda.',
        });
        break;
      case 'settings':
        setActiveFeedback({
          type: 'settings',
          title: 'Tetapan Aplikasi ⚙️',
          message: 'Pilihan profil pelajar dan pengurusan data.',
        });
        break;
    }
  };


  return (
    <main
      id="home-screen"
      className="relative min-h-screen w-full bg-gradient-to-b from-slate-50 via-indigo-50/30 to-slate-100 flex flex-col justify-between p-4 sm:p-6 md:p-8 overflow-x-hidden"
    >
      {/* Background Decorative Ambient Math Symbols */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-20" aria-hidden="true">
        <span className="absolute top-12 left-6 text-4xl text-indigo-400 font-black">+</span>
        <span className="absolute top-28 right-10 text-3xl text-amber-400 font-black">×</span>
        <span className="absolute bottom-32 left-10 text-4xl text-emerald-400 font-black">÷</span>
        <span className="absolute bottom-20 right-8 text-4xl text-rose-400 font-black">−</span>
        <span className="absolute top-1/2 left-4 text-3xl text-purple-400 font-black">=</span>
        <span className="absolute top-1/3 right-5 text-2xl text-blue-400 font-black">%</span>
      </div>

      {/* Top Bar: Student Greeting & Settings */}
      <header className="relative z-10 w-full max-w-lg mx-auto flex items-center justify-between gap-3 pt-2">
        <StudentGreeting name={studentName} />
        <SettingsButton onClick={() => handleAction('settings')} />
      </header>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-center justify-center my-auto py-6 sm:py-8 gap-8 sm:gap-10">
        {/* App Title */}
        <AppTitle />

        {/* Action Buttons: Mula Belajar, Math Lab, Prestasi */}
        <HomeActions onActionClick={handleAction} />

        {/* 5 Math Topics Preview */}
        <TopicsPreview />
      </div>

      {/* Footer / Info note */}
      <footer className="relative z-10 w-full max-w-lg mx-auto text-center pb-2 flex flex-col items-center gap-2">
        <p className="text-xs font-semibold text-slate-400 tracking-wide">
          Aplikasi Matematik Mesra Kanak-kanak • Luar Talian (PWA)
        </p>

        {onOpenCardDemo && (
          <button
            id="btn-open-jom-card-demo"
            type="button"
            onClick={onOpenCardDemo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 border border-slate-200 shadow-2xs hover:border-indigo-300 hover:text-indigo-600 text-slate-500 font-bold text-xs transition-all cursor-pointer"
          >
            <span>🃏</span>
            <span>Uji "Jom Card" & Question Engine Lab</span>
          </button>
        )}
      </footer>

      {/* Feedback modal for button clicks */}
      <ActionFeedbackModal
        feedback={activeFeedback}
        onClose={() => setActiveFeedback(null)}
      />
    </main>
  );
}
