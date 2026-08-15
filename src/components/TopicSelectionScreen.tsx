import { MathOperation } from '../types';

interface TopicSelectionScreenProps {
  onSelectTopic: (topic: MathOperation) => void;
  onBack: () => void;
}

interface TopicOption {
  id: MathOperation;
  title: string;
  symbol: string;
  description: string;
  isActive: boolean;
  colorClass: string;
  borderClass: string;
}

const TOPICS: TopicOption[] = [
  {
    id: 'addition',
    title: 'Tambah',
    symbol: '➕',
    description: 'Operasi menggabungkan kuantiti dan nombor',
    isActive: true,
    colorClass: 'bg-blue-500 text-white',
    borderClass: 'border-blue-200 hover:border-blue-400 bg-white hover:bg-blue-50/40',
  },
  {
    id: 'subtraction',
    title: 'Tolak',
    symbol: '➖',
    description: 'Operasi mencari beza dan mengeluarkan kuantiti',
    isActive: true,
    colorClass: 'bg-rose-500 text-white',
    borderClass: 'border-rose-200 hover:border-rose-400 bg-white hover:bg-rose-50/40',
  },
  {
    id: 'multiplication',
    title: 'Darab',
    symbol: '✖️',
    description: 'Kumpulan sama banyak berulang',
    isActive: true,
    colorClass: 'bg-amber-500 text-white',
    borderClass: 'border-amber-200 hover:border-amber-400 bg-white hover:bg-amber-50/40',
  },
  {
    id: 'division',
    title: 'Bahagi',
    symbol: '➗',
    description: 'Perkongsian sama rata kuantiti',
    isActive: true,
    colorClass: 'bg-emerald-500 text-white',
    borderClass: 'border-emerald-200 hover:border-emerald-400 bg-white hover:bg-emerald-50/40',
  },
  {
    id: 'time',
    title: 'Bacaan Jam',
    symbol: '🕐',
    description: 'Masa, waktu dan jam tepat analog',
    isActive: true,
    colorClass: 'bg-purple-500 text-white',
    borderClass: 'border-purple-200 hover:border-purple-400 bg-white hover:bg-purple-50/40',
  },
];

export function TopicSelectionScreen({
  onSelectTopic,
  onBack,
}: TopicSelectionScreenProps) {
  return (
    <main
      id="topic-selection-screen"
      className="relative min-h-screen w-full bg-gradient-to-b from-slate-50 via-indigo-50/20 to-slate-100 flex flex-col justify-between p-4 sm:p-6 md:p-8 overflow-x-hidden"
    >
      {/* Header Bar */}
      <header className="relative z-10 w-full max-w-lg mx-auto flex items-center justify-between gap-3 pt-2">
        <button
          id="btn-topic-back"
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm cursor-pointer transition-all active:scale-95"
        >
          <span>←</span>
          <span>Kembali</span>
        </button>

        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-extrabold text-xs sm:text-sm">
          <span>📚</span>
          <span>Pilih Topik</span>
        </div>
      </header>

      {/* Main Topic List */}
      <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-center justify-center my-auto py-6 space-y-5">
        <div className="text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            Pilih Topik Pembelajaran
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Pilih topik untuk memulakan latihan matematik interaktif.
          </p>
        </div>

        <div className="w-full space-y-3">
          {TOPICS.map((topic) => (
            <button
              key={topic.id}
              id={`topic-card-${topic.id}`}
              type="button"
              disabled={!topic.isActive}
              onClick={() => topic.isActive && onSelectTopic(topic.id)}
              className={`w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border-2 transition-all text-left select-none ${
                topic.borderClass
              } ${
                topic.isActive
                  ? 'shadow-xs hover:shadow-md active:scale-98 cursor-pointer ring-2 ring-transparent hover:ring-indigo-300'
                  : 'cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl shadow-xs ${topic.colorClass}`}
                >
                  <span aria-hidden="true">{topic.symbol}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-black text-slate-800">
                      {topic.title}
                    </span>
                    {topic.isActive && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                        Dibuka ✨
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {topic.description}
                  </p>
                </div>
              </div>

              <div>
                {topic.isActive ? (
                  <span className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                    →
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
          Modul Tambah, Tolak, Darab, Bahagi & Bacaan Jam dibuka sepenuhnya untuk Tahap 1 (10 Soalan).
        </p>
      </footer>
    </main>
  );
}
