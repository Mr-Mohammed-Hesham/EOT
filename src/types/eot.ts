export type Language = 'ar' | 'en';

export type ThemeMode = 'light' | 'dark';

export type AcademicYear = '2026' | '2025' | '2027';

export type TermId = 'T1' | 'T2' | 'T3';

export type GradeId = '12' | '11' | '10';

export type StreamId = 'adv_bridge' | 'adv_inspire' | 'general';

export type SubjectId = 'physics' | 'math';

export type AppView = 'hub' | 'workspace' | 'matrix';

export interface QuestionMetaOverride {
  customUrl?: string;
  titleAr?: string;
  titleEn?: string;
}

export interface EotCurriculum {
  id: string;
  year: AcademicYear;
  term: TermId;
  grade: GradeId;
  stream: StreamId;
  subject: SubjectId;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  repoPrefixExample: string;
  /** Primary URL pattern containing `{q}` placeholder */
  primaryUrlTemplate: string;
  /** Secondary fallback patterns tested automatically if primary returns 404 */
  fallbackUrlTemplates: string[];
  defaultTotalQuestions: number;
  mcqQuestionsEnd: number;
  knownQuestionTitles?: Record<
    number,
    {
      ar: string;
      en: string;
    }
  >;
  isCustom?: boolean;
}

export type ProbeStatus = 'idle' | 'checking' | 'live' | 'pending';

export interface QuestionProbeResult {
  status: ProbeStatus;
  resolvedUrl: string;
  liveTitle?: string;
  checkedAt?: number;
}

export interface StudentProgressStore {
  completed: Record<string, number[]>;
  bookmarked: Record<string, number[]>;
  notes: Record<string, string>;
  lastVisited?: {
    curriculumId: string;
    questionNumber: number;
  };
}

export interface CurriculumCustomizationStore {
  totalQuestionsByCurriculum: Record<string, number>;
  questionOverrides: Record<string, QuestionMetaOverride>;
  customCurricula: EotCurriculum[];
}
