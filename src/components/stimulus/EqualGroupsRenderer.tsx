import { GroupContainer } from './GroupContainer';

interface EqualGroupsRendererProps {
  operation: 'multiplication' | 'division';
  numberOfGroups: number;
  itemsPerGroup: number;
  prompt?: string;
  className?: string;
}

export function EqualGroupsRenderer({
  operation,
  numberOfGroups,
  itemsPerGroup,
  prompt,
  className = '',
}: EqualGroupsRendererProps) {
  // Safety checks
  const safeGroups = Math.max(1, Math.min(numberOfGroups, 20));
  const safeItems = Math.max(1, Math.min(itemsPerGroup, 20));

  // Determine container grid column configuration
  const getGridClass = (count: number) => {
    if (count === 1) return 'grid-cols-1 max-w-xs';
    if (count === 2) return 'grid-cols-2 max-w-md';
    if (count === 3) return 'grid-cols-3 max-w-lg';
    if (count === 4) return 'grid-cols-2 sm:grid-cols-4 max-w-lg';
    if (count <= 6) return 'grid-cols-2 sm:grid-cols-3 max-w-lg';
    if (count <= 8) return 'grid-cols-2 sm:grid-cols-4 max-w-lg';
    return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5 max-w-lg';
  };

  const isCompact = safeGroups >= 6 || safeItems > 6;

  return (
    <div
      id="equal-groups-stimulus"
      className={`w-full max-w-lg mx-auto flex flex-col items-center gap-3 ${className}`}
    >
      {/* Subheader / Educational Concept Badge */}
      <div className="flex items-center justify-between w-full px-1">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 font-extrabold text-[11px] sm:text-xs">
          <span>{operation === 'multiplication' ? '✖️' : '➗'}</span>
          <span>
            {operation === 'multiplication'
              ? `${safeGroups} Kumpulan Sama Banyak`
              : `Kongsi Sama Rata (${safeGroups} Kumpulan)`}
          </span>
        </span>

        {operation === 'multiplication' ? (
          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
            {safeItems} epal / kumpulan
          </span>
        ) : (
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            Setiap kumpulan sama banyak
          </span>
        )}
      </div>

      {/* Grid of Equal Group Containers */}
      <div className={`grid ${getGridClass(safeGroups)} gap-2.5 sm:gap-3 w-full place-items-stretch`}>
        {Array.from({ length: safeGroups }).map((_, index) => (
          <GroupContainer
            key={`equal-group-${index + 1}`}
            groupIndex={index + 1}
            itemsCount={safeItems}
            isCompact={isCompact}
          />
        ))}
      </div>

      {/* Clear Expression Below the Visual (Without revealing answer) */}
      {prompt && (
        <div className="mt-0.5 inline-flex items-center gap-2 px-3.5 py-1 rounded-xl bg-slate-100/90 border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm">
          <span>Soalan:</span>
          <span className="font-black text-indigo-700 font-mono tracking-tight">{prompt}</span>
        </div>
      )}
    </div>
  );
}
