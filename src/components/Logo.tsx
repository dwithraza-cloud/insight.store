import React from 'react';

export interface LogoProps {
  variant?: 'color' | 'white' | 'icon' | 'icon-white';
  className?: string;
  alt?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'white',
  className = 'h-10 w-auto',
  alt = 'Insight Store'
}) => {
  // 1. Icon Only - Full Color (Cobalt + Dark Ink)
  if (variant === 'icon') {
    return (
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className={className}
        role="img"
        aria-label={alt}
      >
        {/* Top Square (Dot) */}
        <rect x="12" y="8" width="28" height="28" fill="#155dfc" rx="2" />
        
        {/* Lower L-Shaped Body with Rounded Bottom-Left Corner */}
        <path 
          d="M 12 44 
             H 40 
             V 72 
             H 84 
             V 100 
             H 40 
             A 28 28 0 0 1 12 72 
             Z" 
          fill="#155dfc" 
        />
        
        {/* Inner Dark Charcoal/Ink Square with uniform cutout spacing */}
        <rect x="48" y="44" width="36" height="22" fill="#0f172a" rx="2" />
      </svg>
    );
  }

  // 2. Icon Only - White (for dark surfaces)
  if (variant === 'icon-white') {
    return (
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className={className}
        role="img"
        aria-label={alt}
      >
        {/* Top Square (Dot) */}
        <rect x="12" y="8" width="28" height="28" fill="#ffffff" rx="2" />
        
        {/* Lower L-Shaped Body with Rounded Bottom-Left Corner */}
        <path 
          d="M 12 44 
             H 40 
             V 72 
             H 84 
             V 100 
             H 40 
             A 28 28 0 0 1 12 72 
             Z" 
          fill="#ffffff" 
        />
        
        {/* Inner White Square with clean cutout gap */}
        <rect x="48" y="44" width="36" height="22" fill="#ffffff" rx="2" />
      </svg>
    );
  }

  // 3. Full Horizontal Logo - Full Color (Cobalt + Dark Ink on light backgrounds)
  if (variant === 'color') {
    return (
      <svg 
        viewBox="0 0 320 90" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className={className}
        role="img"
        aria-label={alt}
      >
        {/* ICON MARK (Left) */}
        <g transform="translate(2, 0)">
          {/* Top Square (Dot) */}
          <rect x="8" y="6" width="25" height="25" fill="#155dfc" rx="2" />
          
          {/* L-Shaped Body with Rounded Bottom-Left Corner */}
          <path 
            d="M 8 38 
               H 33 
               V 64 
               H 72 
               V 89 
               H 33 
               A 25 25 0 0 1 8 64 
               Z" 
            fill="#155dfc" 
          />
          
          {/* Inner Dark Charcoal/Ink Square */}
          <rect x="40" y="38" width="32" height="20" fill="#0f172a" rx="1.5" />
        </g>

        {/* WORDMARK (Right) */}
        <g transform="translate(92, 0)">
          {/* Line 1: "insight" */}
          <text 
            x="0" 
            y="43" 
            fontFamily="'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif" 
            fontSize="43" 
            fontWeight="800" 
            letterSpacing="-0.035em" 
            fill="#0f172a"
          >
            insight
          </text>
          
          {/* Cobalt blue square dot on the first 'i' in insight */}
          <rect x="0" y="9" width="10" height="10" fill="#155dfc" rx="1.5" />

          {/* Line 2: "store" */}
          <text 
            x="0" 
            y="84" 
            fontFamily="'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif" 
            fontSize="43" 
            fontWeight="800" 
            letterSpacing="-0.035em" 
            fill="#155dfc"
          >
            store
          </text>
        </g>
      </svg>
    );
  }

  // 4. Full Horizontal Logo - Pure White (matching user Image 3 for dark topbar and footer)
  return (
    <svg 
      viewBox="0 0 320 90" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      role="img"
      aria-label={alt}
    >
      {/* ICON MARK (Left) */}
      <g transform="translate(2, 0)">
        {/* Top Square (Dot) */}
        <rect x="8" y="6" width="25" height="25" fill="#ffffff" rx="2" />
        
        {/* L-Shaped Body with Rounded Bottom-Left Corner */}
        <path 
          d="M 8 38 
             H 33 
             V 64 
             H 72 
             V 89 
             H 33 
             A 25 25 0 0 1 8 64 
             Z" 
          fill="#ffffff" 
        />
        
        {/* Inner White Square */}
        <rect x="40" y="38" width="32" height="20" fill="#ffffff" rx="1.5" />
      </g>

      {/* WORDMARK (Right) */}
      <g transform="translate(92, 0)">
        {/* Line 1: "insight" */}
        <text 
          x="0" 
          y="43" 
          fontFamily="'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif" 
          fontSize="43" 
          fontWeight="800" 
          letterSpacing="-0.035em" 
          fill="#ffffff"
        >
          insight
        </text>
        
        {/* White square dot on the first 'i' in insight */}
        <rect x="0" y="9" width="10" height="10" fill="#ffffff" rx="1.5" />

        {/* Line 2: "store" */}
        <text 
          x="0" 
          y="84" 
          fontFamily="'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif" 
          fontSize="43" 
          fontWeight="800" 
          letterSpacing="-0.035em" 
          fill="#ffffff"
        >
          store
        </text>
      </g>
    </svg>
  );
};
