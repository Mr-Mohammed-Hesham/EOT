import React from 'react';
import { Atom } from 'lucide-react';
import { AcademicYear, Language } from '../types/eot';

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
          {/* Ambient golden glow */}
          <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl animate-pulse" />

          {/* Outer counter-rotating ring */}
          <svg
            viewBox="0 0 120 120"
            className="absolute inset-0 w-full h-full animate-spin"
            style={{ animationDuration: '9s' }}
            aria-hidden="true"
          >
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="rgba(245, 158, 11, 0.22)"
              strokeWidth="1.5"
              strokeDasharray="6 6"
            />
            <circle cx="60" cy="8" r="3.5" fill="#fbbf24" />
          </svg>

          {/* Inner primary spinning arc */}
          <svg
            viewBox="0 0 120 120"
            className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] animate-spin"
            style={{ animationDuration: '2.2s', animationDirection: 'reverse' }}
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="stageGoldArc" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="60%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="rgba(234, 88, 12, 0)" />
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

          {/* Core emblem */}
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/25">
            <Atom className="w-5 h-5" aria-hidden="true" />
          </div>
        </div>

        {/* Shimmer bar */}
        <div className="w-44 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
          <div className="w-1/2 h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-300 animate-orbital-shimmer" />
        </div>

        {label && (
          <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{label}</p>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[270px] lg:min-h-full bg-[#0a101d] flex flex-col items-center justify-between p-6 sm:p-8 overflow-hidden select-none">
      {/* Subtle geometric coordinate backdrop */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 45%, rgba(245, 158, 11, 0.28) 0%, rgba(10, 16, 29, 0) 68%)',
        }}
      />

      {/* Top quiet header inside dark navy panel */}
      <div className="relative z-10 w-full flex items-center justify-between text-[11px] font-mono text-slate-400 tabular-nums">
        <span>{isEn ? 'INTERACTIVE EOT ENGINE' : 'نظام الهياكل التفاعلي'}</span>
        <span className="text-amber-400 font-semibold">EOT · {year}</span>
      </div>

      {/* Central Multi-Ring Golden Orbital Loader */}
      <div className="relative z-10 my-4 flex flex-col items-center">
        <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center">
          {/* Soft ambient halo */}
          <div className="absolute inset-3 rounded-full bg-gradient-to-tr from-amber-500/25 via-orange-500/15 to-transparent blur-2xl animate-pulse" />

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
              stroke="rgba(251, 191, 36, 0.22)"
              strokeWidth="1.25"
              strokeDasharray="5 7"
            />
            <circle cx="80" cy="8" r="3.5" fill="#fbbf24" />
            <circle cx="80" cy="152" r="2.5" fill="#f59e0b" opacity="0.7" />
          </svg>

          {/* Ring 2: Counter-rotating primary gold/orange gradient arc */}
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

          {/* Ring 3: Inner precision orbit */}
          <svg
            viewBox="0 0 160 160"
            className="absolute inset-7 w-[calc(100%-56px)] h-[calc(100%-56px)] animate-spin"
            style={{ animationDuration: '5.5s' }}
            aria-hidden="true"
          >
            <circle
              cx="80"
              cy="80"
              r="52"
              fill="none"
              stroke="rgba(245, 158, 11, 0.35)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="90 140"
            />
            <circle cx="132" cy="80" r="4" fill="#f59e0b" />
          </svg>

          {/* Core Glowing Academic Badge */}
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/30">
            <Atom className="w-7 h-7" aria-hidden="true" />
          </div>
        </div>

        {/* Continuous Golden Shimmer Bar */}
        <div className="mt-4 w-48 h-1.5 bg-slate-800/90 rounded-full overflow-hidden relative">
          <div className="w-1/2 h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 animate-orbital-shimmer" />
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
