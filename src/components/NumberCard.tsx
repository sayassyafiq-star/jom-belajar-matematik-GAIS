import React from 'react';
import { CardState, CardSize, NumberCardProps } from '../types';

export function NumberCard({
  value,
  selected = false,
  disabled = false,
  state = 'default',
  onClick,
  size = 'md',
  className = '',
  ariaLabel,
  id,
}: NumberCardProps) {
  // Resolve effective visual state based on explicit state or boolean props
  let effectiveState: CardState = state;
  if (disabled || state === 'disabled') {
    effectiveState = 'disabled';
  } else if (selected || state === 'selected') {
    effectiveState = 'selected';
  }

  const isInteractive = effectiveState !== 'disabled';

  // Size styling maps
  const sizeClasses: Record<CardSize, { container: string; text: string; badge: string; decor: string }> = {
    sm: {
      container: 'w-18 h-24 sm:w-20 sm:h-28 rounded-xl',
      text: 'text-2xl sm:text-3xl font-extrabold',
      badge: 'w-4 h-4 text-[10px] top-1.5 right-1.5',
      decor: 'w-1.5 h-1.5',
    },
    md: {
      container: 'w-24 h-32 sm:w-28 sm:h-38 md:w-32 md:h-42 rounded-2xl',
      text: 'text-3xl sm:text-4xl md:text-5xl font-black',
      badge: 'w-5 h-5 sm:w-6 sm:h-6 text-xs sm:text-sm top-2 right-2',
      decor: 'w-2 h-2',
    },
    lg: {
      container: 'w-32 h-44 sm:w-36 sm:h-48 md:w-40 md:h-54 rounded-3xl',
      text: 'text-4xl sm:text-5xl md:text-6xl font-black',
      badge: 'w-6 h-6 sm:w-7 sm:h-7 text-sm top-2.5 right-2.5',
      decor: 'w-2.5 h-2.5',
    },
  };

  // State-specific visual styling
  const stateStyles: Record<CardState, { card: string; text: string; decor: string; animation: string }> = {
    default: {
      card: 'bg-white border-2 border-slate-200 border-b-[5px] border-b-slate-300 shadow-md shadow-slate-200/60 hover:border-indigo-300 hover:border-b-indigo-400 hover:-translate-y-1 active:translate-y-0.5 active:border-b-2 active:shadow-xs',
      text: 'text-slate-800',
      decor: 'bg-slate-200 group-hover:bg-indigo-300',
      animation: 'transition-all duration-150',
    },
    selected: {
      card: 'bg-indigo-50/90 border-2 border-indigo-500 border-b-[5px] border-b-indigo-600 ring-4 ring-indigo-200/80 shadow-lg shadow-indigo-200/50 -translate-y-1.5',
      text: 'text-indigo-700',
      decor: 'bg-indigo-400',
      animation: 'transition-all duration-150',
    },
    correct: {
      card: 'bg-emerald-50 border-2 border-emerald-500 border-b-[5px] border-b-emerald-600 ring-4 ring-emerald-200/80 shadow-md shadow-emerald-200/50',
      text: 'text-emerald-800',
      decor: 'bg-emerald-400',
      animation: 'animate-card-pop',
    },
    incorrect: {
      card: 'bg-rose-50 border-2 border-rose-400 border-b-[5px] border-b-rose-500 ring-4 ring-rose-200/80 shadow-md shadow-rose-200/40',
      text: 'text-rose-700',
      decor: 'bg-rose-400',
      animation: 'animate-card-shake',
    },
    disabled: {
      card: 'bg-slate-100 border-2 border-slate-200 border-b-2 border-b-slate-200 shadow-none opacity-60 cursor-not-allowed',
      text: 'text-slate-400',
      decor: 'bg-slate-200',
      animation: 'transition-none',
    },
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;
  const currentState = stateStyles[effectiveState] || stateStyles.default;

  // Accessible state labels in Malay for screen readers
  const stateLabels: Record<CardState, string> = {
    default: 'Sedia',
    selected: 'Dipilih',
    correct: 'Betul',
    incorrect: 'Cuba lagi',
    disabled: 'Tidak aktif',
  };

  const defaultAriaLabel = `Kad Nombor ${value}, Status: ${stateLabels[effectiveState]}`;

  // Dynamic typography adjustment for longer values (e.g. "12:30")
  const isLongValue = typeof value === 'string' && value.length >= 4;
  const displayTextClass = isLongValue
    ? size === 'sm'
      ? 'text-lg sm:text-xl font-black tracking-tight'
      : size === 'lg'
      ? 'text-3xl sm:text-4xl md:text-5xl font-black tracking-tight'
      : 'text-2xl sm:text-3xl md:text-4xl font-black tracking-tight'
    : currentSize.text;

  return (
    <button
      id={id || `number-card-${value}-${effectiveState}`}
      type="button"
      onClick={isInteractive ? onClick : undefined}
      disabled={!isInteractive}
      aria-label={ariaLabel || defaultAriaLabel}
      aria-pressed={effectiveState === 'selected'}
      aria-disabled={effectiveState === 'disabled'}
      className={`group relative flex flex-col items-center justify-center p-3 select-none outline-hidden focus-visible:ring-4 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 ${currentSize.container} ${currentState.card} ${currentState.animation} ${className}`}
    >
      {/* Restrained "Jom Card" subtle corner accents (Authentic physical learning card signature) */}
      <div
        aria-hidden="true"
        className={`absolute top-2 left-2 rounded-full opacity-60 transition-colors ${currentSize.decor} ${currentState.decor}`}
      />
      <div
        aria-hidden="true"
        className={`absolute bottom-2 right-2 rounded-full opacity-60 transition-colors ${currentSize.decor} ${currentState.decor}`}
      />

      {/* State Feedback Indicator Badges */}
      {effectiveState === 'selected' && (
        <span
          aria-hidden="true"
          className={`absolute flex items-center justify-center rounded-full bg-indigo-600 text-white font-black shadow-xs ${currentSize.badge}`}
        >
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white animate-pulse" />
        </span>
      )}

      {effectiveState === 'correct' && (
        <span
          aria-hidden="true"
          className={`absolute flex items-center justify-center rounded-full bg-emerald-600 text-white font-black shadow-xs ${currentSize.badge}`}
        >
          ✓
        </span>
      )}

      {effectiveState === 'incorrect' && (
        <span
          aria-hidden="true"
          className={`absolute flex items-center justify-center rounded-full bg-rose-500 text-white font-black shadow-xs ${currentSize.badge}`}
        >
          ✕
        </span>
      )}

      {/* Dominant Number / Time Display */}
      <span
        className={`leading-none whitespace-nowrap transition-colors ${displayTextClass} ${currentState.text}`}
      >
        {value}
      </span>
    </button>
  );
}
