interface AppTitleProps {
  className?: string;
}

export function AppTitle({ className = "" }: AppTitleProps) {
  return (
    <div id="app-title" className={`text-center select-none ${className}`}>
      {/* Decorative gentle math badge / tag */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-2.5 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs tracking-wider uppercase">
        <span>📐</span>
        <span>Matematik Sekolah Rendah</span>
      </div>

      <h1 className="flex flex-col items-center justify-center font-black tracking-tight leading-none">
        <span className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl text-slate-800 uppercase drop-shadow-xs">
          JOM BELAJAR
        </span>
        <span className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl text-indigo-600 uppercase mt-1 tracking-normal font-black drop-shadow-xs">
          MATEMATIK
        </span>
      </h1>
    </div>
  );
}
