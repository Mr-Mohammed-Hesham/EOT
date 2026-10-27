import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  FileEdit,
  Globe,
  Link2,
  Maximize2,
  Minimize2,
  Moon,
  PanelRightClose,
  PanelRightOpen,
  RefreshCw,
  Settings2,
  Sun,
} from 'lucide-react';
import {
  AcademicYear,
  EotCurriculum,
  Language,
  QuestionMetaOverride,
  QuestionProbeResult,
  TermId,
  ThemeMode,
} from '../types/eot';
import {
  ACADEMIC_YEARS,
  TERMS,
  extractRepoNameFromUrl,
  getGradeLabel,
  getStreamLabel,
  getTermLabel,
} from '../data/eotCurricula';
import { OrbitalStructureLoader } from './OrbitalStructureLoader';

interface QuestionWorkspaceViewProps {
  curriculum: EotCurriculum;
  curriculaForSelection: EotCurriculum[];
  selectedYear: AcademicYear;
  onYearChange: (year: AcademicYear) => void;
  selectedTerm: TermId;
  onTermChange: (term: TermId) => void;
  onSelectCurriculum: (curriculumId: string) => void;
  questionNumber: number;
  totalQuestions: number;
  onSelectQuestion: (q: number) => void;
  onUpdateTotalQuestions: (curriculumId: string, count: number) => void;
  questionOverride?: QuestionMetaOverride;
  onSaveQuestionOverride: (
    curriculumId: string,
    q: number,
    override: QuestionMetaOverride
  ) => void;
  probeResult?: QuestionProbeResult;
  curriculumProbes: Record<number, QuestionProbeResult>;
  isScanningCurriculum: boolean;
  onReprobeQuestion: (q: number) => void;
  onScanEntireCurriculum: () => void;
  isCompleted: boolean;
  completedQuestions: number[];
  onToggleCompleted: (q: number) => void;
  isBookmarked: boolean;
  bookmarkedQuestions: number[];
  onToggleBookmarked: (q: number) => void;
  noteText: string;
  onChangeNote: (text: string) => void;
  onBackToHub: () => void;
  language: Language;
  onToggleLanguage: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export const QuestionWorkspaceView: React.FC<QuestionWorkspaceViewProps> = ({
  curriculum,
  curriculaForSelection,
  selectedYear,
  onYearChange,
  selectedTerm,
  onTermChange,
  onSelectCurriculum,
  questionNumber,
  totalQuestions,
  onSelectQuestion,
  onUpdateTotalQuestions,
  questionOverride,
  onSaveQuestionOverride,
  probeResult,
  curriculumProbes,
  isScanningCurriculum,
  onReprobeQuestion,
  onScanEntireCurriculum,
  isCompleted,
  completedQuestions,
  onToggleCompleted,
  isBookmarked,
  bookmarkedQuestions,
  onToggleBookmarked,
  noteText,
  onChangeNote,
  onBackToHub,
  language,
  onToggleLanguage,
  theme,
  onToggleTheme,
}) => {
  const isEn = language === 'en';
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarFilter, setSidebarFilter] = useState<'all' | 'live' | 'done' | 'saved'>('all');
  const [isFullscreenStage, setIsFullscreenStage] = useState(false);
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const [showLinkEditor, setShowLinkEditor] = useState(false);
  const [showCountEditor, setShowCountEditor] = useState(false);
  const [forceIframePreview, setForceIframePreview] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeReloadNonce, setIframeReloadNonce] = useState(0);
  const [copiedField, setCopiedField] = useState<'repo' | 'url' | 'share' | null>(null);

  const [draftCustomUrl, setDraftCustomUrl] = useState(questionOverride?.customUrl || '');
  const [draftTitleAr, setDraftTitleAr] = useState(questionOverride?.titleAr || '');
  const [draftCount, setDraftCount] = useState(String(totalQuestions));

  useEffect(() => {
    setDraftCustomUrl(questionOverride?.customUrl || '');
    setDraftTitleAr(questionOverride?.titleAr || '');
    setForceIframePreview(false);
    setIframeLoaded(false);
  }, [curriculum.id, questionNumber, questionOverride?.customUrl, questionOverride?.titleAr]);

  useEffect(() => {
    setDraftCount(String(totalQuestions));
  }, [totalQuestions]);

  // Keyboard Alt + Left/Right navigation between question pages
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.altKey) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (isEn) {
          if (questionNumber > 1) onSelectQuestion(questionNumber - 1);
        } else {
          if (questionNumber < totalQuestions) onSelectQuestion(questionNumber + 1);
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (isEn) {
          if (questionNumber < totalQuestions) onSelectQuestion(questionNumber + 1);
        } else {
          if (questionNumber > 1) onSelectQuestion(questionNumber - 1);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEn, questionNumber, totalQuestions, onSelectQuestion]);

  const primaryExpectedUrl = curriculum.primaryUrlTemplate.replace('{q}', String(questionNumber));
  const resolvedUrl =
    questionOverride?.customUrl?.trim() || probeResult?.resolvedUrl || primaryExpectedUrl;
  const repoSlug = extractRepoNameFromUrl(resolvedUrl);

  const knownTitle = curriculum.knownQuestionTitles?.[questionNumber];
  const displayQuestionTitle =
    (isEn ? questionOverride?.titleEn || questionOverride?.titleAr : questionOverride?.titleAr) ||
    probeResult?.liveTitle ||
    (knownTitle ? (isEn ? knownTitle.en : knownTitle.ar) : undefined) ||
    (isEn
      ? `Exam Structure Question ${questionNumber} — Dedicated Interactive Page`
      : `صفحة السؤال الوزاري رقم ${questionNumber} — تدريبات الهيكل المحلولة`);

  const handleCopy = async (text: string, type: 'repo' | 'url' | 'share') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(type);
      window.setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // Clipboard fallback ignored cleanly
    }
  };

  const buildShareLinkForCurrentQuestion = () => {
    if (typeof window === 'undefined') return '';
    const u = new URL(`${window.location.origin}${window.location.pathname}`);
    u.searchParams.set('year', curriculum.year);
    u.searchParams.set('term', curriculum.term);
    u.searchParams.set('curriculum', curriculum.id);
    u.searchParams.set('q', String(questionNumber));
    return u.toString();
  };

  const allNumbers = Array.from({ length: totalQuestions }, (_, i) => i + 1);
  const filteredSidebarNumbers = allNumbers.filter((n) => {
    if (sidebarFilter === 'live') return curriculumProbes[n]?.status === 'live';
    if (sidebarFilter === 'done') return completedQuestions.includes(n);
    if (sidebarFilter === 'saved') return bookmarkedQuestions.includes(n);
    return true;
  });

  const mcqNums = filteredSidebarNumbers.filter((n) => n <= curriculum.mcqQuestionsEnd);
  const paperNums = filteredSidebarNumbers.filter((n) => n > curriculum.mcqQuestionsEnd);

  const liveQuestionNumbers = allNumbers.filter((n) => curriculumProbes[n]?.status === 'live');
  const isChecking = !probeResult || probeResult.status === 'checking' || probeResult.status === 'idle';
  const isLive = probeResult?.status === 'live' || Boolean(questionOverride?.customUrl?.trim());
  const shouldRenderIframe = isLive || forceIframePreview;

  const PrevChevron = isEn ? ChevronLeft : ChevronRight;
  const NextChevron = isEn ? ChevronRight : ChevronLeft;
  const BackArrow = isEn ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-4">
      {/* Contextual Hierarchy Navigator Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 transition-colors">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onBackToHub}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <BackArrow className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
            <span>{isEn ? 'All Curricula' : 'جميع المناهج'}</span>
          </button>

          {/* Year Select */}
          <select
            aria-label={isEn ? 'Select Year' : 'السنة الدراسية'}
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value as AcademicYear)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 focus:border-amber-500 focus:outline-none tabular-nums cursor-pointer"
          >
            {ACADEMIC_YEARS.map((yr) => (
              <option key={yr.id} value={yr.id}>
                {isEn ? yr.labelEn : yr.labelAr}
              </option>
            ))}
          </select>

          {/* Term Select */}
          <select
            aria-label={isEn ? 'Select Term' : 'الفصل الدراسي'}
            value={selectedTerm}
            onChange={(e) => onTermChange(e.target.value as TermId)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 focus:border-amber-500 focus:outline-none cursor-pointer"
          >
            {TERMS.map((t) => (
              <option key={t.id} value={t.id}>
                {isEn ? t.labelEn : t.labelAr}
              </option>
            ))}
          </select>

          {/* Subject / Curriculum Select */}
          <select
            aria-label={isEn ? 'Select Subject Structure' : 'اختر المنهج والمادة'}
            value={curriculum.id}
            onChange={(e) => onSelectCurriculum(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-xs font-extrabold text-slate-900 dark:text-amber-300 focus:border-amber-500 focus:outline-none max-w-[260px] truncate cursor-pointer"
          >
            {curriculaForSelection.map((c) => (
              <option key={c.id} value={c.id}>
                {isEn ? c.titleEn : c.titleAr}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {sidebarOpen ? (
              <PanelRightClose className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
            ) : (
              <PanelRightOpen className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
            )}
            <span>{isEn ? 'Questions Index' : 'فهرس الأسئلة'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            className="inline-flex items-center justify-center w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <Moon className="w-3.5 h-3.5" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={onToggleLanguage}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
            <span>{isEn ? 'العربية' : 'EN'}</span>
          </button>
        </div>
      </div>

      {/* Main Split Workspace: Sidebar Index + Dedicated Question Page Stage */}
      <div
        className={
          isFullscreenStage
            ? 'fixed inset-0 z-50 bg-[#f8fafc] dark:bg-[#090d16] p-3 sm:p-4 overflow-y-auto'
            : 'grid grid-cols-1 lg:grid-cols-12 gap-5 items-start'
        }
      >
        {/* Question Pages Index Sidebar */}
        {sidebarOpen && !isFullscreenStage && (
          <aside
            aria-label={isEn ? 'Question Pages List' : 'قائمة صفحات الأسئلة'}
            className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-4 lg:sticky lg:top-20 transition-colors"
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {isEn ? 'Question Pages' : 'صفحات الأسئلة'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                  {isEn
                    ? `${completedQuestions.length} of ${totalQuestions} completed`
                    : `مكتمل ${completedQuestions.length} من ${totalQuestions} صفحة`}
                </p>
              </div>

              <button
                type="button"
                onClick={onScanEntireCurriculum}
                disabled={isScanningCurriculum}
                title={isEn ? 'Check live published status' : 'فحص الصفحات المنشورة'}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 text-amber-500 ${isScanningCurriculum ? 'animate-spin' : ''}`}
                  aria-hidden="true"
                />
                <span>{isEn ? 'Scan' : 'فحص'}</span>
              </button>
            </div>

            {/* Sidebar Filter Segmented Buttons */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-xl text-[11px] font-bold">
              {(
                [
                  { id: 'all', ar: 'الكل', en: 'All' },
                  { id: 'live', ar: 'متاح', en: 'Live' },
                  { id: 'done', ar: 'مكتمل', en: 'Done' },
                  { id: 'saved', ar: 'محفوظ', en: 'Saved' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSidebarFilter(tab.id)}
                  className={`py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    sidebarFilter === tab.id
                      ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {isEn ? tab.en : tab.ar}
                </button>
              ))}
            </div>

            {/* Scrollable Question Pages List */}
            <div className="max-h-[52vh] overflow-y-auto space-y-4 pe-1">
              {filteredSidebarNumbers.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-6">
                  {isEn ? 'No question pages in this filter.' : 'لا توجد صفحات أسئلة ضمن هذا التصنيف.'}
                </p>
              ) : (
                <>
                  {mcqNums.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 px-1">
                        {isEn
                          ? `Part 1 · Multiple Choice (01 – ${curriculum.mcqQuestionsEnd})`
                          : `القسم الأول · الأسئلة الموضوعية (01 – ${curriculum.mcqQuestionsEnd})`}
                      </div>
                      <div className="space-y-1">
                        {mcqNums.map((qNum) => {
                          const active = qNum === questionNumber;
                          const done = completedQuestions.includes(qNum);
                          const saved = bookmarkedQuestions.includes(qNum);
                          const qProbe = curriculumProbes[qNum];
                          const qKnown = curriculum.knownQuestionTitles?.[qNum];
                          const subLabel =
                            qProbe?.liveTitle ||
                            (qKnown ? (isEn ? qKnown.en : qKnown.ar) : undefined);

                          return (
                            <button
                              key={qNum}
                              type="button"
                              onClick={() => onSelectQuestion(qNum)}
                              className={`w-full text-start px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                                active
                                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow-xs'
                                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                              }`}
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-bold tabular-nums shrink-0">
                                    Q{String(qNum).padStart(2, '0')}
                                  </span>
                                  <span className="truncate">
                                    {subLabel ||
                                      (isEn ? `Question ${qNum} Page` : `صفحة السؤال ${qNum}`)}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 shrink-0 text-[11px]">
                                {qProbe?.status === 'live' && !active && (
                                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                                    {isEn ? 'Live' : 'متاح'}
                                  </span>
                                )}
                                {saved && (
                                  <Bookmark
                                    className={`w-3.5 h-3.5 ${
                                      active
                                        ? 'text-slate-950 fill-slate-950'
                                        : 'text-amber-500 fill-amber-500'
                                    }`}
                                    aria-hidden="true"
                                  />
                                )}
                                {done && (
                                  <CheckCircle2
                                    className={`w-3.5 h-3.5 ${
                                      active
                                        ? 'text-slate-950'
                                        : 'text-emerald-600 dark:text-emerald-400'
                                    }`}
                                    aria-hidden="true"
                                  />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {paperNums.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 px-1 tabular-nums">
                        {isEn
                          ? `Part 2 · Written / FRQ (${curriculum.mcqQuestionsEnd + 1} – ${totalQuestions})`
                          : `القسم الثاني · الأسئلة المقالية (${curriculum.mcqQuestionsEnd + 1} – ${totalQuestions})`}
                      </div>
                      <div className="space-y-1">
                        {paperNums.map((qNum) => {
                          const active = qNum === questionNumber;
                          const done = completedQuestions.includes(qNum);
                          const saved = bookmarkedQuestions.includes(qNum);
                          const qProbe = curriculumProbes[qNum];

                          return (
                            <button
                              key={qNum}
                              type="button"
                              onClick={() => onSelectQuestion(qNum)}
                              className={`w-full text-start px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                                active
                                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow-xs'
                                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="font-mono font-bold tabular-nums shrink-0">
                                  Q{String(qNum).padStart(2, '0')}
                                </span>
                                <span className="truncate">
                                  {qProbe?.liveTitle ||
                                    (isEn ? `Written Question ${qNum}` : `صفحة السؤال المقالي ${qNum}`)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 shrink-0 text-[11px]">
                                {qProbe?.status === 'live' && !active && (
                                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                                    {isEn ? 'Live' : 'متاح'}
                                  </span>
                                )}
                                {saved && (
                                  <Bookmark
                                    className={`w-3.5 h-3.5 ${
                                      active
                                        ? 'text-slate-950 fill-slate-950'
                                        : 'text-amber-500 fill-amber-500'
                                    }`}
                                    aria-hidden="true"
                                  />
                                )}
                                {done && (
                                  <CheckCircle2
                                    className={`w-3.5 h-3.5 ${
                                      active
                                        ? 'text-slate-950'
                                        : 'text-emerald-600 dark:text-emerald-400'
                                    }`}
                                    aria-hidden="true"
                                  />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Adjust Total Question Pages inline */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowCountEditor((v) => !v)}
                className="w-full flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 py-1 cursor-pointer"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Settings2 className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
                  <span>{isEn ? 'Configure Question Count' : 'ضبط عدد أسئلة الهيكل'}</span>
                </span>
                <span className="font-mono tabular-nums">{totalQuestions}</span>
              </button>

              {showCountEditor && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const parsed = Math.max(1, Math.min(50, Number(draftCount) || 25));
                    onUpdateTotalQuestions(curriculum.id, parsed);
                    setShowCountEditor(false);
                  }}
                  className="mt-2 flex items-center gap-2"
                >
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={draftCount}
                    onChange={(e) => setDraftCount(e.target.value)}
                    className="w-20 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono tabular-nums focus:border-amber-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="flex-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-bold hover:from-amber-600 hover:to-orange-600 transition-colors cursor-pointer"
                  >
                    {isEn ? 'Save' : 'حفظ العدد'}
                  </button>
                </form>
              )}
            </div>
          </aside>
        )}

        {/* Dedicated Single-Question Page Stage */}
        <div
          className={`${
            sidebarOpen && !isFullscreenStage ? 'lg:col-span-9' : 'lg:col-span-12'
          } space-y-4`}
        >
          {/* Question Page Card Container */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-colors">
            {/* Dedicated Page Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1.5 min-w-0">
                  {/* Unboxed Metadata Kicker */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      {isEn
                        ? `Question Page ${String(questionNumber).padStart(2, '0')} of ${totalQuestions}`
                        : `صفحة السؤال ${String(questionNumber).padStart(2, '0')} من ${totalQuestions}`}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {questionNumber <= curriculum.mcqQuestionsEnd
                        ? isEn
                          ? 'Multiple Choice (MCQ)'
                          : 'سؤال موضوعي (اختيار من متعدد)'
                        : isEn
                        ? 'Written Paper (FRQ)'
                        : 'سؤال مقالي (ورقي)'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{getGradeLabel(curriculum.grade, language)}</span>
                    <span aria-hidden="true">·</span>
                    <span>{getStreamLabel(curriculum.stream, language)}</span>
                    <span aria-hidden="true">·</span>
                    <span>{getTermLabel(curriculum.term, language)}</span>
                  </div>

                  <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
                    {displayQuestionTitle}
                  </h1>
                </div>

                {/* Prev / Next Question Page Navigation */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={questionNumber <= 1}
                    onClick={() => onSelectQuestion(questionNumber - 1)}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <PrevChevron className="w-4 h-4" aria-hidden="true" />
                    <span>{isEn ? 'Previous' : 'السؤال السابق'}</span>
                  </button>

                  <button
                    type="button"
                    disabled={questionNumber >= totalQuestions}
                    onClick={() => onSelectQuestion(questionNumber + 1)}
                    className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 text-xs font-bold shadow-xs disabled:opacity-40 disabled:pointer-events-none transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>{isEn ? 'Next Question' : 'السؤال التالي'}</span>
                    <NextChevron className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Secondary Question Page Action Strip */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onToggleCompleted(questionNumber)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-700 dark:text-emerald-300'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>
                      {isCompleted
                        ? isEn
                          ? 'Completed'
                          : 'تمت المراجعة'
                        : isEn
                        ? 'Mark Done'
                        : 'تحديد كمكتمل'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleBookmarked(questionNumber)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isBookmarked
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-800 dark:text-amber-300'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Bookmark
                      className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`}
                      aria-hidden="true"
                    />
                    <span>
                      {isBookmarked
                        ? isEn
                          ? 'Bookmarked'
                          : 'محفوظ للمراجعة'
                        : isEn
                        ? 'Bookmark'
                        : 'حفظ للمراجعة'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowNotesPanel((v) => !v)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      showNotesPanel || noteText.trim()
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-800 dark:text-amber-300'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <FileEdit className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{isEn ? 'My Notes' : 'ملاحظات السؤال'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowLinkEditor((v) => !v)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Link2 className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
                    <span>{isEn ? 'Link Settings' : 'رابط الصفحة'}</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(buildShareLinkForCurrentQuestion(), 'share')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {copiedField === 'share' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
                    )}
                    <span>
                      {copiedField === 'share'
                        ? isEn
                          ? 'Copied'
                          : 'تم النسخ'
                        : isEn
                        ? 'Copy Link'
                        : 'مشاركة السؤال'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIframeLoaded(false);
                      setIframeReloadNonce((n) => n + 1);
                      onReprobeQuestion(questionNumber);
                    }}
                    title={isEn ? 'Reload Question Page' : 'إعادة تحميل صفحة السؤال'}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsFullscreenStage((v) => !v)}
                    title={isEn ? 'Toggle Fullscreen View' : 'تبديل وضع ملء الشاشة'}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    {isFullscreenStage ? (
                      <Minimize2 className="w-3.5 h-3.5" aria-hidden="true" />
                    ) : (
                      <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
                    )}
                  </button>

                  <a
                    href={resolvedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-amber-500/20 dark:border dark:border-amber-500/40 text-amber-400 dark:text-amber-300 text-xs font-bold hover:bg-slate-800 dark:hover:bg-amber-500/30 transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>{isEn ? 'Open Direct' : 'فتح مستقل'}</span>
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>

              {/* Collapsible Personal Scratchpad Notes */}
              {showNotesPanel && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <label
                    htmlFor="question-notes-textarea"
                    className="block text-xs font-bold text-slate-700 dark:text-slate-300"
                  >
                    {isEn
                      ? `Personal Study Notes for Question ${questionNumber} (auto-saved):`
                      : `ملاحظاتك الخاصة على السؤال ${questionNumber} (تُحفظ تلقائياً):`}
                  </label>
                  <textarea
                    id="question-notes-textarea"
                    rows={3}
                    value={noteText}
                    onChange={(e) => onChangeNote(e.target.value)}
                    placeholder={
                      isEn
                        ? 'Write key formulas, common pitfalls, or solution reminders for this question...'
                        : 'اكتب القوانين المهمة أو خطوات الحل أو النقاط التي تود تذكرها في هذا السؤال...'
                    }
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-900 focus:border-amber-500 focus:outline-none p-3 text-xs text-slate-900 dark:text-slate-100 leading-relaxed"
                  />
                </div>
              )}

              {/* Collapsible Per-Question URL / Title Customizer */}
              {showLinkEditor && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    onSaveQuestionOverride(curriculum.id, questionNumber, {
                      customUrl: draftCustomUrl.trim() || undefined,
                      titleAr: draftTitleAr.trim() || undefined,
                    });
                    setShowLinkEditor(false);
                  }}
                  className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-3 items-end"
                >
                  <div className="md:col-span-6 space-y-1">
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
                      {isEn
                        ? `Custom URL for Question ${questionNumber} (leave empty for standard pattern)`
                        : `رابط مخصص لصفحة السؤال ${questionNumber} (اتركه فارغاً لاستخدام الرابط القياسي تلقائياً)`}
                    </label>
                    <input
                      type="url"
                      dir="ltr"
                      value={draftCustomUrl}
                      onChange={(e) => setDraftCustomUrl(e.target.value)}
                      placeholder={primaryExpectedUrl}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-slate-100 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-4 space-y-1">
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
                      {isEn ? 'Custom Question Topic Title' : 'عنوان مخصص لموضوع السؤال (اختياري)'}
                    </label>
                    <input
                      type="text"
                      value={draftTitleAr}
                      onChange={(e) => setDraftTitleAr(e.target.value)}
                      placeholder={isEn ? 'e.g. Gauss Law Applications' : 'مثال: تطبيقات قانون جاوس'}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2 flex items-center gap-2">
                    <button
                      type="submit"
                      className="w-full px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-bold hover:from-amber-600 hover:to-orange-600 transition-colors cursor-pointer"
                    >
                      {isEn ? 'Save' : 'حفظ'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Question Page Stage Body */}
            <div className="relative bg-slate-50 dark:bg-[#0a101d]">
              {isChecking ? (
                <div className="h-[68vh] min-h-[520px] flex items-center justify-center">
                  <OrbitalStructureLoader
                    variant="stage"
                    language={language}
                    label={
                      isEn
                        ? `Loading Question ${questionNumber} interactive page...`
                        : `جاري تحميل صفحة السؤال ${questionNumber}...`
                    }
                  />
                </div>
              ) : shouldRenderIframe ? (
                <div className="relative w-full">
                  {!iframeLoaded && (
                    <div className="absolute inset-0 z-10 bg-slate-50 dark:bg-[#0a101d] flex items-center justify-center pointer-events-none">
                      <OrbitalStructureLoader
                        variant="stage"
                        language={language}
                        label={
                          isEn
                            ? `Opening Question ${questionNumber}...`
                            : `جاري فتح صفحة السؤال ${questionNumber}...`
                        }
                      />
                    </div>
                  )}
                  <iframe
                    key={`${curriculum.id}-${questionNumber}-${iframeReloadNonce}`}
                    src={resolvedUrl}
                    title={displayQuestionTitle}
                    onLoad={() => setIframeLoaded(true)}
                    allow="clipboard-write; fullscreen"
                    className={`w-full border-0 bg-white ${
                      isFullscreenStage ? 'h-[calc(100vh-190px)] min-h-[580px]' : 'h-[76vh] min-h-[620px]'
                    }`}
                  />
                </div>
              ) : (
                /* Clean Pending Upload View when GitHub Pages repo Q{n} is not yet published */
                <div className="min-h-[520px] p-6 sm:p-10 flex items-center justify-center">
                  <div className="max-w-2xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-amber-600 dark:text-amber-400">
                        {isEn
                          ? `Question ${questionNumber} Page · Scheduled for Upload`
                          : `صفحة السؤال ${questionNumber} · مجهزة للربط التلقائي فور النشر`}
                      </div>
                      <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                        {isEn
                          ? `${curriculum.titleEn} — Question ${questionNumber}`
                          : `${curriculum.titleAr} — صفحة السؤال ${questionNumber}`}
                      </h2>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {isEn
                          ? 'This dedicated question page follows the approved repository naming convention and activates automatically as soon as its GitHub Pages repository is published.'
                          : 'تم ربط هذه الصفحة مسبقاً بنظام التسمية المعتمد للمنصة، وستعمل تلقائياً داخل هذا الإطار بمجرد رفع مستودع السؤال على GitHub Pages دون الحاجة لأي تعديل برمجي.'}
                      </p>
                    </div>

                    {/* Quick Jump to Already Published Questions in this Curriculum */}
                    {liveQuestionNumbers.length > 0 && (
                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                        <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
                          {isEn
                            ? 'Available live question pages in this subject right now:'
                            : 'صفحات الأسئلة المنشورة والمتاحة للحل الآن في هذه المادة:'}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {liveQuestionNumbers.map((lq) => (
                            <button
                              key={lq}
                              type="button"
                              onClick={() => onSelectQuestion(lq)}
                              className="px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/35 text-amber-800 dark:text-amber-300 text-xs font-mono font-bold tabular-nums hover:bg-amber-500/25 transition-colors cursor-pointer"
                            >
                              Q{lq}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Teacher Repository & URL Helper Box */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        {isEn
                          ? 'Approved Repository Slug & Target URL:'
                          : 'بيانات المستودع والرابط المعتمد للنشر (Mr. Mohammed Hesham):'}
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                        <div className="min-w-0">
                          <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                            {isEn ? 'GitHub Repository Name:' : 'اسم المستودع المطلوب على GitHub:'}
                          </span>
                          <code
                            className="text-xs font-mono font-bold text-slate-900 dark:text-amber-300 break-all"
                            dir="ltr"
                          >
                            {repoSlug}
                          </code>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(repoSlug, 'repo')}
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          {copiedField === 'repo' ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
                          )}
                          <span>
                            {copiedField === 'repo'
                              ? isEn
                                ? 'Copied'
                                : 'تم النسخ'
                              : isEn
                              ? 'Copy Repo Name'
                              : 'نسخ اسم المستودع'}
                          </span>
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                        <div className="min-w-0">
                          <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                            {isEn ? 'Target Question Page URL:' : 'الرابط الكامل لصفحة السؤال:'}
                          </span>
                          <code
                            className="text-xs font-mono text-slate-700 dark:text-slate-300 break-all"
                            dir="ltr"
                          >
                            {resolvedUrl}
                          </code>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(resolvedUrl, 'url')}
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          {copiedField === 'url' ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
                          )}
                          <span>
                            {copiedField === 'url'
                              ? isEn
                                ? 'Copied'
                                : 'تم النسخ'
                              : isEn
                              ? 'Copy URL'
                              : 'نسخ الرابط'}
                          </span>
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5 pt-2">
                        <button
                          type="button"
                          onClick={() => onReprobeQuestion(questionNumber)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-bold hover:from-amber-600 hover:to-orange-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>{isEn ? 'Check Availability Now' : 'فحص النشر الآن'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowLinkEditor(true)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          <Link2 className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
                          <span>{isEn ? 'Set Custom Link' : 'تخصيص رابط بديل'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setForceIframePreview(true)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          <span>{isEn ? 'Open Frame Anyway' : 'عرض الإطار مباشرة'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Question Pages Pagination Strip */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 transition-colors">
              <button
                type="button"
                disabled={questionNumber <= 1}
                onClick={() => onSelectQuestion(questionNumber - 1)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <PrevChevron className="w-4 h-4" aria-hidden="true" />
                <span>{isEn ? 'Previous Page' : 'صفحة السؤال السابق'}</span>
              </button>

              <div className="flex items-center gap-1 overflow-x-auto max-w-full py-1 px-1">
                {allNumbers.map((num) => {
                  const active = num === questionNumber;
                  const done = completedQuestions.includes(num);
                  const live = curriculumProbes[num]?.status === 'live';

                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => onSelectQuestion(num)}
                      className={`min-w-[34px] h-8 px-2 rounded-lg text-xs font-mono font-bold tabular-nums transition-colors shrink-0 cursor-pointer border ${
                        active
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 border-amber-500 text-slate-950'
                          : done
                          ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/25'
                          : live
                          ? 'bg-amber-500/15 border-amber-500/35 text-amber-800 dark:text-amber-300 hover:bg-amber-500/25'
                          : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-amber-500/40'
                      }`}
                    >
                      {String(num).padStart(2, '0')}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                disabled={questionNumber >= totalQuestions}
                onClick={() => onSelectQuestion(questionNumber + 1)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 text-xs font-bold disabled:opacity-40 disabled:pointer-events-none transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>{isEn ? 'Next Page' : 'صفحة السؤال التالي'}</span>
                <NextChevron className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
