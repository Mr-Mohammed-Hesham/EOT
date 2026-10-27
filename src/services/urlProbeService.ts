import { QuestionProbeResult } from '../types/eot';

const probeCache = new Map<string, QuestionProbeResult>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes for live hits

function cleanExtractedTitle(rawTitle: string): string {
  return rawTitle
    .replace(/\s*\|\s*Mr\.?\s*Mohammed\s*Hesham.*$/i, '')
    .replace(/^[⚡⚛️📐📚🎯🏆🔥✨\s]+/u, '')
    .trim();
}

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = 4500): Promise<Response> {
  const controller = new AbortController();
  const id = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    window.clearTimeout(id);
  }
}

/**
 * Probes candidate URLs sequentially and resolves the first HTTP 200 live page,
 * also extracting its <title> tag when available.
 */
export async function probeQuestionUrls(
  cacheKey: string,
  candidateUrls: string[],
  forceRefresh = false
): Promise<QuestionProbeResult> {
  if (!forceRefresh) {
    const cached = probeCache.get(cacheKey);
    if (cached && cached.checkedAt && Date.now() - cached.checkedAt < CACHE_TTL_MS) {
      return cached;
    }
  }

  const primaryUrl = candidateUrls[0] || '';

  for (const candidate of candidateUrls) {
    try {
      const targetUrl = forceRefresh
        ? `${candidate}${candidate.includes('?') ? '&' : '?'}v=${Date.now()}`
        : candidate;

      const res = await fetchWithTimeout(targetUrl, {
        method: 'GET',
        mode: 'cors',
        cache: forceRefresh ? 'no-store' : 'default',
      });

      if (res.ok) {
        let liveTitle: string | undefined;
        try {
          const text = await res.text();
          const match = text.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
          if (match && match[1]) {
            const cleaned = cleanExtractedTitle(match[1]);
            if (cleaned && !cleaned.includes('Page not found') && !cleaned.includes('GitHub Pages')) {
              liveTitle = cleaned;
            }
          }
        } catch {
          // Ignore HTML title parse issues
        }

        const hit: QuestionProbeResult = {
          status: 'live',
          resolvedUrl: candidate,
          liveTitle,
          checkedAt: Date.now(),
        };
        probeCache.set(cacheKey, hit);
        return hit;
      }
    } catch {
      // Continue trying fallback URLs
    }
  }

  const pendingResult: QuestionProbeResult = {
    status: 'pending',
    resolvedUrl: primaryUrl,
    checkedAt: Date.now(),
  };
  probeCache.set(cacheKey, pendingResult);
  return pendingResult;
}

/**
 * Batch-checks questions 1..maxQ with bounded concurrency so UI updates smoothly.
 */
export async function probeCurriculumBatch(
  curriculumId: string,
  totalQuestions: number,
  getCandidates: (q: number) => string[],
  onProgress?: (q: number, result: QuestionProbeResult) => void,
  forceRefresh = false
): Promise<Record<number, QuestionProbeResult>> {
  const results: Record<number, QuestionProbeResult> = {};
  const concurrency = 5;
  const queue = Array.from({ length: totalQuestions }, (_, idx) => idx + 1);

  async function worker() {
    while (queue.length > 0) {
      const q = queue.shift();
      if (q === undefined) break;
      const key = `${curriculumId}__Q${q}`;
      const res = await probeQuestionUrls(key, getCandidates(q), forceRefresh);
      results[q] = res;
      onProgress?.(q, res);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, totalQuestions) }, () => worker());
  await Promise.all(workers);
  return results;
}

export function getCachedProbeResult(curriculumId: string, q: number): QuestionProbeResult | undefined {
  return probeCache.get(`${curriculumId}__Q${q}`);
}
