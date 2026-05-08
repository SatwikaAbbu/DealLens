import React from 'react';
import ReportCard from '../shared/ReportCard';
import Skeleton from '../shared/Skeleton';

function toDisplayName(item) {
  if (typeof item === 'string') return item.trim();
  if (item && typeof item === 'object') return String(item.name || '').trim();
  return '';
}

function normalizeCompanyName(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\b(inc|llc|ltd|limited|corp|corporation|technologies|technology|tech|labs|lab|ai|private|pvt)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export default function Section4Competitors({ competitors, moat, startupName }) {
  if (!competitors || !moat) {
    return (
      <ReportCard eyebrow="04 — Competitors" title="Competitor Map">
        <div className="space-y-6">
          <Skeleton className="h-24 w-full rounded-xl" />
          <div className="rounded-xl overflow-hidden shadow-card border border-white/5 bg-bg-surface p-5">
            <Skeleton className="h-4 w-48 rounded mb-6" />
            <div className="flex flex-wrap gap-3">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-8 w-24 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </ReportCard>
    );
  }

  const getMoatStyle = (verdict) => {
    switch (verdict) {
      case 'STRONG':
      case 'VERIFIED':
        return 'bg-verdict-green-bg/20 border-verdict-green-bar text-verdict-green-text border-l-4';
      case 'WEAK':
      case 'PARTIAL':
        return 'bg-verdict-amber-bg/20 border-verdict-amber-bar text-verdict-amber-text border-l-4';
      case 'UNSUBSTANTIATED':
      case 'INFLATED':
        return 'bg-verdict-red-bg/20 border-verdict-red-bar text-verdict-red-text border-l-4';
      default:
        return 'bg-bg-raised/50 border-white/5 text-text-muted border-l-4';
    }
  };

  const moatBg = getMoatStyle(moat.verdict);
  const startupNorm = normalizeCompanyName(startupName);
  const filteredCompetitors = Array.from(
    new Set(
      (Array.isArray(competitors) ? competitors : [])
        .map(toDisplayName)
        .filter(Boolean)
        .filter((name) => {
          const compNorm = normalizeCompanyName(name);
          if (!compNorm) return false;
          if (!startupNorm) return true;
          return !(compNorm === startupNorm || compNorm.replace(/\s/g, '') === startupNorm.replace(/\s/g, ''));
        })
    )
  );

  return (
    <ReportCard eyebrow="04" title="Competitor Map">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Moat Analysis */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[10px] font-mono font-semibold uppercase tracking-[0.15em] text-text-muted flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-light" />
            Moat Analysis
          </h3>
          <div className={`p-5 rounded-r-xl border border-white/[0.03] ${moatBg}`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 bg-current/10 rounded-sm border border-current/20">
                {moat.verdict} MOAT
              </span>
            </div>
            <p className="text-[14px] font-sans leading-relaxed text-white">
              {moat.explanation || "No detailed moat analysis available."}
            </p>
          </div>
        </div>

        {/* Right Column: Funded Competitors */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[10px] font-mono font-semibold uppercase tracking-[0.15em] text-text-muted flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-light" />
            Market Proximity
          </h3>
          {filteredCompetitors.length > 0 ? (
            <div className="rounded-xl shadow-card border border-white/[0.03] bg-bg-surface/30 p-5 h-full">
              <p className="text-[10px] font-mono font-medium uppercase tracking-[0.15em] text-text-faint mb-4">
                Funded Competitors Identified via Serper
              </p>
              <div className="flex flex-wrap gap-2.5">
                {filteredCompetitors.map((comp, i) => (
                  <span 
                    key={i} 
                    className="px-3 py-1.5 bg-bg-raised border border-white/10 rounded-full text-[13px] font-sans text-text-secondary shadow-sm hover:bg-white/5 transition-colors cursor-default flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    {comp}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-xl shadow-card border border-white/[0.03] bg-bg-surface/30 p-5 h-full flex items-center justify-center">
              <p className="text-sm text-text-muted italic">No highly funded direct competitors identified.</p>
            </div>
          )}
        </div>

      </div>
    </ReportCard>
  );
}
