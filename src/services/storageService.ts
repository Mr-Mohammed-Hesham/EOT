import {
  CurriculumCustomizationStore,
  StudentProgressStore,
  ThemeMode,
} from '../types/eot';

const PROGRESS_STORAGE_KEY = 'mmh_eot_structures_progress_v1';
const CUSTOM_STORAGE_KEY = 'mmh_eot_structures_custom_v1';
const THEME_STORAGE_KEY = 'mmh_theme';

const DEFAULT_PROGRESS: StudentProgressStore = {
  completed: {},
  bookmarked: {},
  notes: {},
};

const DEFAULT_CUSTOM: CurriculumCustomizationStore = {
  totalQuestionsByCurriculum: {},
  questionOverrides: {},
  customCurricula: [],
};

export function loadInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  } catch {
    // Ignore storage errors
  }
  return 'light';
}

export function saveThemePreference(theme: ThemeMode): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore storage errors
  }
}

export function loadStudentProgress(): StudentProgressStore {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      completed: parsed.completed || {},
      bookmarked: parsed.bookmarked || {},
      notes: parsed.notes || {},
      lastVisited: parsed.lastVisited,
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveStudentProgress(store: StudentProgressStore): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Ignore storage quota errors
  }
}

export function loadCustomizations(): CurriculumCustomizationStore {
  if (typeof window === 'undefined') return DEFAULT_CUSTOM;
  try {
    const raw = window.localStorage.getItem(CUSTOM_STORAGE_KEY);
    if (!raw) return DEFAULT_CUSTOM;
    const parsed = JSON.parse(raw);
    return {
      totalQuestionsByCurriculum: parsed.totalQuestionsByCurriculum || {},
      questionOverrides: parsed.questionOverrides || {},
      customCurricula: Array.isArray(parsed.customCurricula) ? parsed.customCurricula : [],
    };
  } catch {
    return DEFAULT_CUSTOM;
  }
}

export function saveCustomizations(store: CurriculumCustomizationStore): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CUSTOM_STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Ignore storage quota errors
  }
}
