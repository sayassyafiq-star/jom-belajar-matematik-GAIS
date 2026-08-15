import { ActionType } from '../types';

interface HomeActionsProps {
  onActionClick: (action: ActionType) => void;
  className?: string;
}

export function HomeActions({ onActionClick, className = "" }: HomeActionsProps) {
  return (
    <div className={`w-full max-w-md mx-auto flex flex-col gap-3 sm:gap-3.5 ${className}`}>
      {/* Primary Action Button: MULA BELAJAR (Training Mode) */}
      <button
        id="btn-mula-belajar"
        type="button"
        onClick={() => onActionClick('start')}
        className="btn-tactile-primary relative w-full flex items-center justify-center gap-3.5 px-6 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-lg sm:text-xl cursor-pointer select-none focus:outline-hidden focus-visible:ring-4 focus-visible:ring-indigo-300 active:bg-indigo-800 shadow-sm"
      >
        <span className="text-2xl sm:text-3xl" aria-hidden="true">
          🎮
        </span>
        <span className="tracking-wide">MULA BELAJAR</span>
      </button>

      {/* Primary Action Button: MULA UJIAN (Exam Mode) */}
      <button
        id="btn-mula-ujian"
        type="button"
        onClick={() => onActionClick('exam')}
        className="btn-tactile-primary relative w-full flex items-center justify-center gap-3.5 px-6 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-lg sm:text-xl cursor-pointer select-none focus:outline-hidden focus-visible:ring-4 focus-visible:ring-purple-300 shadow-sm"
      >
        <span className="text-2xl sm:text-3xl" aria-hidden="true">
          📝
        </span>
        <span className="tracking-wide">MULA UJIAN</span>
      </button>

      {/* Secondary Actions Grid */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {/* Performance / History Button */}
        <button
          id="btn-prestasi"
          type="button"
          onClick={() => onActionClick('performance')}
          className="btn-tactile-secondary flex flex-col sm:flex-row items-center justify-center gap-2 px-3 py-3 rounded-2xl bg-white border-2 border-amber-100 hover:border-amber-300 hover:bg-amber-50/50 text-amber-900 font-bold text-sm sm:text-base cursor-pointer select-none focus:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <span className="text-xl sm:text-2xl" aria-hidden="true">
            📊
          </span>
          <span className="tracking-tight whitespace-nowrap">REKOD</span>
        </button>

        {/* Math Lab Button */}
        <button
          id="btn-math-lab"
          type="button"
          onClick={() => onActionClick('math_lab')}
          className="btn-tactile-secondary flex flex-col sm:flex-row items-center justify-center gap-2 px-3 py-3 rounded-2xl bg-white border-2 border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50/50 text-emerald-900 font-bold text-sm sm:text-base cursor-pointer select-none focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
          <span className="text-xl sm:text-2xl" aria-hidden="true">
            🧪
          </span>
          <span className="tracking-tight whitespace-nowrap">MATH LAB</span>
        </button>
      </div>
    </div>
  );
}

