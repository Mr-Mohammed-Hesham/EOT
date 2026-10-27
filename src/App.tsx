import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AcademicYear,
  AppView,
  CurriculumCustomizationStore,
  EotCurriculum,
  GradeId,
  Language,
  QuestionMetaOverride,
  QuestionProbeResult,
  StreamId,
  StudentProgressStore,
  SubjectId,
  TermId,
  ThemeMode,
} from './types/eot';
import {
  buildAllStandardCurricula,
  buildQuestionCandidateUrls,
  normalizeGradeParam,
  normalizeStreamParam,
  normalizeSubjectParam,
  normalizeTermParam,
  normalizeYearParam,
} from './data/eotCurricula';
import {
  loadCustomizations,
  loadInitialTheme,
  loadStudentProgress,
  saveCustomizations,
  saveStudentProgress,
  saveThemePreference,
} from './services/storageService';
import { probeCurriculumBatch, probeQuestionUrls } from './services/urlProbeService';
import { TopNavbar } from './components/TopNavbar';
import { CurriculaHubView } from './components/CurriculaHubView';
import { QuestionWorkspaceView } from './components/QuestionWorkspaceView';
import { StructuresMatrixView } from './components/StructuresMatrixView';
import { CustomCurriculumModal } from './components/CustomCurriculumModal';
import { Footer } from './components/Footer';

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>(() => loadInitialTheme());
  const [customizations, setCustomizations] = useState<CurriculumCustomizationStore>(() =>
    loadCustomizations()
  );
  const [progress, setProgress] = useState<StudentProgressStore>(() => loadStudentProgress());

  const standardCurricula = useMemo(() => buildAllStandardCurricula(), []);
  const allCurricula = useMemo(
    () => [...standardCurricula, ...customizations.customCurricula],
    [standardCurricula, customizations.customCurricula]
  );

  // Parse initial URL query parameters for standalone direct sharing
  const initialUrlState = useMemo(() => {
    if (typeof window === 'undefined') {
      return {
        lang: 'ar' as Language,
        year: '2026' as AcademicYear,
        term: 'T1' as TermId,
        grade: 'all' as GradeId | 'all',
        stream: 'all' as StreamId | 'all',
        subject: 'all' as SubjectId | 'all',
        view: 'hub' as AppView,
        curriculumId: '12-adv-bri-phy-t1-2026',
        question: 1,
      };
    }

    const params = new URLSearchParams(window.location.search);
    const lang: Language = params.get('lang') === 'en' ? 'en' : 'ar';
    const year = normalizeYearParam(params.get('year')) || '2026';
    const term = normalizeTermParam(params.get('term')) || 'T1';
    const grade = normalizeGradeParam(params.get('grade'));
    const stream = normalizeStreamParam(params.get('stream'));
    const subject = normalizeSubjectParam(params.get('subject'));
    const explicitCurriculumId = params.get('curriculum');
    const qParam = Number(params.get('q'));
    const question = Number.isFinite(qParam) && qParam >= 1 ? Math.floor(qParam) : 1;

    let matchedCurriculum: EotCurriculum | undefined;
    if (explicitCurriculumId) {
      matchedCurriculum = allCurricula.find((c) => c.id === explicitCurriculumId);
    }
    if (!matchedCurriculum && (grade || stream || subject)) {
      matchedCurriculum = allCurricula.find(
        (c) =>
          c.year === year &&
          c.term === term &&
          (!grade || c.grade === grade) &&
          (!stream || c.stream === stream) &&
          (!subject || c.subject === subject)
      );
    }

    const shouldOpenWorkspaceDirectly =
      Boolean(explicitCurriculumId) ||
      Boolean(params.get('q')) ||
      Boolean(grade && subject && matchedCurriculum);

    return {
      lang,
      year: matchedCurriculum?.year || year,
      term: matchedCurriculum?.term || term,
      grade: (grade || 'all') as GradeId | 'all',
      stream: (stream || 'all') as StreamId | 'all',
      subject: (subject || 'all') as SubjectId | 'all',
      view: (shouldOpenWorkspaceDirectly ? 'workspace' : 'hub') as AppView,
      curriculumId: matchedCurriculum?.id || '12-adv-bri-phy-t1-2026',
      question,
    };
  }, [allCurricula]);

  const [language, setLanguage] = useState<Language>(initialUrlState.lang);
  const [activeView, setActiveView] = useState<AppView>(initialUrlState.view);

  // Hierarchy Filters
  const [selectedYear, setSelectedYear] = useState<AcademicYear>(initialUrlState.year);
  const [selectedTerm, setSelectedTerm] = useState<TermId>(initialUrlState.term);
  const [selectedGrade, setSelectedGrade] = useState<GradeId | 'all'>(initialUrlState.grade);
  const [selectedStream, setSelectedStream] = useState<StreamId | 'all'>(initialUrlState.stream);
  const [selectedSubject, setSelectedSubject] = useState<SubjectId | 'all'>(
    initialUrlState.subject
  );
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active Question Workspace State
  const [activeCurriculumId, setActiveCurriculumId] = useState<string>(
    initialUrlState.curriculumId
  );
  const [activeQuestionNumber, setActiveQuestionNumber] = useState<number>(
    initialUrlState.question
  );

  // Live URL Probe Results Map: curriculumId -> { [q]: QuestionProbeResult }
  const [probeMap, setProbeMap] = useState<Record<string, Record<number, QuestionProbeResult>>>({});
  const [isScanningCurriculum, setIsScanningCurriculum] = useState<boolean>(false);
  const [isScanningAll, setIsScanningAll] = useState<boolean>(false);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);

  // Sync HTML dir/lang & dark mode class
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveThemePreference(theme);
  }, [theme]);

  useEffect(() => {
    saveStudentProgress(progress);
  }, [progress]);

  useEffect(() => {
    saveCustomizations(customizations);
  }, [customizations]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const getTotalQuestions = useCallback(
    (curriculum: EotCurriculum): number => {
      return (
        customizations.totalQuestionsByCurriculum[curriculum.id] ||
        curriculum.defaultTotalQuestions
      );
    },
    [customizations.totalQuestionsByCurriculum]
  );

  const getCandidateUrlsFor = useCallback(
    (curriculum: EotCurriculum, q: number): string[] => {
      const override = customizations.questionOverrides[`${curriculum.id}__Q${q}`];
      return buildQuestionCandidateUrls(curriculum, q, override?.customUrl);
    },
    [customizations.questionOverrides]
  );

  const curriculaForYearAndTerm = useMemo(
    () => allCurricula.filter((c) => c.year === selectedYear && c.term === selectedTerm),
    [allCurricula, selectedYear, selectedTerm]
  );

  const filteredCurricula = useMemo(() => {
    return curriculaForYearAndTerm.filter((c) => {
      if (selectedGrade !== 'all' && c.grade !== selectedGrade) return false;
      if (selectedStream !== 'all' && c.stream !== selectedStream) return false;
      if (selectedSubject !== 'all' && c.subject !== selectedSubject) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const hay = `${c.titleAr} ${c.titleEn} ${c.subtitleAr} ${c.repoPrefixExample}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [
    curriculaForYearAndTerm,
    selectedGrade,
    selectedStream,
    selectedSubject,
    searchQuery,
  ]);

  const activeCurriculum = useMemo(() => {
    return (
      allCurricula.find((c) => c.id === activeCurriculumId) ||
      curriculaForYearAndTerm[0] ||
      allCurricula[0]
    );
  }, [allCurricula, activeCurriculumId, curriculaForYearAndTerm]);

  const probeSingleQuestion = useCallback(
    async (curriculum: EotCurriculum, q: number, force = false) => {
      setProbeMap((prev) => ({
        ...prev,
        [curriculum.id]: {
          ...(prev[curriculum.id] || {}),
          [q]: prev[curriculum.id]?.[q] || {
            status: 'checking',
            resolvedUrl: curriculum.primaryUrlTemplate.replace('{q}', String(q)),
          },
        },
      }));

      const result = await probeQuestionUrls(
        `${curriculum.id}__Q${q}`,
        getCandidateUrlsFor(curriculum, q),
        force
      );

      setProbeMap((prev) => ({
        ...prev,
        [curriculum.id]: {
          ...(prev[curriculum.id] || {}),
          [q]: result,
        },
      }));
    },
    [getCandidateUrlsFor]
  );

  // Initial background check of Q1 for visible 2026 T1 curricula + Q1..Q12 of 12Adv Physics Bridge
  useEffect(() => {
    let cancelled = false;
    const featured = allCurricula.find((c) => c.id === '12-adv-bri-phy-t1-2026');
    if (featured) {
      probeCurriculumBatch(
        featured.id,
        12,
        (q) => getCandidateUrlsFor(featured, q),
        (q, res) => {
          if (cancelled) return;
          setProbeMap((prev) => ({
            ...prev,
            [featured.id]: {
              ...(prev[featured.id] || {}),
              [q]: res,
            },
          }));
        }
      );
    }

    const others = allCurricula.filter(
      (c) => c.year === '2026' && c.term === 'T1' && c.id !== '12-adv-bri-phy-t1-2026'
    );
    others.forEach((curr) => {
      probeQuestionUrls(`${curr.id}__Q1`, getCandidateUrlsFor(curr, 1)).then((res) => {
        if (cancelled) return;
        setProbeMap((prev) => ({
          ...prev,
          [curr.id]: {
            ...(prev[curr.id] || {}),
            1: res,
          },
        }));
      });
    });

    return () => {
      cancelled = true;
    };
  }, [allCurricula, getCandidateUrlsFor]);

  // Probe active + next question when browsing workspace
  useEffect(() => {
    if (activeView !== 'workspace' || !activeCurriculum) return;
    const total = getTotalQuestions(activeCurriculum);
    probeSingleQuestion(activeCurriculum, activeQuestionNumber, false);
    if (activeQuestionNumber + 1 <= total) {
      probeSingleQuestion(activeCurriculum, activeQuestionNumber + 1, false);
    }
  }, [
    activeView,
    activeCurriculum,
    activeQuestionNumber,
    getTotalQuestions,
    probeSingleQuestion,
  ]);

  const handleOpenCurriculumQuestion = (curriculumId: string, qNumber: number) => {
    const target = allCurricula.find((c) => c.id === curriculumId);
    if (target) {
      setSelectedYear(target.year);
      setSelectedTerm(target.term);
    }
    setActiveCurriculumId(curriculumId);
    setActiveQuestionNumber(qNumber);
    setActiveView('workspace');

    setProgress((prev) => ({
      ...prev,
      lastVisited: { curriculumId, questionNumber: qNumber },
    }));

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectCurriculumInWorkspace = (curriculumId: string) => {
    setActiveCurriculumId(curriculumId);
    setActiveQuestionNumber(1);
  };

  const handleYearChangeInWorkspace = (yr: AcademicYear) => {
    setSelectedYear(yr);
    const matching = allCurricula.find(
      (c) =>
        c.year === yr &&
        c.term === selectedTerm &&
        c.grade === activeCurriculum.grade &&
        c.stream === activeCurriculum.stream &&
        c.subject === activeCurriculum.subject
    );
    if (matching) {
      setActiveCurriculumId(matching.id);
      setActiveQuestionNumber(1);
    }
  };

  const handleTermChangeInWorkspace = (tr: TermId) => {
    setSelectedTerm(tr);
    const matching = allCurricula.find(
      (c) =>
        c.year === selectedYear &&
        c.term === tr &&
        c.grade === activeCurriculum.grade &&
        c.stream === activeCurriculum.stream &&
        c.subject === activeCurriculum.subject
    );
    if (matching) {
      setActiveCurriculumId(matching.id);
      setActiveQuestionNumber(1);
    }
  };

  const handleScanEntireActiveCurriculum = async () => {
    if (!activeCurriculum || isScanningCurriculum) return;
    setIsScanningCurriculum(true);
    try {
      const total = getTotalQuestions(activeCurriculum);
      await probeCurriculumBatch(
        activeCurriculum.id,
        total,
        (q) => getCandidateUrlsFor(activeCurriculum, q),
        (q, res) => {
          setProbeMap((prev) => ({
            ...prev,
            [activeCurriculum.id]: {
              ...(prev[activeCurriculum.id] || {}),
              [q]: res,
            },
          }));
        },
        true
      );
    } finally {
      setIsScanningCurriculum(false);
    }
  };

  const handleScanAllCurricula = async () => {
    if (isScanningAll) return;
    setIsScanningAll(true);
    try {
      for (const curr of curriculaForYearAndTerm) {
        const checkLimit = Math.min(getTotalQuestions(curr), 15);
        await probeCurriculumBatch(
          curr.id,
          checkLimit,
          (q) => getCandidateUrlsFor(curr, q),
          (q, res) => {
            setProbeMap((prev) => ({
              ...prev,
              [curr.id]: {
                ...(prev[curr.id] || {}),
                [q]: res,
              },
            }));
          },
          true
        );
      }
    } finally {
      setIsScanningAll(false);
    }
  };

  const handleRefreshPlatform = async () => {
    if (activeView === 'workspace') {
      await handleScanEntireActiveCurriculum();
    } else {
      await handleScanAllCurricula();
    }
  };

  const handleToggleCompleted = (q: number) => {
    const cid = activeCurriculum.id;
    setProgress((prev) => {
      const list = prev.completed[cid] || [];
      const next = list.includes(q) ? list.filter((x) => x !== q) : [...list, q];
      return {
        ...prev,
        completed: { ...prev.completed, [cid]: next },
      };
    });
  };

  const handleToggleBookmarked = (q: number) => {
    const cid = activeCurriculum.id;
    setProgress((prev) => {
      const list = prev.bookmarked[cid] || [];
      const next = list.includes(q) ? list.filter((x) => x !== q) : [...list, q];
      return {
        ...prev,
        bookmarked: { ...prev.bookmarked, [cid]: next },
      };
    });
  };

  const handleChangeNote = (text: string) => {
    const key = `${activeCurriculum.id}__Q${activeQuestionNumber}`;
    setProgress((prev) => ({
      ...prev,
      notes: { ...prev.notes, [key]: text },
    }));
  };

  const handleUpdateTotalQuestions = (curriculumId: string, count: number) => {
    setCustomizations((prev) => ({
      ...prev,
      totalQuestionsByCurriculum: {
        ...prev.totalQuestionsByCurriculum,
        [curriculumId]: count,
      },
    }));
    if (activeQuestionNumber > count) {
      setActiveQuestionNumber(count);
    }
  };

  const handleSaveQuestionOverride = (
    curriculumId: string,
    q: number,
    override: QuestionMetaOverride
  ) => {
    const key = `${curriculumId}__Q${q}`;
    setCustomizations((prev) => ({
      ...prev,
      questionOverrides: {
        ...prev.questionOverrides,
        [key]: override,
      },
    }));
    const curr = allCurricula.find((c) => c.id === curriculumId);
    if (curr) {
      window.setTimeout(() => probeSingleQuestion(curr, q, true), 50);
    }
  };

  const handleAddCustomCurriculum = (item: EotCurriculum) => {
    setCustomizations((prev) => ({
      ...prev,
      customCurricula: [...prev.customCurricula, item],
    }));
    setSelectedYear(item.year);
    setSelectedTerm(item.term);
    setActiveCurriculumId(item.id);
    setActiveQuestionNumber(1);
    setActiveView('workspace');
  };

  const handleDeleteCustomCurriculum = (id: string) => {
    setCustomizations((prev) => ({
      ...prev,
      customCurricula: prev.customCurricula.filter((c) => c.id !== id),
    }));
  };

  const handleResetFilters = () => {
    setSelectedYear('2026');
    setSelectedTerm('T1');
    setSelectedGrade('all');
    setSelectedStream('all');
    setSelectedSubject('all');
    setSearchQuery('');
  };

  const activeTotalQ = getTotalQuestions(activeCurriculum);
  const activeCompletedList = progress.completed[activeCurriculum.id] || [];
  const activeBookmarkedList = progress.bookmarked[activeCurriculum.id] || [];
  const activeNote = progress.notes[`${activeCurriculum.id}__Q${activeQuestionNumber}`] || '';
  const activeOverride =
    customizations.questionOverrides[`${activeCurriculum.id}__Q${activeQuestionNumber}`];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#090d16] text-[#0f172a] dark:text-[#f1f5f9] transition-colors">
      <TopNavbar
        activeView={activeView}
        onSelectView={setActiveView}
        onOpenAddModal={() => setAddModalOpen(true)}
        onRefreshPlatform={handleRefreshPlatform}
        isRefreshing={isScanningAll || isScanningCurriculum}
        language={language}
      />

      <main className="flex-1 max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeView === 'hub' && (
          <CurriculaHubView
            curricula={filteredCurricula}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            selectedTerm={selectedTerm}
            onTermChange={setSelectedTerm}
            selectedGrade={selectedGrade}
            onGradeChange={setSelectedGrade}
            selectedStream={selectedStream}
            onStreamChange={setSelectedStream}
            selectedSubject={selectedSubject}
            onSubjectChange={setSelectedSubject}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onResetFilters={handleResetFilters}
            onOpenCurriculumQuestion={handleOpenCurriculumQuestion}
            getTotalQuestions={getTotalQuestions}
            completedMap={progress.completed}
            probeMap={probeMap}
            isSyncing={isScanningAll || isScanningCurriculum}
            language={language}
            onToggleLanguage={() => setLanguage((l) => (l === 'ar' ? 'en' : 'ar'))}
            theme={theme}
            onToggleTheme={toggleTheme}
            onOpenAddCurriculumModal={() => setAddModalOpen(true)}
          />
        )}

        {activeView === 'workspace' && (
          <QuestionWorkspaceView
            curriculum={activeCurriculum}
            curriculaForSelection={
              curriculaForYearAndTerm.length > 0 ? curriculaForYearAndTerm : allCurricula
            }
            selectedYear={selectedYear}
            onYearChange={handleYearChangeInWorkspace}
            selectedTerm={selectedTerm}
            onTermChange={handleTermChangeInWorkspace}
            onSelectCurriculum={handleSelectCurriculumInWorkspace}
            questionNumber={activeQuestionNumber}
            totalQuestions={activeTotalQ}
            onSelectQuestion={setActiveQuestionNumber}
            onUpdateTotalQuestions={handleUpdateTotalQuestions}
            questionOverride={activeOverride}
            onSaveQuestionOverride={handleSaveQuestionOverride}
            probeResult={probeMap[activeCurriculum.id]?.[activeQuestionNumber]}
            curriculumProbes={probeMap[activeCurriculum.id] || {}}
            isScanningCurriculum={isScanningCurriculum}
            onReprobeQuestion={(q) => probeSingleQuestion(activeCurriculum, q, true)}
            onScanEntireCurriculum={handleScanEntireActiveCurriculum}
            isCompleted={activeCompletedList.includes(activeQuestionNumber)}
            completedQuestions={activeCompletedList}
            onToggleCompleted={handleToggleCompleted}
            isBookmarked={activeBookmarkedList.includes(activeQuestionNumber)}
            bookmarkedQuestions={activeBookmarkedList}
            onToggleBookmarked={handleToggleBookmarked}
            noteText={activeNote}
            onChangeNote={handleChangeNote}
            onBackToHub={() => setActiveView('hub')}
            language={language}
            onToggleLanguage={() => setLanguage((l) => (l === 'ar' ? 'en' : 'ar'))}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        )}

        {activeView === 'matrix' && (
          <StructuresMatrixView
            curricula={curriculaForYearAndTerm}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            selectedTerm={selectedTerm}
            onTermChange={setSelectedTerm}
            getTotalQuestions={getTotalQuestions}
            completedMap={progress.completed}
            probeMap={probeMap}
            isScanningAll={isScanningAll}
            onScanAllCurricula={handleScanAllCurricula}
            onOpenCurriculumQuestion={handleOpenCurriculumQuestion}
            language={language}
          />
        )}
      </main>

      <Footer language={language} />

      <CustomCurriculumModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        customCurricula={customizations.customCurricula}
        onAddCurriculum={handleAddCustomCurriculum}
        onDeleteCustomCurriculum={handleDeleteCustomCurriculum}
        language={language}
      />
    </div>
  );
}
