import { getQuantityRepresentation } from '../../utils/stimulusMath';
import { AppleItem } from './AppleItem';
import { BasketItem } from './BasketItem';
import { HundredBox } from './HundredBox';

interface QuantityGroupRendererProps {
  value: number;
  label?: string;
  className?: string;
}

export function QuantityGroupRenderer({
  value,
  label,
  className = '',
}: QuantityGroupRendererProps) {
  const representation = getQuantityRepresentation(value);

  // Case 1: Values > 100 (numeric only placeholder)
  if (representation.mode === 'numeric_only') {
    return (
      <div className={`flex flex-col items-center justify-center p-3 text-center ${className}`}>
        <div className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-extrabold text-lg">
          {value}
        </div>
        <span className="text-[10px] text-slate-500 font-medium mt-1">
          (Format Numerik)
        </span>
      </div>
    );
  }

  // Case 2: Exactly 100 (1 hundred box)
  if (representation.hundreds === 1) {
    return (
      <div className={`flex flex-col items-center justify-center py-1 ${className}`}>
        <HundredBox />
      </div>
    );
  }

  // Case 3: 0 (Empty)
  if (representation.baskets === 0 && representation.ones === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-2 ${className}`}>
        <span className="text-xs font-semibold text-slate-400 italic">0 epal (kosong)</span>
      </div>
    );
  }

  // Case 4: 1 to 99 (Baskets of 10 + Individual Ones)
  const isCompact = representation.baskets >= 4 || (representation.baskets >= 2 && representation.ones >= 5);

  return (
    <div className={`flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 py-1 ${className}`}>
      {/* Baskets (Groups of 10) */}
      {representation.baskets > 0 && (
        <div
          className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 max-w-[200px]"
          aria-label={`${representation.baskets} bakul (setiap satu 10 epal)`}
        >
          {Array.from({ length: representation.baskets }).map((_, idx) => (
            <BasketItem key={`basket-${idx}`} size={isCompact ? 'sm' : 'md'} />
          ))}
        </div>
      )}

      {/* Visual separator dot between baskets and loose ones if both exist */}
      {representation.baskets > 0 && representation.ones > 0 && (
        <div className="w-1 h-1 rounded-full bg-slate-300 self-center hidden xs:block" aria-hidden="true" />
      )}

      {/* Individual Ones (Apples) */}
      {representation.ones > 0 && (
        <div
          className="flex flex-wrap items-center justify-center gap-0.5 sm:gap-1 max-w-[120px]"
          aria-label={`${representation.ones} epal tunggal`}
        >
          {Array.from({ length: representation.ones }).map((_, idx) => (
            <AppleItem key={`apple-${idx}`} size={isCompact ? 'sm' : 'md'} />
          ))}
        </div>
      )}
    </div>
  );
}
