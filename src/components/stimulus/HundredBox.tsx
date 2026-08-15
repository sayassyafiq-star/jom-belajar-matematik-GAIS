interface HundredBoxProps {
  className?: string;
}

export function HundredBox({ className = '' }: HundredBoxProps) {
  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center select-none w-20 sm:w-24 md:w-28 p-2 rounded-2xl bg-gradient-to-b from-amber-100 via-amber-200 to-amber-300 border-2 border-amber-600 shadow-xs ${className}`}
      role="img"
      aria-label="Kotak berisi 100 epal"
      title="1 Kotak = 100 Epal"
    >
      {/* Box lid/accents */}
      <div className="flex items-center gap-1 -mt-1 mb-1">
        <span className="text-xs">🍎</span>
        <span className="text-xs font-bold text-amber-900/80">KOTAK EPAL</span>
      </div>

      {/* Prominent "100" Badge */}
      <div className="px-2.5 py-1 rounded-xl bg-amber-900 text-amber-50 font-black text-sm sm:text-base tracking-wider shadow-inner border border-amber-950">
        100
      </div>

      <span className="text-[10px] sm:text-[11px] font-extrabold text-amber-900 mt-1">
        100 Epal
      </span>
    </div>
  );
}
