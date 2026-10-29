import React, { useId } from 'react';

interface EotPlatformLogoProps {
  className?: string;
  /** Brightens primary indigo stops and pedestal contrast on deep dark backgrounds */
  onDarkSurface?: boolean;
  title?: string;
}

/**
 * 4U Logo with Bespoke Ministerial Structures (EOT) Architectural Touch:
 * - Authentic bold geometric "4" (Indigo-Violet) & "U" (Royal Gold-Amber) + Academic Cap
 * - Precision structural blueprint vertex joints on "4" & suspended diamond node inside "U"
 * - Connected architectural blueprint pedestal bearing crisp vector "EOT" badge underneath
 */
export const EotPlatformLogo: React.FC<EotPlatformLogoProps> = ({
  className = 'w-10 h-10',
  onDarkSurface = false,
  title,
}) => {
  const rawId = useId().replace(/:/g, '');
  const primaryId = `logo4u-primary-${rawId}`;
  const accentId = `logo4u-accent-${rawId}`;
  const shadowId = `logo4u-shadow-${rawId}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={className}
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      <defs>
        <linearGradient id={primaryId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={onDarkSurface ? '#6366f1' : '#4f46e5'} />
          <stop offset="50%" stopColor={onDarkSurface ? '#818cf8' : '#6366f1'} />
          <stop offset="100%" stopColor={onDarkSurface ? '#a78bfa' : '#7c3aed'} />
        </linearGradient>

        <linearGradient id={accentId} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>

        <filter id={shadowId} x="-12%" y="-12%" width="124%" height="128%">
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="2.2"
            floodColor="#0f172a"
            floodOpacity={onDarkSurface ? '0.45' : '0.24'}
          />
        </filter>
      </defs>

      <g filter={`url(#${shadowId})`}>
        {/* 1. The Bold Geometric "4" (4U Primary Theme + Structural Blueprint Joints) */}
        <path
          d="M 39,19.5 L 39,68.5"
          fill="none"
          stroke={`url(#${primaryId})`}
          strokeWidth="10.5"
          strokeLinecap="round"
        />
        <path
          d="M 39,19.5 L 14,50 L 49,50"
          fill="none"
          stroke={`url(#${primaryId})`}
          strokeWidth="10.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Blueprint Vertex Pins on "4" */}
        <circle cx="14" cy="50" r="2.4" fill="#ffffff" />
        <circle
          cx="39"
          cy="50"
          r="2.7"
          fill="#fbbf24"
          stroke="#ffffff"
          strokeWidth="0.9"
        />

        {/* 2. The Bold Geometric "U" (4U Accent Theme + Inner Structure Node) */}
        <path
          d="M 57,30.5 L 57,54.5 C 57,63.2 63,69 71,69 C 79,69 85,63.2 85,54.5 L 85,30.5"
          fill="none"
          stroke={`url(#${accentId})`}
          strokeWidth="10.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Suspended Blueprint Structure Diamond inside "U" */}
        <line
          x1="71"
          y1="34.5"
          x2="71"
          y2="49.5"
          stroke={`url(#${primaryId})`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="2.2 2.4"
        />
        <path
          d="M 71,38 L 75,42 L 71,46 L 67,42 Z"
          fill={`url(#${primaryId})`}
          stroke="#ffffff"
          strokeWidth="0.9"
          strokeLinejoin="round"
        />

        {/* 3. Signature Academic Graduation Cap & Hanging Tassel */}
        <path
          d="M 48,4.5 L 66,11.5 L 48,18.5 L 30,11.5 Z"
          fill={`url(#${accentId})`}
          stroke="#ffffff"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <path
          d="M 40,14.5 L 40,17.8 C 40,20.2 43,21.2 48,21.2 C 53,21.2 56,20.2 56,17.8 L 56,14.5 Z"
          fill={`url(#${accentId})`}
          opacity="0.92"
        />
        <path
          d="M 48,11.5 L 66,11.5 L 66,20"
          fill="none"
          stroke={`url(#${accentId})`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="66" cy="21.2" r="2" fill="#d97706" />

        {/* 4. Ministerial Structures (EOT) Architectural Blueprint Pedestal */}
        <line
          x1="13"
          y1="86.8"
          x2="25"
          y2="86.8"
          stroke={`url(#${primaryId})`}
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <circle cx="13" cy="86.8" r="2.7" fill={`url(#${primaryId})`} />

        <line
          x1="75"
          y1="86.8"
          x2="87"
          y2="86.8"
          stroke={`url(#${accentId})`}
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <circle cx="87" cy="86.8" r="2.7" fill={`url(#${accentId})`} />

        <rect
          x="25"
          y="78.3"
          width="50"
          height="17"
          rx="8.5"
          fill={onDarkSurface ? '#1e293b' : '#0f172a'}
          stroke={`url(#${accentId})`}
          strokeWidth="1.6"
        />
        {/* Crisp Vector "E O T" inside Pedestal */}
        <path
          d="M 39.5,82.8 L 34,82.8 L 34,90.8 L 39.5,90.8 M 34,86.8 L 38.2,86.8"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x="46"
          y="82.8"
          width="7"
          height="8"
          rx="3.5"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.1"
        />
        <path
          d="M 59,82.8 L 66,82.8 M 62.5,82.8 L 62.5,90.8"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};
