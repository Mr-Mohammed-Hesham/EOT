import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Atom,
  Calculator,
  CheckCircle2,
  Globe,
  Moon,
  Plus,
  RotateCcw,
  Search,
  Sun,
} from 'lucide-react';
import {
  AcademicYear,
  EotCurriculum,
  GradeId,
  Language,
  QuestionProbeResult,
  StreamId,
  SubjectId,
  TermId,
  ThemeMode,
} from '../types/eot';
import {
  ACADEMIC_YEARS,
  GRADES,
  STREAMS,
  SUBJECTS,
  TERMS,
  getGradeLabel,
  getStreamLabel,
  getSubjectLabel,
  getTermLabel,
} from '../data/eotCurricula';
import { EotPlatformLogo } from './EotPlatformLogo';
import { OrbitalStructureLoader } from './OrbitalStructureLoader';

interface CurriculaHubViewProps {
  curricula: EotCurriculum[];
  selectedYear: AcademicYear;
  onYearChange: (year: AcademicYear) => void;
  selectedTerm: TermId;
  onTermChange: (term: TermId) => void;
  selectedGrade: GradeId | 'all';
  onGradeChange: (grade: GradeId | 'all') => void;
  selectedStream: StreamId | 'all';
  onStreamChange: (stream: StreamId | 'all') => void;
  selectedSubject: SubjectId | 'all';
  onSubjectChange: (subject: SubjectId | 'all') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onResetFilters: () => void;
  onOpenCurriculumQuestion: (curriculumId: string, questionNumber: number) => void;
  getTotalQuestions: (curriculum: EotCurriculum) => number;
  completedMap: Record<string, number[]>;
  probeMap: Record<string, Record<number, QuestionProbeResult>>;
  isSyncing?: boolean;
  language: Language;
  onToggleLanguage: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenAddCurriculumModal: () => void;
}

export const CurriculaHubView: React.FC<CurriculaHubViewProps> = ({
  curricula,
  selectedYear,
  onYearChange,
  selectedTerm,
  onTermChange,
  selectedGrade,
  onGradeChange,
  selectedStream,
  onStreamChange,
  selectedSubject,
  onSubjectChange,
  searchQuery,
  onSearchChange,
  onResetFilters,
  onOpenCurriculumQuestion,
  getTotalQuestions,
  completedMap,
  probeMap,
  isSyncing = false,
  language,
  onToggleLanguage,
  theme,
  onToggleTheme,
  onOpenAddCurriculumModal,
}) => {
  const isEn = language === 'en';
  const ArrowIcon = isEn ? ArrowRight : ArrowLeft;

  const totalCompletedAcrossFiltered = curricula.reduce(
    (acc, c) => acc + (completedMap[c.id]?.length || 0),
    0
  );

  return (
    <div className="space-y-8">
      {/* Standalone Hero Banner — Records Warm Gold & Midnight Navy Palette */}
      <section className="rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-white dark:from-amber-950/30 dark:via-slate-900 dark:to-[#0a101d] border border-amber-300/40 dark:border-amber-500/20 overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Editorial & Identity Column */}
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6">
            <div className="space-y-5">
              {/* Top Controls Row: Custom Platform Logo + Theme/Language Switches */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/95 dark:bg-[#0f172a] border border-amber-400/35 dark:border-amber-500/25 flex items-center justify-center p-1.5 shadow-sm shrink-0">
                    <EotPlatformLogo className="w-full h-full" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <span className="font-extrabold text-amber-600 dark:text-amber-400">
                        Mr. Mohammed Hesham
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums font-semibold">
                        {isEn ? `Academic Year ${selectedYear}` : `هياكل عام ${selectedYear}`}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isEn
                        ? 'Official Exam Structures & Interactive Question Pages'
                        : 'منصة الهياكل الامتحانية الرسمية المقسمة حسب الأسئلة'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={onToggleTheme}
                    aria-label={
                      theme === 'dark'
                        ? isEn
                          ? 'Switch to Light Mode'
                          : 'التبديل للوضع النهاري'
                        : isEn
                        ? 'Switch to Dark Mode'
                        : 'التبديل للوضع الليلي'
                    }
                    className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    {theme === 'dark' ? (
                      <Sun className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <Moon className="w-4 h-4" aria-hidden="true" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={onToggleLanguage}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
                    <span>{isEn ? 'العربية' : 'English'}</span>
                  </button>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight max-w-2xl">
                {isEn
                  ? 'Ministry EOT Exam Structures — Question by Question'
                  : 'منصة الهياكل الوزارية المعتمدة — كل سؤال في صفحة مستقلة'}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                {isEn
                  ? 'Organized systematically by Academic Year, Term, Grade, Stream, and Subject. Each curriculum is divided into dedicated interactive question pages for focused practice and mastery.'
                  : 'مقسمة بشكل منهجي منظم حسب السنة الدراسية والفصل الدراسي والصف والمسار والمادة، بحيث تنقسم المادة الواحدة إلى صفحات مستقلة لكل سؤال وزاري مع التدريب التفاعلي المباشر.'}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200/70 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => onOpenCurriculumQuestion('12-adv-bri-phy-t1-2026', 1)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 text-xs sm:text-sm font-bold shadow-md shadow-amber-500/20 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>
                    {isEn
                      ? 'Start 12 Adv Physics (Bridge) · Q1'
                      : 'ابدأ فيزياء 12 متقدم بريدج · السؤال 1'}
                  </span>
                  <ArrowIcon className="w-4 h-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={onOpenAddCurriculumModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-amber-400 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-amber-500" aria-hidden="true" />
                  <span>{isEn ? 'Add / Customize Curriculum' : 'إضافة أو تخصيص منهج'}</span>
                </button>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                <span>
                  {isEn
                    ? `${curricula.length} active curricula`
                    : `${curricula.length} مناهج متاحة`}
                </span>
                <span className="mx-2" aria-hidden="true">·</span>
                <span>
                  {isEn
                    ? `${totalCompletedAcrossFiltered} questions reviewed`
                    : `تمت مراجعة ${totalCompletedAcrossFiltered} سؤال`}
                </span>
              </div>
            </div>
          </div>

          {/* Animated Orbital Loader Column (replaces static hero image) */}
          <div className="lg:col-span-5">
            <OrbitalStructureLoader
              variant="hero"
              year={selectedYear}
              language={language}
              isSyncing={isSyncing}
            />
          </div>
        </div>
      </section>

      {/* Hierarchy Filter Navigator (Year -> Term -> Grade -> Subject -> Stream + Search) */}
      <section
        aria-label={isEn ? 'Curriculum Hierarchy Filters' : 'تصفية الهياكل حسب السنة والفصل والمادة'}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 transition-colors"
      >
        {/* Row 1: Academic Year + Term + Search */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
          {/* Year Segmented Control */}
          <div className="lg:col-span-4 space-y-1.5">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
              {isEn ? 'Academic Year' : 'السنة الدراسية'}
            </label>
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-xl">
              {ACADEMIC_YEARS.map((yr) => {
                const active = selectedYear === yr.id;
                return (
                  <button
                    key={yr.id}
                    type="button"
                    onClick={() => onYearChange(yr.id)}
                    className={`flex-1 px-3 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 tabular-nums cursor-pointer ${
                      active
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {isEn ? yr.labelEn : yr.labelAr}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Term Segmented Control */}
          <div className="lg:col-span-5 space-y-1.5">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
              {isEn ? 'Academic Term' : 'الفصل الدراسي'}
            </label>
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-xl overflow-x-auto">
              {TERMS.map((t) => {
                const active = selectedTerm === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onTermChange(t.id)}
                    className={`flex-1 px-3 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {t.id === 'T1'
                      ? isEn
                        ? 'Term 1'
                        : 'الفصل الأول'
                      : t.id === 'T2'
                      ? isEn
                        ? 'Term 2'
                        : 'الفصل الثاني'
                      : isEn
                      ? 'Term 3'
                      : 'الفصل الثالث'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Input */}
          <div className="lg:col-span-3 space-y-1.5">
            <label
              htmlFor="curriculum-search"
              className="block text-xs font-bold text-slate-600 dark:text-slate-300"
            >
              {isEn ? 'Quick Search' : 'بحث في المناهج'}
            </label>
            <div className="relative">
              <Search
                className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${
                  isEn ? 'left-3' : 'right-3'
                }`}
                aria-hidden="true"
              />
              <input
                id="curriculum-search"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={isEn ? 'Physics, 12Adv, Math...' : 'ابحث باسم المادة أو الرمز...'}
                className={`w-full py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-900 focus:border-amber-500 focus:outline-none text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-colors ${
                  isEn ? 'pl-9 pr-3' : 'pr-9 pl-3'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Row 2: Grade + Subject + Stream + Reset */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-wrap items-end gap-4">
            {/* Grade Filter */}
            <div className="space-y-1.5">
              <span className="block text-xs font-bold text-slate-600 dark:text-slate-300">
                {isEn ? 'Grade' : 'الصف الدراسي'}
              </span>
              <div className="inline-flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-xl">
                <button
                  type="button"
                  onClick={() => onGradeChange('all')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedGrade === 'all'
                      ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {isEn ? 'All' : 'الكل'}
                </button>
                {GRADES.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => onGradeChange(g.id)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 tabular-nums cursor-pointer ${
                      selectedGrade === g.id
                        ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {isEn ? `G${g.id}` : `صف ${g.id}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Filter */}
            <div className="space-y-1.5">
              <span className="block text-xs font-bold text-slate-600 dark:text-slate-300">
                {isEn ? 'Subject' : 'المادة الدراسية'}
              </span>
              <div className="inline-flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-xl">
                <button
                  type="button"
                  onClick={() => onSubjectChange('all')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedSubject === 'all'
                      ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {isEn ? 'All' : 'الكل'}
                </button>
                {SUBJECTS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onSubjectChange(s.id)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      selectedSubject === s.id
                        ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {isEn ? s.labelEn : s.labelAr}
                  </button>
                ))}
              </div>
            </div>

            {/* Stream Filter */}
            <div className="space-y-1.5">
              <span className="block text-xs font-bold text-slate-600 dark:text-slate-300">
                {isEn ? 'Stream & Program' : 'المسار والبرنامج'}
              </span>
              <div className="inline-flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-xl">
                <button
                  type="button"
                  onClick={() => onStreamChange('all')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedStream === 'all'
                      ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {isEn ? 'All' : 'الكل'}
                </button>
                {STREAMS.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => onStreamChange(st.id)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      selectedStream === st.id
                        ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {isEn ? st.labelEn : st.labelAr}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{isEn ? 'Reset Filters' : 'إعادة الضبط'}</span>
          </button>
        </div>
      </section>

      {/* Curricula Cards Grid */}
      {curricula.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center space-y-4">
          <p className="text-base font-bold text-slate-900 dark:text-white">
            {isEn
              ? 'No curricula match the current filter selection.'
              : 'لا توجد مناهج مطابقة لخيارات التصفية المحددة حالياً.'}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {isEn
              ? 'Reset the filters to view all 9 approved curricula or add a custom curriculum link pattern.'
              : 'يمكنك إعادة ضبط الفلاتر لعرض جميع المناهج التسعة المعتمدة، أو إضافة منهج جديد بنمط رابط مخصص.'}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onResetFilters}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-bold hover:from-amber-600 hover:to-orange-600 transition-colors cursor-pointer"
            >
              {isEn ? 'Show All Curricula' : 'عرض جميع المناهج'}
            </button>
            <button
              type="button"
              onClick={onOpenAddCurriculumModal}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {isEn ? 'Add Custom Curriculum' : 'إضافة منهج مخصص'}
            </button>
          </div>
        </div>
      ) : (
        <section
          aria-label={isEn ? 'Available Subject Structures' : 'قائمة مناهج الهياكل'}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {curricula.map((curriculum) => {
            const totalQ = getTotalQuestions(curriculum);
            const completedList = completedMap[curriculum.id] || [];
            const completedCount = completedList.filter((q) => q <= totalQ).length;
            const progressPct = totalQ > 0 ? Math.round((completedCount / totalQ) * 100) : 0;

            const curriculumProbes = probeMap[curriculum.id] || {};
            const liveCount = Object.values(curriculumProbes).filter(
              (p) => p.status === 'live'
            ).length;

            const SubjectIcon = curriculum.subject === 'physics' ? Atom : Calculator;
            const previewNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((n) => n <= totalQ);

            return (
              <article
                key={curriculum.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between gap-5 hover:border-amber-500/40 dark:hover:border-amber-500/40 transition-colors"
              >
                <div className="space-y-3">
                  {/* Quiet 1-line unboxed metadata kicker */}
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span>{getGradeLabel(curriculum.grade, language)}</span>
                      <span aria-hidden="true">·</span>
                      <span>{getStreamLabel(curriculum.stream, language)}</span>
                      <span aria-hidden="true">·</span>
                      <span>{getTermLabel(curriculum.term, language)}</span>
                    </div>
                    <SubjectIcon
                      className="w-4 h-4 text-amber-500 shrink-0"
                      aria-hidden="true"
                    />
                  </div>

                  {/* Primary Title */}
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {isEn ? curriculum.titleEn : curriculum.titleAr}
                  </h2>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {isEn ? curriculum.subtitleEn : curriculum.subtitleAr}
                  </p>

                  {/* Unboxed stats */}
                  <div className="pt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                    <span className="font-bold text-slate-700 dark:text-slate-200">
                      {getSubjectLabel(curriculum.subject, language)}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {isEn ? `${totalQ} Question Pages` : `${totalQ} صفحة سؤال`}
                    </span>
                    {liveCount > 0 && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>
                            {isEn ? `${liveCount} Live` : `${liveCount} منشور`}
                          </span>
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Direct Question Page Jump Strip */}
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                    <span>
                      {isEn ? 'Jump directly to question page:' : 'انتقال سريع لصفحة السؤال:'}
                    </span>
                    <span>
                      {completedCount} / {totalQ} ({progressPct}%)
                    </span>
                  </div>

                  {/* Golden progress bar */}
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-transform duration-200 origin-right"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-5 gap-1.5">
                    {previewNumbers.map((qNum) => {
                      const isDone = completedList.includes(qNum);
                      const qProbe = curriculumProbes[qNum];
                      const isLive = qProbe?.status === 'live';

                      return (
                        <button
                          key={qNum}
                          type="button"
                          onClick={() => onOpenCurriculumQuestion(curriculum.id, qNum)}
                          title={
                            isEn
                              ? `Open Question ${qNum} Page`
                              : `فتح صفحة السؤال ${qNum}`
                          }
                          className={`py-1.5 px-2 rounded-lg text-xs font-mono font-bold tabular-nums transition-colors cursor-pointer border ${
                            isDone
                              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/25'
                              : isLive
                              ? 'bg-amber-500/15 border-amber-500/35 text-amber-800 dark:text-amber-300 hover:bg-amber-500/25'
                              : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-500/40'
                          }`}
                        >
                          Q{qNum}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-1 flex items-center justify-between gap-3">
                    <span
                      className="text-[11px] font-mono text-slate-400 dark:text-slate-500 truncate max-w-[165px]"
                      dir="ltr"
                    >
                      {curriculum.repoPrefixExample}
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenCurriculumQuestion(curriculum.id, 1)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 text-xs font-bold shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>{isEn ? 'Open Question Pages' : 'فتح صفحات الأسئلة'}</span>
                      <ArrowIcon className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
};
