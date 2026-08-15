interface AppleItemProps {
  key?: string | number;
  className?: string;
  size?: 'xs' | 'sm' | 'md';
}

export function AppleItem({ className = '', size = 'md' }: AppleItemProps) {
  const dimensionClass =
    size === 'xs'
      ? 'w-4 h-4 text-xs'
      : size === 'sm'
      ? 'w-5 h-5 text-sm'
      : 'w-6 h-6 sm:w-7 sm:h-7 text-base sm:text-lg';

  return (
    <span
      className={`inline-flex items-center justify-center select-none leading-none transform transition-transform hover:scale-115 ${dimensionClass} ${className}`}
      role="img"
      aria-label="1 epal"
      title="1 Epal"
    >
      🍎
    </span>
  );
}
