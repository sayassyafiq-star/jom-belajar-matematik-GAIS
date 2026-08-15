import { AppleItem } from './AppleItem';
import { BasketItem } from './BasketItem';
import { QuantityGroupRenderer } from './QuantityGroupRenderer';

interface SubtractionRendererProps {
  operandA: number; // Starting quantity
  operandB: number; // Quantity removed
  level?: number;
  prompt?: string;
  className?: string;
}

export interface SubtractionLevel2Breakdown {
  totalA: number;
  totalB: number;
  isIndividualOnly: boolean;
  totalApples: number;
  normalApples: number;
  crossedApples: number;
  normalBaskets: number;
  crossedBaskets: number;
  normalLooseApples: number;
  crossedLooseApples: number;
  regrouped: boolean;
}

/**
 * Computes deterministic Base-10 decomposition for Level 2 subtraction.
 * Guarantees total rendered objects = totalA, crossed objects = totalB, unmarked objects = totalA - totalB.
 */
export function getSubtractionLevel2Breakdown(a: number, b: number): SubtractionLevel2Breakdown {
  const totalA = Math.max(0, Math.floor(a));
  const totalB = Math.max(0, Math.min(Math.floor(b), totalA));

  if (totalA < 20) {
    return {
      totalA,
      totalB,
      isIndividualOnly: true,
      totalApples: totalA,
      normalApples: totalA - totalB,
      crossedApples: totalB,
      normalBaskets: 0,
      crossedBaskets: 0,
      normalLooseApples: 0,
      crossedLooseApples: 0,
      regrouped: false,
    };
  }

  const aTens = Math.floor(totalA / 10);
  const aOnes = totalA % 10;
  const bTens = Math.floor(totalB / 10);
  const bOnes = totalB % 10;

  if (aOnes >= bOnes) {
    return {
      totalA,
      totalB,
      isIndividualOnly: false,
      totalApples: totalA,
      normalApples: 0,
      crossedApples: 0,
      normalBaskets: aTens - bTens,
      crossedBaskets: bTens,
      normalLooseApples: aOnes - bOnes,
      crossedLooseApples: bOnes,
      regrouped: false,
    };
  } else {
    // Regrouping: 1 ten basket is opened into 10 loose apples
    return {
      totalA,
      totalB,
      isIndividualOnly: false,
      totalApples: totalA,
      normalApples: 0,
      crossedApples: 0,
      normalBaskets: Math.max(0, aTens - 1 - bTens),
      crossedBaskets: bTens,
      normalLooseApples: (aOnes + 10) - bOnes,
      crossedLooseApples: bOnes,
      regrouped: true,
    };
  }
}

export function SubtractionRenderer({
  operandA,
  operandB,
  level,
  prompt,
  className = '',
}: SubtractionRendererProps) {
  // Safety checks
  const safeA = Math.max(0, operandA);
  const safeB = Math.max(0, Math.min(operandB, safeA));
  const remainingCount = safeA - safeB;

  // Level routing: Level 2 uses the single-group crossed-out visual
  const isLevel2 = level === 2;

  // Level 1 single-group inline visual for A <= 10
  const isSingleGroupModeLevel1 = safeA <= 10;

  // Level 2 decomposition breakdown
  const breakdownL2 = getSubtractionLevel2Breakdown(safeA, safeB);

  return (
    <div
      id="subtraction-stimulus"
      className={`w-full max-w-lg mx-auto flex flex-col items-center gap-3 ${className}`}
    >
      {/* Educational Concept Header */}
      <div className="flex items-center justify-between w-full px-1">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-extrabold text-[11px] sm:text-xs">
          <span>➖</span>
          <span>Operasi Tolak (Ambil Keluar)</span>
        </span>

        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
          Asal: {safeA} | Tolak: {safeB}
        </span>
      </div>

      {/* Main Subtraction Visual Display */}
      {isLevel2 ? (
        /* ========================================================================= */
        /* LEVEL 2: SINGLE-GROUP VISUAL (A Objects with B Objects Crossed Out)        */
        /* ========================================================================= */
        <div
          id="subtraction-level2-single-frame"
          className="w-full bg-rose-50/30 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border-2 border-rose-100/90 flex flex-col items-center gap-3 shadow-2xs"
        >
          {/* Inner Container Header (Without revealing the remaining count) */}
          <div className="flex items-center justify-between w-full border-b border-rose-100/80 pb-2 px-1">
            <span className="text-xs sm:text-sm font-extrabold text-slate-700 uppercase tracking-wider">
              Jumlah Asal: <span className="text-indigo-700 font-black">{safeA} Epal</span>
            </span>
            {safeB > 0 && (
              <span className="text-[11px] sm:text-xs font-black text-rose-700 bg-rose-100/90 px-2.5 py-0.5 rounded-full border border-rose-200 shadow-2xs">
                − {safeB} Ditolak
              </span>
            )}
          </div>

          {/* Content: 10-19 Range (Direct Apples) vs 20-50 Range (Base-10 Baskets + Apples) */}
          {breakdownL2.isIndividualOnly ? (
            /* 10-19 Range: Single group containing safeA individual apples, with safeB crossed out */
            <div
              className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 py-2 min-h-[72px] w-full"
              aria-label={`${safeA} epal asal, ${safeB} epal ditolak`}
            >
              {/* Normal, uncrossed apples */}
              {Array.from({ length: breakdownL2.normalApples }).map((_, idx) => (
                <div
                  key={`l2-norm-apple-${idx}`}
                  className="relative p-1 rounded-xl bg-white border border-slate-200/80 shadow-2xs transition-transform hover:scale-110"
                  title="Epal yang tinggal"
                >
                  <AppleItem size={safeA > 15 ? 'sm' : 'md'} />
                </div>
              ))}

              {/* Visual separator if both normal and crossed apples exist */}
              {breakdownL2.normalApples > 0 && breakdownL2.crossedApples > 0 && (
                <div className="h-8 w-px bg-rose-200 mx-0.5 self-center" aria-hidden="true" />
              )}

              {/* Crossed-out deducted apples */}
              {Array.from({ length: breakdownL2.crossedApples }).map((_, idx) => (
                <div
                  key={`l2-cross-apple-${idx}`}
                  className="relative p-1 rounded-xl bg-rose-50/70 border border-dashed border-rose-300 opacity-50 transition-opacity hover:opacity-80"
                  title="Epal ditolak"
                >
                  <AppleItem size={safeA > 15 ? 'sm' : 'md'} />
                  {/* Soft diagonal strike-through */}
                  <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    aria-hidden="true"
                  >
                    <div className="w-full h-0.5 sm:h-1 bg-rose-600 rounded-full rotate-45 transform scale-90" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* 20-50 Range: Base-10 baskets and loose apples within one unified container */
            <div
              className="flex flex-col items-center justify-center gap-3 w-full py-1"
              aria-label={`${safeA} objek asal, ${safeB} objek ditolak`}
            >
              {/* Tens Baskets Area */}
              {(breakdownL2.normalBaskets > 0 || breakdownL2.crossedBaskets > 0) && (
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full">
                  {/* Normal Baskets */}
                  {Array.from({ length: breakdownL2.normalBaskets }).map((_, idx) => (
                    <div
                      key={`l2-norm-basket-${idx}`}
                      className="relative p-1 rounded-2xl bg-white border border-slate-200/80 shadow-2xs transition-transform hover:scale-105"
                      title="1 Bakul = 10 Epal"
                    >
                      <BasketItem size="md" />
                    </div>
                  ))}

                  {/* Crossed Baskets */}
                  {Array.from({ length: breakdownL2.crossedBaskets }).map((_, idx) => (
                    <div
                      key={`l2-cross-basket-${idx}`}
                      className="relative p-1 rounded-2xl bg-rose-50/70 border border-dashed border-rose-300 opacity-50 transition-opacity hover:opacity-80"
                      title="1 Bakul (10 Epal) Ditolak"
                    >
                      <BasketItem size="md" />
                      <div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        aria-hidden="true"
                      >
                        <div className="w-full h-1 sm:h-1.5 bg-rose-600 rounded-full rotate-45 transform scale-90 shadow-2xs" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Loose Apples Area */}
              {(breakdownL2.normalLooseApples > 0 || breakdownL2.crossedLooseApples > 0) && (
                <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 w-full pt-2 border-t border-rose-100/60">
                  {/* Normal Loose Apples */}
                  {Array.from({ length: breakdownL2.normalLooseApples }).map((_, idx) => (
                    <div
                      key={`l2-norm-loose-${idx}`}
                      className="relative p-1 rounded-xl bg-white border border-slate-200/80 shadow-2xs transition-transform hover:scale-110"
                      title="Epal yang tinggal"
                    >
                      <AppleItem size="sm" />
                    </div>
                  ))}

                  {/* Visual separator if both exist */}
                  {breakdownL2.normalLooseApples > 0 && breakdownL2.crossedLooseApples > 0 && (
                    <div className="h-6 w-px bg-rose-200 mx-0.5 self-center" aria-hidden="true" />
                  )}

                  {/* Crossed Loose Apples */}
                  {Array.from({ length: breakdownL2.crossedLooseApples }).map((_, idx) => (
                    <div
                      key={`l2-cross-loose-${idx}`}
                      className="relative p-1 rounded-xl bg-rose-50/70 border border-dashed border-rose-300 opacity-50 transition-opacity hover:opacity-80"
                      title="Epal Ditolak"
                    >
                      <AppleItem size="sm" />
                      <div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        aria-hidden="true"
                      >
                        <div className="w-full h-0.5 sm:h-1 bg-rose-600 rounded-full rotate-45 transform scale-90" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : isSingleGroupModeLevel1 ? (
        /* ========================================================================= */
        /* LEVEL 1: SINGLE-FRAME DISPLAY FOR A <= 10 (PRESERVED AS EXISTING)         */
        /* ========================================================================= */
        <div
          id="subtraction-inline-frame"
          className="w-full bg-indigo-50/40 rounded-2xl p-3 sm:p-4 border-2 border-indigo-100/90 flex flex-col items-center gap-2.5 shadow-2xs"
        >
          <div className="flex items-center justify-between w-full border-b border-indigo-100 pb-1.5 px-1">
            <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider">
              Jumlah Asal: {safeA} Epal
            </span>
            {safeB > 0 && (
              <span className="text-[11px] font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                − {safeB} Ditolak
              </span>
            )}
          </div>

          <div
            className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 py-1.5 min-h-[64px] w-full"
            aria-label={`${safeA} epal asal, ${safeB} epal ditolak`}
          >
            {/* 1. Remaining Apples (Clean, active) */}
            {Array.from({ length: remainingCount }).map((_, idx) => (
              <div
                key={`sub-remain-apple-${idx}`}
                className="relative p-1 rounded-xl bg-white border border-emerald-100 shadow-2xs transition-transform hover:scale-110"
                title="Epal yang tinggal"
              >
                <AppleItem size="md" />
              </div>
            ))}

            {/* Visual separator if both remaining and removed apples exist */}
            {remainingCount > 0 && safeB > 0 && (
              <div className="h-8 w-px bg-rose-200 mx-0.5 self-center" aria-hidden="true" />
            )}

            {/* 2. Removed Apples (Muted with gentle red strike & dashed container) */}
            {safeB > 0 && (
              <div
                id="subtraction-removed-group"
                className="flex flex-wrap items-center justify-center gap-1.5 p-1 rounded-xl bg-rose-50/80 border-2 border-dashed border-rose-300"
                title={`${safeB} epal ditolak`}
              >
                {Array.from({ length: safeB }).map((_, idx) => (
                  <div
                    key={`sub-removed-apple-${idx}`}
                    className="relative p-1 rounded-lg opacity-45 transition-opacity hover:opacity-75"
                  >
                    <AppleItem size="md" />
                    {/* Gentle diagonal strike-through indicator */}
                    <div
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      aria-hidden="true"
                    >
                      <div className="w-full h-0.5 bg-rose-600 rounded-full rotate-45 transform scale-90" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Edge Case: 0 apples remaining */}
            {safeA === 0 && (
              <span className="text-xs font-bold text-slate-400 italic py-2">
                0 epal (Tiada objek)
              </span>
            )}
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* LEVEL 1: TWO-PANEL BASE-10 DISPLAY FOR A > 10 (PRESERVED AS EXISTING)     */
        /* ========================================================================= */
        <div
          id="subtraction-base10-frame"
          className="w-full flex items-stretch justify-between gap-2 sm:gap-3"
        >
          {/* Starting Amount Panel */}
          <div
            id="subtraction-start-panel"
            className="flex-1 flex flex-col justify-between bg-indigo-50/40 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-indigo-100 min-h-[96px] sm:min-h-[108px]"
          >
            <div className="flex items-center justify-between w-full mb-1 px-0.5">
              <span className="text-[11px] sm:text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Kuantiti Asal
              </span>
              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-indigo-600 text-white font-black text-xs sm:text-sm shadow-2xs">
                {safeA}
              </span>
            </div>
            <div className="flex-1 flex items-center justify-center py-1">
              <QuantityGroupRenderer value={safeA} />
            </div>
          </div>

          {/* Subtraction Symbol */}
          <div className="flex items-center justify-center flex-shrink-0 self-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-rose-500 text-white font-black text-xl sm:text-2xl shadow-xs">
            <span aria-hidden="true" className="leading-none">−</span>
          </div>

          {/* Removed Quantity Panel */}
          <div
            id="subtraction-removed-panel"
            className="flex-1 flex flex-col justify-between bg-rose-50/50 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border-2 border-dashed border-rose-200 min-h-[96px] sm:min-h-[108px]"
          >
            <div className="flex items-center justify-between w-full mb-1 px-0.5">
              <span className="text-[11px] sm:text-xs font-bold text-rose-700 uppercase tracking-wider">
                Ditolak
              </span>
              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-rose-600 text-white font-black text-xs sm:text-sm shadow-2xs">
                −{safeB}
              </span>
            </div>
            <div className="flex-1 flex flex-wrap items-center justify-center gap-1 py-1">
              {safeB > 10 ? (
                <QuantityGroupRenderer value={safeB} />
              ) : safeB === 0 ? (
                <span className="text-xs font-semibold text-slate-400 italic">0 epal</span>
              ) : (
                Array.from({ length: safeB }).map((_, idx) => (
                  <div
                    key={`sub-panel-removed-${idx}`}
                    className="relative p-0.5 opacity-60"
                    title="Epal ditolak"
                  >
                    <AppleItem size={safeB > 8 ? 'sm' : 'md'} />
                    <div
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      aria-hidden="true"
                    >
                      <div className="w-full h-0.5 bg-rose-600 rounded-full rotate-45 transform scale-90" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Clear Question Expression Below Visual (Without revealing answer) */}
      {prompt && (
        <div className="mt-0.5 inline-flex items-center gap-2 px-3.5 py-1 rounded-xl bg-slate-100/90 border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm">
          <span>Soalan:</span>
          <span className="font-black text-rose-700 font-mono tracking-tight">{prompt}</span>
        </div>
      )}
    </div>
  );
}
