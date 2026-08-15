const TOPICS = [
  { id: 'addition', label: 'Tambah', symbol: '➕', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'subtraction', label: 'Tolak', symbol: '➖', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  { id: 'multiplication', label: 'Darab', symbol: '✖️', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'division', label: 'Bahagi', symbol: '➗', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'time', label: 'Masa & Waktu', symbol: '⏰', color: 'bg-purple-50 text-purple-700 border-purple-200' },
];

interface TopicsPreviewProps {
  className?: string;
}

export function TopicsPreview({ className = "" }: TopicsPreviewProps) {
  return (
    <div id="topics-preview" className={`w-full max-w-md mx-auto ${className}`}>
      <p className="text-center text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
        5 Topik Pembelajaran
      </p>
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        {TOPICS.map((topic) => (
          <span
            key={topic.id}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-bold shadow-2xs ${topic.color}`}
          >
            <span aria-hidden="true">{topic.symbol}</span>
            <span>{topic.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
