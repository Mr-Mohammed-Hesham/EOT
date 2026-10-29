import React from 'react';
import { AcademicYear, Language } from '../types/eot';
import { EotPlatformLogo } from './EotPlatformLogo';

interface OrbitalStructureLoaderProps {
  variant?: 'hero' | 'stage';
  year?: AcademicYear;
  language: Language;
  isSyncing?: boolean;
  label?: string;
}

export const OrbitalStructureLoader: React.FC<OrbitalStructureLoaderProps> = ({
  variant = 'hero',
  year = '2026',
  language,
  isSyncing = false,
  label,
}) => {
  const isEn = language === 'en';

  if (variant === 'stage') {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-10 px-6 text-center">
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Ambient dual-tone indigo & gold glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500/20 via-amber-500/20 to-transparent blur-xl animate-pulse" />

          {/* Outer counter-rotating indigo/gold ring */}
          <svg
            viewBox="0 0 120 120"
            className="absolute inset-0 w-full h-full animate-spin"
            style={{ animationDuration: '8s' }}
            aria-hidden="true"
          >
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="rgba(99, 102, 241, 0.28)"
              strokeWidth="1.75"
              strokeDasharray="6 6"
            />
            <circle cx="60" cy="8" r="3.5" fill="#fbbf24" />
          </svg>

          {/* Inner primary spinning arc */}
          <svg
            viewBox="0 0 120 120"
            className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] animate-spin"
            style={{ animationDuration: '2s', animationDirection: 'reverse' }}
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="stageGoldArc" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="55%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="rgba(99, 102, 241, 0.1)" />
              </linearGradient>
            </defs>
            <circle
              cx="60"
              cy="60"
              r="46"
              fill="none"
              stroke="url(#stageGoldArc)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray="180 120"
            />
          </svg>

          {/* Core EOT Platform Emblem */}
          <div className="relative w-12 h-12 rounded-2xl bg-white dark:bg-[#0f172a] border border-amber-400/30 dark:border-indigo-500/30 flex items-center justify-center p-1.5 shadow-lg shadow-amber-500/15">
            <EotPlatformLogo className="w-full h-full" />
          </div>
        </div>

        {/* Shimmer bar */}
        <div className="w-44 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
          <div className="w-1/2 h-full rounded-full bg-gradient-to-r from-indigo-500 via-amber-400 to-orange-400 animate-orbital-shimmer" />
        </div>

        {label && (
          <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{label}</p>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[270px] lg:min-h-full bg-[#0a101d] flex flex-col items-center justify-between p-6 sm:p-8 overflow-hidden select-none">
      {/* Subtle dual-tone radial backdrop */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 45%, rgba(99, 102, 241, 0.26) 0%, rgba(245, 158, 11, 0.16) 38%, rgba(10, 16, 29, 0) 70%)',
        }}
      />

      {/* Top quiet header inside dark navy panel */}
      <div className="relative z-10 w-full flex items-center justify-between text-[11px] font-mono text-slate-400 tabular-nums">
        <span>{isEn ? 'INTERACTIVE EOT PORTAL' : 'نظام الهياكل الوزارية'}</span>
        <span className="text-amber-400 font-semibold">EOT · {year}</span>
      </div>

      {/* Central Multi-Ring Emblem Loader */}
      <div className="relative z-10 my-4 flex flex-col items-center">
        <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center">
          {/* Soft ambient halo */}
          <div className="absolute inset-3 rounded-full bg-gradient-to-tr from-indigo-500/25 via-amber-500/20 to-transparent blur-2xl animate-pulse" />

          {/* Ring 1: Slow dashed outer technical orbit */}
          <svg
            viewBox="0 0 160 160"
            className="absolute inset-0 w-full h-full animate-spin"
            style={{ animationDuration: '16s' }}
            aria-hidden="true"
          >
            <circle
              cx="80"
              cy="80"
              r="72"
              fill="none"
              stroke="rgba(251, 191, 36, 0.24)"
              strokeWidth="1.25"
              strokeDasharray="5 7"
            />
            <circle cx="80" cy="8" r="3.5" fill="#fbbf24" />
            <circle cx="80" cy="152" r="2.8" fill="#818cf8" opacity="0.85" />
          </svg>

          {/* Ring 2: Counter-rotating primary gold/amber gradient arc */}
          <svg
            viewBox="0 0 160 160"
            className="absolute inset-3 w-[calc(100%-24px)] h-[calc(100%-24px)] animate-spin"
            style={{ animationDuration: '3.2s', animationDirection: 'reverse' }}
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="heroGoldArc" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fde68a" />
                <stop offset="45%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="rgba(234, 88, 12, 0.05)" />
              </linearGradient>
            </defs>
            <circle
              cx="80"
              cy="80"
              r="62"
              fill="none"
              stroke="url(#heroGoldArc)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray="230 160"
            />
          </svg>

          {/* Ring 3: Inner Indigo-Violet precision orbit */}
          <svg
            viewBox="0 0 160 160"
            className="absolute inset-6 w-[calc(100%-48px)] h-[calc(100%-48px)] animate-spin"
            style={{ animationDuration: '4.6s' }}
            aria-hidden="true"
          >
            <circle
              cx="80"
              cy="80"
              r="54"
              fill="none"
              stroke="rgba(129, 140, 248, 0.45)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeDasharray="105 145"
            />
            <circle cx="134" cy="80" r="3.8" fill="#818cf8" />
          </svg>

          {/* Core Ministerial EOT Logo Emblem */}
          <div className="relative w-16 h-16 sm:w-[70px] sm:h-[70px] rounded-2xl bg-[#0f172a]/95 border border-amber-400/25 flex items-center justify-center p-2 shadow-[0_0_24px_rgba(99,102,241,0.28)]">
            <EotPlatformLogo onDarkSurface className="w-full h-full" />
          </div>
        </div>

        {/* Continuous Dual-Tone Shimmer Bar */}
        <div className="mt-4 w-48 h-1.5 bg-slate-800/90 rounded-full overflow-hidden relative">
          <div className="w-1/2 h-full rounded-full bg-gradient-to-r from-indigo-400 via-amber-400 to-orange-400 animate-orbital-shimmer" />
        </div>

        <p className="mt-2.5 text-xs font-semibold text-amber-300/90 text-center">
          {isSyncing
            ? isEn
              ? 'Syncing live question pages...'
              : 'جاري فحص ومزامنة صفحات الأسئلة...'
            : isEn
            ? 'Question-by-Question Interactive Portal'
            : 'كل سؤال وزاري في صفحة تفاعلية مستقلة'}
        </p>
      </div>

      {/* Bottom subject summary */}
      <div className="relative z-10 w-full pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs text-slate-300">
        <span className="font-semibold">
          {isEn ? 'Physics & Mathematics' : 'الفيزياء والرياضيات'}
        </span>
        <span className="text-slate-400 tabular-nums">
          {isEn ? 'Grades 10 · 11 · 12' : 'الصفوف 10 · 11 · 12'}
        </span>
      </div>
    </div>
  );
};
