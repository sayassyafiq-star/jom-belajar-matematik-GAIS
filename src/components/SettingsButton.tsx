interface SettingsButtonProps {
  onClick: () => void;
  className?: string;
}

export function SettingsButton({ onClick, className = "" }: SettingsButtonProps) {
  return (
    <button
      id="btn-settings"
      type="button"
      onClick={onClick}
      aria-label="Tetapan"
      title="Tetapan"
      className={`inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/90 border border-slate-200 shadow-xs hover:border-slate-300 hover:bg-slate-50 active:scale-95 transition-all text-xl cursor-pointer text-slate-700 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${className}`}
    >
      <span aria-hidden="true" className="transform transition-transform hover:rotate-45">
        ⚙️
      </span>
    </button>
  );
}
