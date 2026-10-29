import React from 'react';
import { Award, ShieldCheck } from 'lucide-react';
import { Language } from '../types/eot';
import { EotPlatformLogo } from './EotPlatformLogo';

interface FooterProps {
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  const isEn = language === 'en';

  return (
    <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/70 backdrop-blur-md transition-colors py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1360px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-start">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center p-1 shrink-0 shadow-xs">
            <EotPlatformLogo className="w-9 h-9" />
          </div>

          <div className="text-start">
            <div className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white tracking-wide">
              <span>Mr. Mohamed Hesham</span>
              <span className="text-slate-400" aria-hidden="true">·</span>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                {isEn ? 'Official EOT Portal' : 'منصة الهياكل الرسمية'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isEn
                ? 'Interactive Exam Structures & Question-by-Question Mastery Portal'
                : 'منصة الهياكل الوزارية والاختبارات التفاعلية المقسمة حسب الأسئلة'}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-1">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
            <span>
              Designed &amp; Developed for{' '}
              <span className="text-amber-600 dark:text-amber-400 font-bold">
                Mr. Mohamed Hesham
              </span>
            </span>
          </p>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
              <span>{isEn ? 'Verified Academic Portal' : 'بوابة أكاديمية معتمدة'}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>&copy; {new Date().getFullYear()} Mr. Mohamed Hesham</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
