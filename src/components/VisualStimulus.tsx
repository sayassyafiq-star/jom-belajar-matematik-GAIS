import { VisualGroup, MathOperation } from '../types';
import { QuantityGroupRenderer } from './stimulus/QuantityGroupRenderer';
import { EqualGroupsRenderer } from './stimulus/EqualGroupsRenderer';
import { SubtractionRenderer } from './stimulus/SubtractionRenderer';
import { ClockRenderer } from './stimulus/ClockRenderer';

interface VisualStimulusProps {
  operation?: MathOperation;
  operandA?: number;
  operandB?: number;
  level?: number;
  prompt?: string;
  groupA?: VisualGroup;
  groupB?: VisualGroup;
  operatorSymbol?: string;
  className?: string;
}

export function VisualStimulus({
  operation = 'addition',
  operandA,
  operandB,
  level,
  prompt,
  groupA,
  groupB,
  operatorSymbol = '+',
  className = '',
}: VisualStimulusProps) {
  // 1. TIME / BACAAN JAM VISUAL STIMULUS (Mathematical Analog Clock Face)
  // operandA represents hour (1..12), operandB represents minute (0 for Level 1)
  if (operation === 'time' || operatorSymbol === '🕐') {
    const hour = operandA !== undefined ? operandA : 3;
    const minute = operandB !== undefined ? operandB : 0;

    return (
      <div
        id="visual-stimulus-container"
        className={`w-full max-w-lg mx-auto bg-white/95 rounded-2xl sm:rounded-3xl border-2 border-indigo-100/80 shadow-xs p-3.5 sm:p-4 ${className}`}
      >
        <ClockRenderer hour={hour} minute={minute} />
      </div>
    );
  }

  // 2. MULTIPLICATION VISUAL STIMULUS (Equal Groups)
  // A × B means A groups, with B objects in every group.
  if (operation === 'multiplication' || operatorSymbol === '×' || operatorSymbol === '✖️') {
    const numGroups = operandA !== undefined ? operandA : groupA ? groupA.count : 2;
    const itemsPerGroup = operandB !== undefined ? operandB : groupB ? groupB.count : 3;

    return (
      <div
        id="visual-stimulus-container"
        className={`w-full max-w-lg mx-auto bg-white/95 rounded-2xl sm:rounded-3xl border-2 border-indigo-100/80 shadow-xs p-3.5 sm:p-4 ${className}`}
      >
        <EqualGroupsRenderer
          operation="multiplication"
          numberOfGroups={numGroups}
          itemsPerGroup={itemsPerGroup}
          prompt={prompt}
        />
      </div>
    );
  }

  // 2. DIVISION VISUAL STIMULUS (Equal Sharing)
  // A ÷ B means A total objects shared equally into B groups (B containers, each having A/B apples).
  if (operation === 'division' || operatorSymbol === '÷' || operatorSymbol === '➗') {
    const totalObjects = operandA !== undefined ? operandA : groupA ? groupA.count : 8;
    const divisor = operandB !== undefined ? operandB : groupB ? groupB.count : 2;
    const quotient = divisor > 0 ? Math.floor(totalObjects / divisor) : 1;

    return (
      <div
        id="visual-stimulus-container"
        className={`w-full max-w-lg mx-auto bg-white/95 rounded-2xl sm:rounded-3xl border-2 border-indigo-100/80 shadow-xs p-3.5 sm:p-4 ${className}`}
      >
        <EqualGroupsRenderer
          operation="division"
          numberOfGroups={divisor}
          itemsPerGroup={quotient}
          prompt={prompt}
        />
      </div>
    );
  }

  // 3. SUBTRACTION VISUAL STIMULUS (Take Away / Quantity Removed)
  // A − B means Starting Quantity A minus Quantity Removed B.
  if (operation === 'subtraction' || operatorSymbol === '−' || operatorSymbol === '-') {
    const startCount = operandA !== undefined ? operandA : groupA ? groupA.count : 10;
    const removeCount = operandB !== undefined ? operandB : groupB ? groupB.count : 4;

    return (
      <div
        id="visual-stimulus-container"
        className={`w-full max-w-lg mx-auto bg-white/95 rounded-2xl sm:rounded-3xl border-2 border-rose-100/90 shadow-xs p-3.5 sm:p-4 ${className}`}
      >
        <SubtractionRenderer
          operandA={startCount}
          operandB={removeCount}
          level={level}
          prompt={prompt}
        />
      </div>
    );
  }

  // 4. ADDITION VISUAL STIMULUS (Existing Base-10 Stimulus System)
  const defaultGroupA: VisualGroup = groupA || {
    count: operandA ?? 15,
    itemEmoji: '🍎',
    label: 'Kumpulan 1',
  };
  const defaultGroupB: VisualGroup = groupB || {
    count: operandB ?? 8,
    itemEmoji: '🍎',
    label: 'Kumpulan 2',
  };

  return (
    <div
      id="visual-stimulus-container"
      className={`w-full max-w-lg mx-auto bg-white/95 rounded-2xl sm:rounded-3xl border-2 border-indigo-100/80 shadow-xs p-3.5 sm:p-4 ${className}`}
    >
      <div className="flex items-stretch justify-between gap-2 sm:gap-3">
        {/* Group A */}
        <div
          id="stimulus-group-a"
          className="flex-1 flex flex-col justify-between bg-indigo-50/40 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-indigo-100 min-h-[96px] sm:min-h-[108px]"
        >
          <div className="flex items-center justify-between w-full mb-1 px-0.5">
            <span className="text-[11px] sm:text-xs font-bold text-indigo-600 uppercase tracking-wider truncate">
              {defaultGroupA.label || 'Kumpulan 1'}
            </span>
            <span
              id="stimulus-count-a"
              className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-indigo-600 text-white font-black text-xs sm:text-sm shadow-2xs"
            >
              {defaultGroupA.count}
            </span>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <QuantityGroupRenderer value={defaultGroupA.count} />
          </div>
        </div>

        {/* Operation Symbol */}
        <div className="flex items-center justify-center flex-shrink-0 self-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-600 text-white font-black text-xl sm:text-2xl shadow-xs">
          <span aria-hidden="true" className="leading-none">{operatorSymbol}</span>
        </div>

        {/* Group B */}
        <div
          id="stimulus-group-b"
          className="flex-1 flex flex-col justify-between bg-indigo-50/40 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-indigo-100 min-h-[96px] sm:min-h-[108px]"
        >
          <div className="flex items-center justify-between w-full mb-1 px-0.5">
            <span className="text-[11px] sm:text-xs font-bold text-indigo-600 uppercase tracking-wider truncate">
              {defaultGroupB.label || 'Kumpulan 2'}
            </span>
            <span
              id="stimulus-count-b"
              className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-indigo-600 text-white font-black text-xs sm:text-sm shadow-2xs"
            >
              {defaultGroupB.count}
            </span>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <QuantityGroupRenderer value={defaultGroupB.count} />
          </div>
        </div>
      </div>
    </div>
  );
}
