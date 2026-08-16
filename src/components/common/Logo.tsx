import React from 'react';

interface LogoProps {
  variant?: 'green' | 'white' | 'black';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showTagline = false,
}) => {
  const heightClasses = {
    sm: 'h-7',
    md: 'h-9',
    lg: 'h-11',
  };

  const textClasses = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className="flex flex-col items-start select-none">
      <div className="flex items-center gap-2.5">
        <img
          src="/ECOKitchen.png"
          alt="EcoKitchen AI"
          className={`${heightClasses[size]} w-auto object-contain`}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/logo-white.png';
          }}
        />
        <span className={`font-outfit font-extrabold tracking-tight ${textClasses[size]}`}>
          <span className="text-eco-green">Eco</span>
          <span className="text-white">Kitchen AI</span>
        </span>
      </div>
      {showTagline && (
        <span className="text-[11px] text-eco-muted font-medium mt-1 tracking-wide">
          Reduce Waste. Predict Demand. Save Communities.
        </span>
      )}
    </div>
  );
};
