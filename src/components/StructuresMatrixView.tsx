import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Copy, RefreshCw } from 'lucide-react';
import {
  AcademicYear,
  EotCurriculum,
  Language,
  QuestionProbeResult,
  TermId,
} from '../types/eot';
import {
  ACADEMIC_YEARS,
  TERMS,
  getGradeLabel,
  getStreamLabel,
  getSubjectLabel,
} from '../data/eotCurricula';

interface StructuresMatrixViewProps {
  curricula: EotCurriculum[];
  selectedYear: AcademicYear;
  onYearChange: (year: AcademicYear) => void;
  selectedTerm: TermId;
  onTermChange: (term: TermId) => void;
  getTotalQuestions: (c: EotCurriculum) => number;
  completedMap: Record<string, number[]>;
  probeMap: Record<string, Record<number, QuestionProbeResult>>;
  isScanningAll: boolean;
  onScanAllCurricula: () => void;
  onOpenCurriculumQuestion: (curriculumId: string, q: number) => void;
  language: Language;
}

export const StructuresMatrixView: React.FC<StructuresMatrixViewProps> = ({
  curricula,
  selectedYear,
  onYearChange,
  selectedTerm,
  onTermChange,
  getTotalQuestions,
  completedMap,
  probeMap,
  isScanningAll,
  onScanAllCurricula,
  onOpenCurriculumQuestion,
  language,
}) => {
  const isEn = language === 'en';
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const ArrowIcon = isEn ? ArrowRight : ArrowLeft;

  const copyShareLink = async (curriculum: EotCurriculum) => {
    if (typeof window === 'undefined') return;
    const u = new URL(`${window.location.origin}${window.location.pathname}`);
    u.searchParams.set('year', curriculum.year);
    u.searchParams.set('term', curriculum.term);
    u.searchParams.set('curriculum', curriculum.id);
    u.searchParams.set('q', '1');
    try {
      await navigator.clipboard.writeText(u.toString());
      setCopiedId(curriculum.id);
      window.setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Ignore clipboard errors
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-colors">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {isEn
              ? 'Approved EOT Curricula & Question Pages Matrix'
              : 'خريطة الهياكل المعتمدة وحالة صفحات الأسئلة'}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {isEn
              ? 'Complete index of subject structures by Year, Term, Grade, and Stream with live GitHub Pages verification.'
              : 'جدول تفصيلي لجميع المناهج المقسمة حسب السنة والفصل والصف والمسار مع فحص مباشر لصفحات الأسئلة المنشورة.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value as AcademicYear)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 tabular-nums cursor-pointer"
          >
            {ACADEMIC_YEARS.map((y) => (
              <option key={y.id} value={y.id}>
                {isEn ? y.labelEn : y.labelAr}
              </option>
            ))}
          </select>

          <select
            value={selectedTerm}
            onChange={(e) => onTermChange(e.target.value as TermId)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 cursor-pointer"
          >
            {TERMS.map((t) => (
              <option key={t.id} value={t.id}>
                {isEn ? t.labelEn : t.labelAr}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={onScanAllCurricula}
            disabled={isScanningAll}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 text-xs font-bold disabled:opacity-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isScanningAll ? 'animate-spin' : ''}`}
              aria-hidden="true"
            />
            <span>{isEn ? 'Verify Live Pages' : 'فحص الصفحات المنشورة'}</span>
          </button>
        </div>
      </div>

      {/* High-Density Data Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/70 text-xs font-bold text-slate-600 dark:text-slate-300">
                <th className="py-3.5 px-4 text-start">{isEn ? 'Curriculum' : 'المنهج الدراسي'}</th>
                <th className="py-3.5 px-4 text-start">{isEn ? 'Grade & Stream' : 'الصف والمسار'}</th>
                <th className="py-3.5 px-4 text-start">{isEn ? 'Subject' : 'المادة'}</th>
                <th className="py-3.5 px-4 text-start">{isEn ? 'URL Pattern (Q1)' : 'نمط الرابط المعتمد (Q1)'}</th>
                <th className="py-3.5 px-4 text-end tabular-nums">{isEn ? 'Pages' : 'الصفحات'}</th>
                <th className="py-3.5 px-4 text-end tabular-nums">{isEn ? 'Published' : 'المنشور حالياً'}</th>
                <th className="py-3.5 px-4 text-end tabular-nums">{isEn ? 'Reviewed' : 'تمت مراجعته'}</th>
                <th className="py-3.5 px-4 text-end">{isEn ? 'Actions' : 'الإجراءات'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-300">
              {curricula.map((c) => {
                const totalQ = getTotalQuestions(c);
                const doneCount = (completedMap[c.id] || []).filter((q) => q <= totalQ).length;
                const probes = probeMap[c.id] || {};
                const liveCount = Object.values(probes).filter((p) => p.status === 'live').length;
                const checkedCount = Object.values(probes).filter(
                  (p) => p.status === 'live' || p.status === 'pending'
                ).length;

                return (
                  <tr
                    key={c.id}
                    className="hover:bg-slate-50/90 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {isEn ? c.titleEn : c.titleAr}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      <span>{getGradeLabel(c.grade, language)}</span>
                      <span className="mx-1.5" aria-hidden="true">·</span>
                      <span>{getStreamLabel(c.stream, language)}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-200 font-semibold whitespace-nowrap">
                      {getSubjectLabel(c.subject, language)}
                    </td>
                    <td
                      className="py-3.5 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap"
                      dir="ltr"
                    >
                      {c.repoPrefixExample}
                    </td>
                    <td className="py-3.5 px-4 text-end font-mono font-bold tabular-nums whitespace-nowrap">
                      {totalQ}
                    </td>
                    <td className="py-3.5 px-4 text-end tabular-nums whitespace-nowrap">
                      {liveCount > 0 ? (
                        <span className="inline-flex items-center justify-end gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>
                            {liveCount} {isEn ? 'live' : 'متاح'}
                          </span>
                        </span>
                      ) : checkedCount > 0 ? (
                        <span className="text-slate-400 dark:text-slate-500">
                          {isEn ? 'Ready for upload' : 'بانتظار الرفع'}
                        </span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-end font-mono tabular-nums whitespace-nowrap">
                      {doneCount} / {totalQ}
                    </td>
                    <td className="py-3.5 px-4 text-end whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => copyShareLink(c)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                        >
                          {copiedId === c.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
                          )}
                          <span>
                            {copiedId === c.id
                              ? isEn
                                ? 'Copied'
                                : 'نُسخ'
                              : isEn
                              ? 'Share Link'
                              : 'رابط المنهج'}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onOpenCurriculumQuestion(c.id, 1)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold transition-colors cursor-pointer"
                        >
                          <span>{isEn ? 'Open Q1' : 'فتح س1'}</span>
                          <ArrowIcon className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
