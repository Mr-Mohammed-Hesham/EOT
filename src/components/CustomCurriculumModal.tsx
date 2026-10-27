import React, { useState } from 'react';
import { Trash2, X } from 'lucide-react';
import {
  AcademicYear,
  EotCurriculum,
  GradeId,
  Language,
  StreamId,
  SubjectId,
  TermId,
} from '../types/eot';
import {
  ACADEMIC_YEARS,
  GRADES,
  STREAMS,
  SUBJECTS,
  TERMS,
  extractRepoNameFromUrl,
} from '../data/eotCurricula';

interface CustomCurriculumModalProps {
  isOpen: boolean;
  onClose: () => void;
  customCurricula: EotCurriculum[];
  onAddCurriculum: (curriculum: EotCurriculum) => void;
  onDeleteCustomCurriculum: (id: string) => void;
  language: Language;
}

export const CustomCurriculumModal: React.FC<CustomCurriculumModalProps> = ({
  isOpen,
  onClose,
  customCurricula,
  onAddCurriculum,
  onDeleteCustomCurriculum,
  language,
}) => {
  const isEn = language === 'en';
  const [year, setYear] = useState<AcademicYear>('2026');
  const [term, setTerm] = useState<TermId>('T1');
  const [grade, setGrade] = useState<GradeId>('12');
  const [stream, setStream] = useState<StreamId>('adv_bridge');
  const [subject, setSubject] = useState<SubjectId>('physics');
  const [titleAr, setTitleAr] = useState('');
  const [q1Url, setQ1Url] = useState('');
  const [totalQuestions, setTotalQuestions] = useState(25);
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const trimmedUrl = q1Url.trim();
    if (!trimmedUrl) {
      setFormError(
        isEn
          ? 'Please enter the Question 1 URL or URL template containing {q}.'
          : 'يرجى إدخال رابط السؤال الأول (Q1) أو نمط الرابط المحتوي على {q}.'
      );
      return;
    }

    let template = trimmedUrl;
    if (!template.includes('{q}')) {
      if (/([.-]Q)1(\/?)$/i.test(template)) {
        template = template.replace(/([.-]Q)1(\/?)$/i, '$1{q}$2');
      } else {
        setFormError(
          isEn
            ? 'Include Q1 at the end of the URL (e.g. ...-EOT-Q1/) or {q} placeholder.'
            : 'تأكد أن الرابط ينتهي بـ Q1/ (مثل ...-EOT-Q1/) أو يحتوي على الرمز {q}.'
        );
        return;
      }
    }

    const q1Sample = template.replace('{q}', '1');
    const subjectAr = subject === 'physics' ? 'فيزياء' : 'رياضيات';
    const subjectEn = subject === 'physics' ? 'Physics' : 'Mathematics';
    const streamAr =
      stream === 'adv_bridge'
        ? 'متقدم — بريدج'
        : stream === 'adv_inspire'
        ? 'متقدم — انسباير'
        : 'عام';
    const streamEn =
      stream === 'adv_bridge'
        ? 'Advanced — Bridge'
        : stream === 'adv_inspire'
        ? 'Advanced — Inspire'
        : 'General';

    const finalTitleAr = titleAr.trim() || `${subjectAr} ${grade} ${streamAr}`;
    const finalTitleEn = `Grade ${grade} ${streamEn} ${subjectEn}`;

    const newItem: EotCurriculum = {
      id: `custom-${Date.now()}`,
      year,
      term,
      grade,
      stream,
      subject,
      titleAr: finalTitleAr,
      titleEn: finalTitleEn,
      subtitleAr: `هيكل امتحان مخصص · مقسم إلى ${totalQuestions} صفحة سؤال`,
      subtitleEn: `Custom EOT Structure · Divided into ${totalQuestions} question pages`,
      repoPrefixExample: extractRepoNameFromUrl(q1Sample),
      primaryUrlTemplate: template,
      fallbackUrlTemplates: [],
      defaultTotalQuestions: Math.max(1, Math.min(50, totalQuestions)),
      mcqQuestionsEnd: Math.min(20, totalQuestions),
      isCustom: true,
    };

    onAddCurriculum(newItem);
    setTitleAr('');
    setQ1Url('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
            {isEn ? 'Add or Manage Custom Curriculum' : 'إضافة منهج هيكل جديد'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={isEn ? 'Close' : 'إغلاق'}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
                {isEn ? 'Year' : 'السنة'}
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value as AcademicYear)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold bg-slate-50 dark:bg-slate-800"
              >
                {ACADEMIC_YEARS.map((y) => (
                  <option key={y.id} value={y.id}>
                    {y.id}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
                {isEn ? 'Term' : 'الفصل'}
              </label>
              <select
                value={term}
                onChange={(e) => setTerm(e.target.value as TermId)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold bg-slate-50 dark:bg-slate-800"
              >
                {TERMS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {isEn ? t.labelEn : t.labelAr}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
                {isEn ? 'Grade' : 'الصف'}
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value as GradeId)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold bg-slate-50 dark:bg-slate-800"
              >
                {GRADES.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.id}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
                {isEn ? 'Subject' : 'المادة'}
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as SubjectId)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold bg-slate-50 dark:bg-slate-800"
              >
                {SUBJECTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {isEn ? s.labelEn : s.labelAr}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
                {isEn ? 'Stream' : 'المسار'}
              </label>
              <select
                value={stream}
                onChange={(e) => setStream(e.target.value as StreamId)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold bg-slate-50 dark:bg-slate-800"
              >
                {STREAMS.map((st) => (
                  <option key={st.id} value={st.id}>
                    {isEn ? st.labelEn : st.labelAr}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
                {isEn ? 'Questions Count' : 'عدد الأسئلة'}
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={totalQuestions}
                onChange={(e) => setTotalQuestions(Number(e.target.value) || 25)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800 tabular-nums"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
              {isEn
                ? 'Question 1 URL (automatically generates Q1, Q2, ... QN pages)'
                : 'رابط السؤال الأول Q1 (سيتم توليد باقي صفحات الأسئلة Q2..QN تلقائياً)'}
            </label>
            <input
              type="url"
              dir="ltr"
              required
              value={q1Url}
              onChange={(e) => setQ1Url(e.target.value)}
              placeholder="https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-EOT-Q1/"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
              {isEn ? 'Custom Display Title (Optional)' : 'اسم المنهج المخصص (اختياري)'}
            </label>
            <input
              type="text"
              value={titleAr}
              onChange={(e) => setTitleAr(e.target.value)}
              placeholder={isEn ? 'e.g. Grade 10 Adv Math Bridge' : 'مثال: رياضيات 10 متقدم — بريدج'}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:border-amber-500 focus:outline-none"
            />
          </div>

          {formError && <p className="text-xs font-bold text-red-500">{formError}</p>}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            >
              {isEn ? 'Cancel' : 'إلغاء'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-bold hover:from-amber-600 hover:to-orange-600 cursor-pointer"
            >
              {isEn ? 'Add Curriculum' : 'إضافة المنهج'}
            </button>
          </div>
        </form>

        {customCurricula.length > 0 && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <h3 className="text-xs font-bold text-slate-600 dark:text-slate-300">
              {isEn ? 'Added Custom Curricula:' : 'المناهج المضافة يدوياً:'}
            </h3>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {customCurricula.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs"
                >
                  <span className="font-bold text-slate-800 dark:text-slate-100 truncate">
                    {isEn ? c.titleEn : c.titleAr} ({c.year} · {c.term})
                  </span>
                  <button
                    type="button"
                    onClick={() => onDeleteCustomCurriculum(c.id)}
                    className="text-red-500 hover:text-red-600 p-1 cursor-pointer"
                    aria-label={isEn ? 'Delete' : 'حذف'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
