import {
  AcademicYear,
  EotCurriculum,
  GradeId,
  Language,
  StreamId,
  SubjectId,
  TermId,
} from '../types/eot';

export const ACADEMIC_YEARS: { id: AcademicYear; labelAr: string; labelEn: string; academicSpan: string }[] = [
  { id: '2026', labelAr: 'هياكل 2026', labelEn: '2026 Structures', academicSpan: '2025 – 2026' },
  { id: '2025', labelAr: 'هياكل 2025', labelEn: '2025 Structures', academicSpan: '2024 – 2025' },
  { id: '2027', labelAr: 'هياكل 2027', labelEn: '2027 Structures', academicSpan: '2026 – 2027' },
];

export const TERMS: { id: TermId; labelAr: string; labelEn: string }[] = [
  { id: 'T1', labelAr: 'الفصل الدراسي الأول', labelEn: 'Term 1 (EOT 1)' },
  { id: 'T2', labelAr: 'الفصل الدراسي الثاني', labelEn: 'Term 2 (EOT 2)' },
  { id: 'T3', labelAr: 'الفصل الدراسي الثالث', labelEn: 'Term 3 (EOT 3)' },
];

export const GRADES: { id: GradeId; labelAr: string; labelEn: string }[] = [
  { id: '12', labelAr: 'الصف الثاني عشر (12)', labelEn: 'Grade 12' },
  { id: '11', labelAr: 'الصف الحادي عشر (11)', labelEn: 'Grade 11' },
  { id: '10', labelAr: 'الصف العاشر (10)', labelEn: 'Grade 10' },
];

export const STREAMS: { id: StreamId; labelAr: string; labelEn: string }[] = [
  { id: 'adv_bridge', labelAr: 'متقدم · بريدج', labelEn: 'Advanced · Bridge' },
  { id: 'adv_inspire', labelAr: 'متقدم · انسباير', labelEn: 'Advanced · Inspire' },
  { id: 'general', labelAr: 'المسار العام', labelEn: 'General Stream' },
];

export const SUBJECTS: { id: SubjectId; labelAr: string; labelEn: string }[] = [
  { id: 'physics', labelAr: 'الفيزياء', labelEn: 'Physics' },
  { id: 'math', labelAr: 'الرياضيات', labelEn: 'Mathematics' },
];

/**
 * Official 9 EOT Curricula for 2026 Term 1 with exact URL conventions from Mr. Mohammed Hesham.
 */
export const BASE_2026_T1_CURRICULA: EotCurriculum[] = [
  {
    id: '12-adv-bri-phy-t1-2026',
    year: '2026',
    term: 'T1',
    grade: '12',
    stream: 'adv_bridge',
    subject: 'physics',
    titleAr: 'فيزياء 12 متقدم — بريدج',
    titleEn: 'Grade 12 Advanced Physics — Bridge',
    subtitleAr: 'هيكل امتحان نهاية الفصل الأول · مقسم صفحة لكل سؤال وزاري مع الحل والتدريب التفاعلي',
    subtitleEn: 'Term 1 EOT Exam Structure · Dedicated interactive page per exam question',
    repoPrefixExample: '12Adv-Bri-phy-T1-2026-EOT-Q1',
    primaryUrlTemplate: 'https://mr-mohammed-hesham.github.io/12Adv-Bri-phy-T1-2026-EOT-Q{q}/',
    fallbackUrlTemplates: [
      'https://mr-mohammed-hesham.github.io/12Adv-Bri-Phy-T1-2026-EOT-Q{q}/',
      'https://mr-mohammed-hesham.github.io/12Adv-Bri-phy-T1-2026-EOT.Q{q}/',
    ],
    defaultTotalQuestions: 25,
    mcqQuestionsEnd: 20,
    knownQuestionTitles: {
      1: {
        ar: 'الكهرباء الساكنة والشحنات الكهربائية — المراجعة التأسيسية',
        en: 'Electrostatics & Electric Charges — Core Review',
      },
      2: {
        ar: 'القسم 1.2: الشحنات الكهربائية وقانون حفظ الشحنة',
        en: 'Section 1.2: Electric Charges & Conservation',
      },
      3: {
        ar: 'الموصلات والعوازل والموصلات الفائقة',
        en: 'Conductors, Insulators & Superconductors',
      },
      4: {
        ar: 'الشحن الكهربائي وتطبيقات الكشاف الكهربائي',
        en: 'Charging Processes & Electroscope Applications',
      },
      5: {
        ar: 'القوة الكهروستاتيكية داخل الذرة وقانون كولوم',
        en: 'Electrostatic Force Inside the Atom & Coulomb’s Law',
      },
      6: {
        ar: 'خطوط المجال الكهربائي وتمثيل الشحنات',
        en: 'Electric Field Lines & Charge Configurations',
      },
      7: {
        ar: 'التوزيعات المتصلة للشحنات الكهربائية',
        en: 'Continuous Charge Distributions',
      },
      8: {
        ar: 'التدفق الكهربائي وقانون جاوس — الجزء الأول',
        en: 'Electric Flux & Gauss’s Law — Part 1',
      },
      9: {
        ar: 'التدفق الكهربائي وقانون جاوس — تطبيقات السؤال التاسع',
        en: 'Electric Flux & Gauss’s Law — Question 9 Applications',
      },
    },
  },
  {
    id: '12-adv-bri-math-t1-2026',
    year: '2026',
    term: 'T1',
    grade: '12',
    stream: 'adv_bridge',
    subject: 'math',
    titleAr: 'رياضيات 12 متقدم — بريدج',
    titleEn: 'Grade 12 Advanced Mathematics — Bridge',
    subtitleAr: 'هيكل امتحان نهاية الفصل الأول · النهايات والاتصال والتفاضل مقسم حسب رقم السؤال',
    subtitleEn: 'Term 1 EOT Exam Structure · Limits, Continuity & Derivatives per question page',
    repoPrefixExample: '12Adv-Bri-math-T1-2026-EOT-Q1',
    primaryUrlTemplate: 'https://mr-mohammed-hesham.github.io/12Adv-Bri-math-T1-2026-EOT-Q{q}/',
    fallbackUrlTemplates: [
      'https://mr-mohammed-hesham.github.io/12Adv-Bri-math-T1-2026-EOT.Q{q}/',
      'https://mr-mohammed-hesham.github.io/12Adv-Bri-Math-T1-2026-EOT-Q{q}/',
    ],
    defaultTotalQuestions: 25,
    mcqQuestionsEnd: 20,
  },
  {
    id: '12-adv-ins-phy-t1-2026',
    year: '2026',
    term: 'T1',
    grade: '12',
    stream: 'adv_inspire',
    subject: 'physics',
    titleAr: 'فيزياء 12 متقدم — انسباير',
    titleEn: 'Grade 12 Advanced Physics — Inspire',
    subtitleAr: 'هيكل امتحان نهاية الفصل الأول لمنهج انسباير المتقدم · صفحة مستقلة لكل سؤال',
    subtitleEn: 'Term 1 EOT Exam Structure for Inspire Advanced Physics · Page per question',
    repoPrefixExample: '12Adv-Ins-phy-T1-2026-EOT-Q1',
    primaryUrlTemplate: 'https://mr-mohammed-hesham.github.io/12Adv-Ins-phy-T1-2026-EOT-Q{q}/',
    fallbackUrlTemplates: [
      'https://mr-mohammed-hesham.github.io/12Adv-Ins-Phy-T1-2026-EOT-Q{q}/',
      'https://mr-mohammed-hesham.github.io/12Adv-Ins-phy-T1-2026-EOT.Q{q}/',
    ],
    defaultTotalQuestions: 25,
    mcqQuestionsEnd: 20,
  },
  {
    id: '12-gen-math-t1-2026',
    year: '2026',
    term: 'T1',
    grade: '12',
    stream: 'general',
    subject: 'math',
    titleAr: 'رياضيات 12 عام',
    titleEn: 'Grade 12 General Mathematics',
    subtitleAr: 'هيكل امتحان نهاية الفصل الأول للمسار العام · تدريبات شاملة لكل سؤال في صفحة منفصلة',
    subtitleEn: 'Term 1 EOT Exam Structure for General Stream · Dedicated page per question',
    repoPrefixExample: '12Jen-math-T1-2026-EOT.Q1',
    primaryUrlTemplate: 'https://mr-mohammed-hesham.github.io/12Jen-math-T1-2026-EOT.Q{q}/',
    fallbackUrlTemplates: [
      'https://mr-mohammed-hesham.github.io/12Jen-math-T1-2026-EOT-Q{q}/',
      'https://mr-mohammed-hesham.github.io/12Gen-math-T1-2026-EOT-Q{q}/',
    ],
    defaultTotalQuestions: 25,
    mcqQuestionsEnd: 20,
  },
  {
    id: '11-adv-bri-math-t1-2026',
    year: '2026',
    term: 'T1',
    grade: '11',
    stream: 'adv_bridge',
    subject: 'math',
    titleAr: 'رياضيات 11 متقدم — بريدج',
    titleEn: 'Grade 11 Advanced Mathematics — Bridge',
    subtitleAr: 'هيكل امتحان نهاية الفصل الأول · مراجعة مركزة وتدريب تفاعلي لكل سؤال وزاري',
    subtitleEn: 'Term 1 EOT Exam Structure · Focused practice page for every exam question',
    repoPrefixExample: '11Adv-Bri-math-T1-2026-EOT-Q1',
    primaryUrlTemplate: 'https://mr-mohammed-hesham.github.io/11Adv-Bri-math-T1-2026-EOT-Q{q}/',
    fallbackUrlTemplates: [
      'https://mr-mohammed-hesham.github.io/11Adv-Bri-math-T1-2026-EOT.Q{q}/',
      'https://mr-mohammed-hesham.github.io/11Adv-Bri-Math-T1-2026-EOT-Q{q}/',
    ],
    defaultTotalQuestions: 25,
    mcqQuestionsEnd: 20,
  },
  {
    id: '11-adv-bri-phy-t1-2026',
    year: '2026',
    term: 'T1',
    grade: '11',
    stream: 'adv_bridge',
    subject: 'physics',
    titleAr: 'فيزياء 11 متقدم — بريدج',
    titleEn: 'Grade 11 Advanced Physics — Bridge',
    subtitleAr: 'هيكل امتحان نهاية الفصل الأول · المتجهات والميكانيكا مقسمة صفحة لكل سؤال',
    subtitleEn: 'Term 1 EOT Exam Structure · Vectors & Mechanics structured per question page',
    repoPrefixExample: '11Adv-Bri-phy-T1-2026-EOT-Q1',
    primaryUrlTemplate: 'https://mr-mohammed-hesham.github.io/11Adv-Bri-phy-T1-2026-EOT-Q{q}/',
    fallbackUrlTemplates: [
      'https://mr-mohammed-hesham.github.io/11Adv-Bri-Phy-T1-2026-EOT-Q{q}/',
      'https://mr-mohammed-hesham.github.io/11Adv-Bri-phy-T1-2026-EOT.Q{q}/',
    ],
    defaultTotalQuestions: 25,
    mcqQuestionsEnd: 20,
  },
  {
    id: '11-gen-math-t1-2026',
    year: '2026',
    term: 'T1',
    grade: '11',
    stream: 'general',
    subject: 'math',
    titleAr: 'رياضيات 11 عام',
    titleEn: 'Grade 11 General Mathematics',
    subtitleAr: 'هيكل امتحان نهاية الفصل الأول للمسار العام · تصفح مباشر لصفحات الأسئلة بالترتيب',
    subtitleEn: 'Term 1 EOT Exam Structure for General Stream · Sequential question pages',
    repoPrefixExample: '11Jen-math-T1-2026-EOT-Q1',
    primaryUrlTemplate: 'https://mr-mohammed-hesham.github.io/11Jen-math-T1-2026-EOT-Q{q}/',
    fallbackUrlTemplates: [
      'https://mr-mohammed-hesham.github.io/11Jen-math-T1-2026-EOT.Q{q}/',
      'https://mr-mohammed-hesham.github.io/11Gen-math-T1-2026-EOT-Q{q}/',
    ],
    defaultTotalQuestions: 25,
    mcqQuestionsEnd: 20,
  },
  {
    id: '10-gen-math-t1-2026',
    year: '2026',
    term: 'T1',
    grade: '10',
    stream: 'general',
    subject: 'math',
    titleAr: 'رياضيات 10 عام',
    titleEn: 'Grade 10 General Mathematics',
    subtitleAr: 'هيكل امتحان نهاية الفصل الأول للصف العاشر العام · صفحة مخصصة لكل سؤال',
    subtitleEn: 'Term 1 EOT Exam Structure for Grade 10 General · Dedicated page per question',
    repoPrefixExample: '10Jen-math-T1-2026-EOT-Q1',
    primaryUrlTemplate: 'https://mr-mohammed-hesham.github.io/10Jen-math-T1-2026-EOT-Q{q}/',
    fallbackUrlTemplates: [
      'https://mr-mohammed-hesham.github.io/10Jen-math-T1-2026-EOT.Q{q}/',
      'https://mr-mohammed-hesham.github.io/10Gen-math-T1-2026-EOT-Q{q}/',
    ],
    defaultTotalQuestions: 25,
    mcqQuestionsEnd: 20,
  },
  {
    id: '10-adv-bri-phy-t1-2026',
    year: '2026',
    term: 'T1',
    grade: '10',
    stream: 'adv_bridge',
    subject: 'physics',
    titleAr: 'فيزياء 10 متقدم — بريدج',
    titleEn: 'Grade 10 Advanced Physics — Bridge',
    subtitleAr: 'هيكل امتحان نهاية الفصل الأول للصف العاشر المتقدم بريدج · كل سؤال في صفحة تفاعلية',
    subtitleEn: 'Term 1 EOT Exam Structure for Grade 10 Advanced Bridge · Interactive page per question',
    repoPrefixExample: '10Adv-Bri-Phy-T1-2026-EOT-Q1',
    primaryUrlTemplate: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-Phy-T1-2026-EOT-Q{q}/',
    fallbackUrlTemplates: [
      'https://mr-mohammed-hesham.github.io/10Adv-Bri-phy-T1-2026-EOT-Q{q}/',
      'https://mr-mohammed-hesham.github.io/10Adv-Bri-Phy-T1-2026-EOT.Q{q}/',
    ],
    defaultTotalQuestions: 25,
    mcqQuestionsEnd: 20,
  },
];

export function buildAllStandardCurricula(): EotCurriculum[] {
  const result: EotCurriculum[] = [];

  for (const yearObj of ACADEMIC_YEARS) {
    for (const termObj of TERMS) {
      for (const base of BASE_2026_T1_CURRICULA) {
        if (yearObj.id === '2026' && termObj.id === 'T1') {
          result.push(base);
          continue;
        }

        const replaceTermYear = (tpl: string) =>
          tpl.replace(/-T1-2026-/g, `-${termObj.id}-${yearObj.id}-`);

        const id = base.id.replace('-t1-2026', `-${termObj.id.toLowerCase()}-${yearObj.id}`);
        const termNameAr =
          termObj.id === 'T1' ? 'الفصل الأول' : termObj.id === 'T2' ? 'الفصل الثاني' : 'الفصل الثالث';
        const termNameEn = termObj.id === 'T1' ? 'Term 1' : termObj.id === 'T2' ? 'Term 2' : 'Term 3';

        result.push({
          ...base,
          id,
          year: yearObj.id,
          term: termObj.id,
          subtitleAr: `هيكل امتحان نهاية ${termNameAr} ${yearObj.id} · مقسم صفحة لكل سؤال وزاري`,
          subtitleEn: `${termNameEn} ${yearObj.id} EOT Exam Structure · Dedicated interactive page per question`,
          repoPrefixExample: replaceTermYear(base.repoPrefixExample),
          primaryUrlTemplate: replaceTermYear(base.primaryUrlTemplate),
          fallbackUrlTemplates: base.fallbackUrlTemplates.map(replaceTermYear),
          knownQuestionTitles: undefined,
        });
      }
    }
  }

  return result;
}

export function buildQuestionCandidateUrls(
  curriculum: EotCurriculum,
  questionNumber: number,
  customOverrideUrl?: string
): string[] {
  const urls: string[] = [];
  if (customOverrideUrl && customOverrideUrl.trim()) {
    urls.push(customOverrideUrl.trim());
  }
  const qStr = String(questionNumber);
  urls.push(curriculum.primaryUrlTemplate.replace('{q}', qStr));
  for (const fb of curriculum.fallbackUrlTemplates) {
    urls.push(fb.replace('{q}', qStr));
  }
  return Array.from(new Set(urls));
}

export function extractRepoNameFromUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const segments = parsed.pathname.split('/').filter(Boolean);
    return segments[0] || url;
  } catch {
    return url;
  }
}

export function getTermLabel(term: TermId, lang: Language): string {
  const item = TERMS.find((t) => t.id === term);
  if (!item) return term;
  return lang === 'ar' ? item.labelAr : item.labelEn;
}

export function getGradeLabel(grade: GradeId, lang: Language): string {
  const item = GRADES.find((g) => g.id === grade);
  if (!item) return grade;
  return lang === 'ar' ? item.labelAr : item.labelEn;
}

export function getStreamLabel(stream: StreamId, lang: Language): string {
  const item = STREAMS.find((s) => s.id === stream);
  if (!item) return stream;
  return lang === 'ar' ? item.labelAr : item.labelEn;
}

export function getSubjectLabel(subject: SubjectId, lang: Language): string {
  const item = SUBJECTS.find((s) => s.id === subject);
  if (!item) return subject;
  return lang === 'ar' ? item.labelAr : item.labelEn;
}

export function normalizeTermParam(raw?: string | null): TermId | null {
  if (!raw) return null;
  const v = raw.trim().toUpperCase();
  if (v === 'T1' || v === 'EOT1' || v === '1') return 'T1';
  if (v === 'T2' || v === 'EOT2' || v === '2') return 'T2';
  if (v === 'T3' || v === 'EOT3' || v === '3') return 'T3';
  return null;
}

export function normalizeStreamParam(raw?: string | null): StreamId | null {
  if (!raw) return null;
  const v = raw.trim().toLowerCase();
  if (v === 'adv_bridge' || v === 'advanced_bridge' || v === 'advanced-bridge' || v === 'bridge' || v === 'advanced') {
    return 'adv_bridge';
  }
  if (v === 'adv_inspire' || v === 'advanced_inspire' || v === 'advanced-inspire' || v === 'inspire') {
    return 'adv_inspire';
  }
  if (v === 'general' || v === 'gen' || v === 'jen') {
    return 'general';
  }
  return null;
}

export function normalizeSubjectParam(raw?: string | null): SubjectId | null {
  if (!raw) return null;
  const v = raw.trim().toLowerCase();
  if (v === 'physics' || v === 'phy') return 'physics';
  if (v === 'math' || v === 'mathematics') return 'math';
  return null;
}

export function normalizeGradeParam(raw?: string | null): GradeId | null {
  if (!raw) return null;
  const v = raw.trim();
  if (v === '12' || v === '11' || v === '10') return v;
  return null;
}

export function normalizeYearParam(raw?: string | null): AcademicYear | null {
  if (!raw) return null;
  const v = raw.trim();
  if (v === '2026' || v === '2025' || v === '2027') return v;
  return null;
}
