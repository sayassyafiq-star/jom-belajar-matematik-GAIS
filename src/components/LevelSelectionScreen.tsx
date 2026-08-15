import { MathOperation } from '../types';

interface LevelSelectionScreenProps {
  topic: MathOperation;
  onSelectLevel: (level: number) => void;
  onBack: () => void;
}

interface LevelOption {
  level: number;
  stars: string;
  title: string;
  description: string;
  badge: string;
  isActive: boolean;
}

const LEVELS: LevelOption[] = [
  {
    level: 1,
    stars: '⭐',
    title: 'Tahap 1',
    description: 'Operan asas nombor 1 hingga 10 & jam tepat',
    badge: 'Dibuka ✨',
    isActive: true,
  },
  {
    level: 2,
    stars: '⭐⭐',
    title: 'Tahap 2',
    description: 'Operan nombor sehingga 50 & minit :30',
    badge: 'Dibuka ✨',
    isActive: true,
  },
  {
    level: 3,
    stars: '⭐⭐⭐',
    title: 'Tahap 3',
    description: 'Operan nombor sehingga 100',
    badge: 'Akan Datang',
    isActive: false,
  },
  {
    level: 4,
    stars: '⭐⭐⭐⭐',
    title: 'Tahap 4',
    description: 'Operan nombor sehingga 500',
    badge: 'Akan Datang',
    isActive: false,
  },
  {
    level: 5,
    stars: '⭐⭐⭐⭐⭐',
    title: 'Tahap 5',
    description: 'Cabaran nombor sehingga 1000',
    badge: 'Akan Datang',
    isActive: false,
  },
];

export function LevelSelectionScreen({
  topic = 'addition',
  onSelectLevel,
  onBack,
}: LevelSelectionScreenProps) {
  const getTopicLabel = (op: MathOperation) => {
    switch (op) {
      case 'addition':
        return 'Tambah (+)';
      case 'subtraction':
        return 'Tolak (−)';
      case 'multiplication':
        return 'Darab (×)';
      case 'division':
        return 'Bahagi (÷)';
      case 'time':
        return 'Bacaan Jam (🕐)';
      default:
        return 'Matematik';
    }
  };

  return (
    <main
      id="level-selection-screen"
      className="relative min-h-screen w-full bg-gradient-to-b from-slate-50 via-indigo-50/20 to-slate-100 flex flex-col justify-between p-4 sm:p-6 md:p-8 overflow-x-hidden"
    >
      {/* Header Bar */}
      <header className="relative z-10 w-full max-w-lg mx-auto flex items-center justify-between gap-3 pt-2">
        <button
          id="btn-level-back"
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm cursor-pointer transition-all active:scale-95"
        >
          <span>←</span>
          <span>Kembali</span>
        </button>

        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-extrabold text-xs sm:text-sm">
          <span>🎯</span>
          <span>{getTopicLabel(topic)}</span>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-center justify-center my-auto py-6 space-y-5">
        <div className="text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            Pilih Tahap (Level)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Latihan berfokus mengikut aras penguasaan murid.
          </p>
        </div>

        <div className="w-full space-y-3">
          {LEVELS.map((item) => (
            <button
              key={item.level}
              id={`level-card-${item.level}`}
              type="button"
              disabled={!item.isActive}
              onClick={() => item.isActive && onSelectLevel(item.level)}
              className={`w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border-2 transition-all text-left select-none ${
                item.isActive
                  ? 'border-indigo-300 bg-white hover:bg-indigo-50/40 shadow-xs hover:shadow-md active:scale-98 cursor-pointer ring-2 ring-transparent hover:ring-indigo-300'
                  : 'border-slate-200 bg-slate-50/80 opacity-70 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-lg sm:text-xl shadow-xs ${
                    item.isActive ? 'bg-indigo-600 text-white' : 'bg-slate-300 text-slate-600'
                  }`}
                >
                  <span className="font-black">T{item.level}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-black text-slate-800">
                      {item.title}
                    </span>
                    <span className="text-xs">{item.stars}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {item.description}
                  </p>
                </div>
              </div>

              <div>
                {item.isActive ? (
                  <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-extrabold">
                    {item.badge} →
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-500 text-[10px] font-extrabold tracking-wider uppercase">
                    Akan Datang
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer Note */}
      <footer className="relative z-10 w-full max-w-lg mx-auto text-center pb-2">
        <p className="text-xs font-semibold text-slate-400">
          Tahap 1 & Tahap 2 mengandungi 10 soalan interaktif dengan rangsangan visual.
        </p>
      </footer>
    </main>
  );
}
