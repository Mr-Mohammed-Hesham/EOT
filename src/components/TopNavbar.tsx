import React, { useState } from 'react';
import { Menu, RefreshCw, X } from 'lucide-react';
import { AppView, Language } from '../types/eot';
import { EotPlatformLogo } from './EotPlatformLogo';

interface TopNavbarProps {
  activeView: AppView;
  onSelectView: (view: AppView) => void;
  onOpenAddModal: () => void;
  onRefreshPlatform: () => void;
  isRefreshing: boolean;
  language: Language;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  activeView,
  onSelectView,
  onOpenAddModal,
  onRefreshPlatform,
  isRefreshing,
  language,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isEn = language === 'en';

  const navItems: { id: AppView; labelAr: string; labelEn: string }[] = [
    { id: 'hub', labelAr: 'تصفح المناهج', labelEn: 'Curricula' },
    { id: 'workspace', labelAr: 'صفحات الأسئلة', labelEn: 'Question Pages' },
    { id: 'matrix', labelAr: 'خريطة الهياكل', labelEn: 'Structures Matrix' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-[1360px] mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 h-16">
        {/* Zone 1: Single brand lockup (Logo + 1-line wordmark) */}
        <a
          href="#hub"
          onClick={(e) => {
            e.preventDefault();
            onSelectView('hub');
          }}
          className="inline-flex items-center gap-2.5 text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-500"
        >
          <EotPlatformLogo className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />
          <span>
            <span className="text-amber-500">Mr. Mohamed</span>{' '}
            <span>{isEn ? 'Hesham · EOT' : 'Hesham · الهياكل'}</span>
          </span>
        </a>

        {/* Zone 2: 4 concise single-line text navigation links */}
        <nav
          aria-label={isEn ? 'Primary Navigation' : 'التنقل الرئيسي'}
          className="hidden md:flex items-center gap-7 text-sm font-bold text-slate-600 dark:text-slate-300"
        >
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectView(item.id)}
                className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-500 ${
                  isActive
                    ? 'text-amber-600 dark:text-amber-400 border-amber-500'
                    : 'text-slate-600 dark:text-slate-300 border-transparent hover:text-slate-900 dark:hover:text-white hover:border-amber-500/40'
                }`}
              >
                {isEn ? item.labelEn : item.labelAr}
              </button>
            );
          })}

          <button
            type="button"
            onClick={onOpenAddModal}
            className="py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-amber-500/40 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-500"
          >
            {isEn ? 'Add Structure' : 'إضافة منهج'}
          </button>
        </nav>

        {/* Zone 3: 1 primary action (+ mobile menu trigger on narrow screens) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onRefreshPlatform}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-amber-500/30 dark:border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-amber-500 ${isRefreshing ? 'animate-spin' : ''}`}
              aria-hidden="true"
            />
            <span>{isEn ? 'Sync Pages' : 'تحديث المنصة'}</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={isEn ? 'Toggle Menu' : 'فتح القائمة'}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Responsive mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectView(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-start px-3 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {isEn ? item.labelEn : item.labelAr}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => {
              onOpenAddModal();
              setMobileMenuOpen(false);
            }}
            className="w-full text-start px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {isEn ? 'Add Custom Structure' : 'إضافة منهج مخصص'}
          </button>
        </div>
      )}
    </header>
  );
};
