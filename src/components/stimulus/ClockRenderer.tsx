import React from 'react';

interface ClockRendererProps {
  hour: number; // 1 to 12
  minute?: number; // 0 for Level 1 (jam tepat)
  className?: string;
  showLegend?: boolean;
}

export function ClockRenderer({
  hour,
  minute = 0,
  className = '',
  showLegend = true,
}: ClockRendererProps) {
  // Normalize hour to 1..12
  const safeHour = ((Math.floor(hour) - 1) % 12 + 12) % 12 + 1;
  const safeMinute = Math.min(59, Math.max(0, Math.floor(minute)));

  // Center & Radius geometry (viewBox 0 0 200 200)
  const cx = 100;
  const cy = 100;
  const clockRadius = 86;
  const numbersRadius = 66;

  // Mathematical Needle Angles in Degrees:
  // Minute hand: 360 * (minute / 60)
  // Hour hand: 360 * ((hour % 12) / 12) + 30 * (minute / 60) = 30 * (hour % 12) + 0.5 * minute
  const minuteAngle = (safeMinute / 60) * 360;
  const hourAngle = ((safeHour % 12) * 30) + (safeMinute / 60) * 30;

  // Generate 12 Hour Marks and 60 Minute Ticks
  const ticks = Array.from({ length: 60 }, (_, i) => {
    const angleDeg = i * 6; // 360 / 60 = 6 deg per minute
    const isHour = i % 5 === 0;
    const tickAngleRad = (angleDeg - 90) * (Math.PI / 180);
    const outerR = clockRadius - 4;
    const innerR = isHour ? outerR - 9 : outerR - 4;

    const x1 = cx + outerR * Math.cos(tickAngleRad);
    const y1 = cy + outerR * Math.sin(tickAngleRad);
    const x2 = cx + innerR * Math.cos(tickAngleRad);
    const y2 = cy + innerR * Math.sin(tickAngleRad);

    return {
      index: i,
      x1,
      y1,
      x2,
      y2,
      isHour,
    };
  });

  // Generate 12 Clock Face Numbers (1 to 12) mathematically
  const hourNumbers = Array.from({ length: 12 }, (_, i) => {
    const h = i + 1;
    // 30 deg per hour, starting at 12 o'clock (which is 0 deg or -90 deg in Cartesian standard)
    const angleDeg = h * 30;
    const angleRad = (angleDeg - 90) * (Math.PI / 180);
    const x = cx + numbersRadius * Math.cos(angleRad);
    const y = cy + numbersRadius * Math.sin(angleRad);

    return {
      number: h,
      x,
      y,
    };
  });

  return (
    <div
      id={`clock-renderer-${safeHour}-${safeMinute}`}
      className={`flex flex-col items-center justify-center gap-3 w-full py-1 select-none ${className}`}
    >
      {/* Educational Header Badge (No answer revealed) */}
      <div className="flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-black shadow-2xs">
          <span>🕐</span>
          <span>Jam Analog</span>
        </span>
        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
          {safeMinute === 0 ? 'Jam Tepat' : 'Setengah Jam'}
        </span>
      </div>

      {/* SVG Analog Clock Face */}
      <div className="relative flex items-center justify-center">
        <svg
          viewBox="0 0 200 200"
          className="w-44 h-44 sm:w-52 sm:h-52 md:w-56 md:h-56 filter drop-shadow-md transition-transform"
          aria-label="Rangsangan visual jam analog"
          role="img"
        >
          <defs>
            {/* Outer Bezel Gradient */}
            <linearGradient id="clockBezelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="100%" stopColor="#3730A3" />
            </linearGradient>

            {/* Inner Dial Soft Gradient */}
            <linearGradient id="clockDialGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#F8FAFC" />
            </linearGradient>

            {/* Needle Drop Shadow */}
            <filter id="handShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#0F172A" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Outer Ring / Bezel */}
          <circle
            cx={cx}
            cy={cy}
            r={clockRadius + 5}
            fill="none"
            stroke="url(#clockBezelGradient)"
            strokeWidth="8"
            className="opacity-95"
          />

          {/* Bezel Accent Ring */}
          <circle
            cx={cx}
            cy={cy}
            r={clockRadius}
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="1.5"
          />

          {/* Dial Face Background */}
          <circle
            cx={cx}
            cy={cy}
            r={clockRadius - 1}
            fill="url(#clockDialGradient)"
          />

          {/* 60 Minute / 12 Hour Ticks */}
          {ticks.map((t) => (
            <line
              key={`tick-${t.index}`}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke={t.isHour ? '#334155' : '#94A3B8'}
              strokeWidth={t.isHour ? '2.5' : '1.2'}
              strokeLinecap="round"
            />
          ))}

          {/* 12 Hour Numbers */}
          {hourNumbers.map((n) => (
            <text
              key={`hour-num-${n.number}`}
              x={n.x}
              y={n.y + 4.5} // Optical vertical baseline correction
              textAnchor="middle"
              className="font-black select-none text-[15px] fill-slate-800"
              style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontWeight: 900,
              }}
            >
              {n.number}
            </text>
          ))}

          {/* HOUR HAND (Jarum Pendek - Dark Slate / Amber Pivot, Shorter & Broader) */}
          <g
            id="clock-hour-hand"
            transform={`rotate(${hourAngle}, ${cx}, ${cy})`}
            filter="url(#handShadow)"
          >
            {/* Hour hand body */}
            <line
              x1={cx}
              y1={cy + 8}
              x2={cx}
              y2={cy - 48}
              stroke="#1E293B"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Hour hand tip point */}
            <polygon
              points={`${cx - 3.5},${cy - 44} ${cx + 3.5},${cy - 44} ${cx},${cy - 52}`}
              fill="#1E293B"
            />
            {/* Hour hand accent stripe */}
            <line
              x1={cx}
              y1={cy - 12}
              x2={cx}
              y2={cy - 36}
              stroke="#F59E0B"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>

          {/* MINUTE HAND (Jarum Panjang - Indigo, Longer & Slimmer) */}
          <g
            id="clock-minute-hand"
            transform={`rotate(${minuteAngle}, ${cx}, ${cy})`}
            filter="url(#handShadow)"
          >
            {/* Minute hand body */}
            <line
              x1={cx}
              y1={cy + 10}
              x2={cx}
              y2={cy - 70}
              stroke="#4F46E5"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Minute hand arrow tip */}
            <polygon
              points={`${cx - 3},${cy - 66} ${cx + 3},${cy - 66} ${cx},${cy - 74}`}
              fill="#4F46E5"
            />
            {/* Minute hand accent center stripe */}
            <line
              x1={cx}
              y1={cy - 10}
              x2={cx}
              y2={cy - 56}
              stroke="#A5B4FC"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>

          {/* Center Pin & Cap Pivot Assembly */}
          <circle
            cx={cx}
            cy={cy}
            r="7"
            fill="#1E293B"
            stroke="#F8FAFC"
            strokeWidth="2"
          />
          <circle
            cx={cx}
            cy={cy}
            r="3.5"
            fill="#F59E0B"
          />
          <circle
            cx={cx - 1}
            cy={cy - 1}
            r="1"
            fill="#FFFFFF"
          />
        </svg>
      </div>

      {/* Child-Friendly Needle Legend Guide */}
      {showLegend && (
        <div className="flex items-center justify-center gap-3 pt-0.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-700">
            <span className="w-2.5 h-1.5 rounded-sm bg-slate-900" />
            <span>Jarum Pendek: Jam</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-[11px] font-bold text-indigo-700">
            <span className="w-3 h-1 rounded-sm bg-indigo-600" />
            <span>Jarum Panjang: Minit</span>
          </div>
        </div>
      )}
    </div>
  );
}
