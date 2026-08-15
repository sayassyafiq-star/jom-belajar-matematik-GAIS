interface BasketItemProps {
  key?: string | number;
  className?: string;
  size?: 'sm' | 'md';
}

export function BasketItem({ className = '', size = 'md' }: BasketItemProps) {
  const isSm = size === 'sm';

  return (
    <div
      className={`relative inline-flex flex-col items-center select-none ${
        isSm ? 'w-10 sm:w-11' : 'w-11 sm:w-13 md:w-14'
      } ${className}`}
      role="img"
      aria-label="Bakul berisi 10 epal"
      title="1 Bakul = 10 Epal"
    >
      {/* Apples showing at top of basket */}
      <div className="flex items-center justify-center -space-x-1 mb-[-4px] z-10">
        <span className={`${isSm ? 'text-[11px]' : 'text-xs sm:text-sm'}`}>🍎</span>
        <span className={`${isSm ? 'text-[11px]' : 'text-xs sm:text-sm'}`}>🍎</span>
        <span className={`${isSm ? 'text-[11px]' : 'text-xs sm:text-sm'}`}>🍎</span>
      </div>

      {/* Basket Body (Crisp vector container with woven pattern & prominent "10" badge) */}
      <div className="relative w-full aspect-[4/3] rounded-b-xl rounded-t-xs bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 border-2 border-amber-600 shadow-xs flex items-center justify-center overflow-hidden">
        {/* Subtle woven lines */}
        <div className="absolute inset-0 opacity-25 bg-[repeating-linear-gradient(45deg,#b45309,#b45309_2px,transparent_2px,transparent_6px)] pointer-events-none" />
        
        {/* Dominant "10" Tag */}
        <span className="relative z-10 px-1.5 py-0.5 rounded-md bg-amber-900/90 text-amber-50 font-black text-[10px] sm:text-xs leading-none tracking-tight shadow-2xs border border-amber-700">
          10
        </span>
      </div>
    </div>
  );
}
