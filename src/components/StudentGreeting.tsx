interface StudentGreetingProps {
  name?: string;
  className?: string;
}

export function StudentGreeting({ name = "Syifa", className = "" }: StudentGreetingProps) {
  return (
    <div
      id="student-greeting"
      className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/90 border border-amber-200/80 shadow-xs backdrop-blur-xs text-amber-900 font-semibold text-base sm:text-lg ${className}`}
    >
      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-600 text-sm">
        🌟
      </span>
      <span className="tracking-tight">
        Hai, <span className="text-amber-800 font-bold">{name}</span>! 👋
      </span>
    </div>
  );
}
