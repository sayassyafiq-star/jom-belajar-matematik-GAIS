import { AppleItem } from './AppleItem';

interface GroupContainerProps {
  key?: string | number;
  groupIndex: number;
  itemsCount: number;
  itemEmoji?: string;
  isCompact?: boolean;
}

export function GroupContainer({
  groupIndex,
  itemsCount,
  isCompact = false,
}: GroupContainerProps) {
  // Determine grid layout inside group container based on items count
  const appleSize = itemsCount > 8 ? 'xs' : itemsCount > 4 ? 'sm' : 'md';

  return (
    <div
      id={`stimulus-group-box-${groupIndex}`}
      className="flex flex-col items-center justify-between bg-white rounded-2xl border-2 border-indigo-100/90 shadow-2xs p-2 sm:p-2.5 transition-all hover:border-indigo-200"
    >
      {/* Group Header Badge */}
      <div className="flex items-center justify-between w-full mb-1.5 px-0.5 border-b border-indigo-50/80 pb-1">
        <span className="text-[10px] sm:text-xs font-bold text-indigo-700 uppercase tracking-wider truncate">
          Kumpulan {groupIndex}
        </span>
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 font-extrabold text-[10px] sm:text-xs border border-indigo-200/70">
          {groupIndex}
        </span>
      </div>

      {/* Items Container */}
      <div
        className={`flex-1 flex flex-wrap items-center justify-center content-center gap-1 p-1 min-h-[48px] sm:min-h-[56px] w-full rounded-xl bg-indigo-50/30 ${
          isCompact ? 'max-w-[140px]' : 'max-w-[180px]'
        }`}
        aria-label={`${itemsCount} epal dalam Kumpulan ${groupIndex}`}
      >
        {Array.from({ length: itemsCount }).map((_, idx) => (
          <AppleItem
            key={`group-${groupIndex}-apple-${idx}`}
            size={appleSize === 'xs' ? 'sm' : appleSize}
            className="transition-transform duration-150 hover:scale-120"
          />
        ))}
      </div>
    </div>
  );
}
