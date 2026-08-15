import { MathOperation } from '../types';

interface ResultScreenProps {
  studentName?: string;
  topic?: MathOperation;
  level?: number;
  score: number;
  totalQuestions: number;
  onPlayAgain: () => void;
  onHome: () => void;
}

export function ResultScreen({
  studentName = 'Syifa',
  topic = 'addition',
  level = 1,
  score = 10,
  totalQuestions = 10,
  onPlayAgain,
  onHome,
}: ResultScreenProps) {
  const getTopicName = (op: MathOperation) => {
    switch (op) {
      case 'addition':
        return 'Tambah';
      case 'subtraction':
        return 'Tolak';
      case 'multiplication':
        return 'Darab';
      case 'division':
        return 'Bahagi';
      case 'time':
        return 'Bacaan Jam';
      default:
        return 'Matematik';
    }
  };

  // Score-based encouraging message logic
  const getFeedbackMessage = (currentScore: number, total: number) => {
    if (currentScore === total) {
      return {
        heading: `Hebat, ${studentName}! Semua betul! 🎉`,
        sub: `Tahniah! Anda telah menguasai latihan ${getTopicName(topic)} Tahap ${level}.`,
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        badgeText: 'Skor Sempurna! ⭐⭐⭐',
      };
    }
    if (currentScore >= 8) {
      return {
        heading: `Sangat bagus, ${studentName}! Teruskan! ⭐`,
        sub: `Pencapaian yang sangat membanggakan dalam ${getTopicName(topic)} Tahap ${level}.`,
        badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        badgeText: 'Cemerlang! ⭐⭐',
      };
    }
    if (currentScore >= 5) {
      return {
        heading: `Bagus, ${studentName}! Teruskan berlatih! 💪`,
        sub: `Usaha yang mantap! Mari teruskan latihan untuk menjadi lebih pantas.`,
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
        badgeText: 'Usaha Baik! ⭐',
      };
    }
    if (currentScore >= 1) {
      return {
        heading: `${studentName}, anda sudah mencuba dengan baik. Jom cuba lagi! 🌟`,
        sub: `Setiap cubaan menjadikan anda lebih pintar dalam matematik.`,
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
        badgeText: 'Teruskan Usaha! 🌟',
      };
    }
    return {
      heading: `Tak mengapa, ${studentName}. Mari kita cuba lagi bersama! 💪`,
      sub: `Jangan putus asa! Belajar matematik memerlukan latihan berulang kali.`,
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
      badgeText: 'Cuba Lagi! 💪',
    };
  };

  const feedback = getFeedbackMessage(score, totalQuestions);

  return (
    <main
      id="result-screen"
      className="relative min-h-screen w-full bg-gradient-to-b from-slate-50 via-indigo-50/30 to-slate-100 flex flex-col justify-between p-4 sm:p-6 md:p-8 overflow-x-hidden"
    >
      {/* Background Decorative Symbols */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-20" aria-hidden="true">
        <span className="absolute top-10 left-8 text-4xl text-amber-400 font-black">⭐</span>
        <span className="absolute top-24 right-10 text-3xl text-indigo-400 font-black">🎉</span>
        <span className="absolute bottom-24 left-10 text-4xl text-emerald-400 font-black">✨</span>
        <span className="absolute bottom-16 right-12 text-4xl text-rose-400 font-black">🍎</span>
      </div>

      {/* Header bar */}
      <header className="w-full max-w-lg mx-auto pt-2 flex justify-center">
        <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-extrabold text-xs sm:text-sm shadow-2xs">
          <span aria-hidden="true">✨</span>
          <span>Sesi Pembelajaran Selesai</span>
        </span>
      </header>

      {/* Main Result Card */}
      <div className="relative z-10 w-full max-w-md mx-auto my-auto py-5">
        <div
          id="result-card"
          className="bg-white rounded-3xl sm:rounded-4xl border-2 border-indigo-100 shadow-lg p-6 sm:p-8 flex flex-col items-center text-center space-y-5 animate-question-enter"
        >
          {/* Trophy / Celebration Icon */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-4xl sm:text-5xl shadow-xs animate-card-pop">
            🎉
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-1">
            <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">
              {getTopicName(topic)} • Tahap {level}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
              SELESAI!
            </h1>
            <p className="text-base sm:text-lg font-black text-indigo-700 pt-1">
              {feedback.heading}
            </p>
            <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xs mx-auto">
              {feedback.sub}
            </p>
          </div>

          {/* Score Box */}
          <div
            id="result-score-box"
            className="w-full py-4 px-6 rounded-2xl bg-indigo-50/70 border-2 border-indigo-100/80 flex flex-col items-center justify-center gap-1"
          >
            <span className="text-xs font-black uppercase tracking-wider text-indigo-500">
              SKOR ANDA
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl sm:text-5xl font-black text-indigo-900 tracking-tight">
                {score}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-indigo-400">
                / {totalQuestions}
              </span>
            </div>

            <span className={`text-xs font-black px-3 py-0.5 rounded-full border mt-1.5 ${feedback.badgeColor}`}>
              {feedback.badgeText}
            </span>
          </div>

          {/* Motivating Breakdown Summary Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 w-full pt-1">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <span>⭐</span>
              <span>{score} betul</span>
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold">
              <span>📚</span>
              <span>{totalQuestions} soalan</span>
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
              <span>💪</span>
              <span>Teruskan berlatih!</span>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col gap-3 pt-2">
            <button
              id="btn-play-again"
              type="button"
              onClick={onPlayAgain}
              className="btn-tactile-primary w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-black text-base sm:text-lg shadow-md cursor-pointer flex items-center justify-center gap-2 select-none focus:outline-hidden focus-visible:ring-4 focus-visible:ring-indigo-300"
            >
              <span aria-hidden="true">🔄</span>
              <span>MAIN LAGI</span>
            </button>

            <button
              id="btn-result-home"
              type="button"
              onClick={onHome}
              className="btn-tactile-secondary w-full py-3 sm:py-3.5 px-6 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm sm:text-base border-2 border-slate-200 shadow-2xs hover:border-slate-300 transition-all cursor-pointer flex items-center justify-center gap-2 select-none focus:outline-hidden focus-visible:ring-2 focus-visible:ring-slate-300"
            >
              <span aria-hidden="true">🏠</span>
              <span>KEMBALI KE LAMAN UTAMA</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-lg mx-auto text-center pb-2">
        <p className="text-xs font-semibold text-slate-400">
          Jom Belajar Matematik • Pembelajaran Berterusan
        </p>
      </footer>
    </main>
  );
}
