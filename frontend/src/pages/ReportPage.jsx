import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Button from '../components/shared/Button';
import ErrorBoundary from '../components/shared/ErrorBoundary';
import { useScrollSpy } from '../hooks/useScrollSpy';

import Section1Scorecard from '../components/sections/Section1Scorecard';
import Section2Founder from '../components/sections/Section2Founder';
import Section3Claims from '../components/sections/Section3Claims';
import Section4Competitors from '../components/sections/Section4Competitors';
import Section5Questions from '../components/sections/Section5Questions';

export default function ReportPage({ report, filename, onNavigate }) {
  const [copied, setCopied] = useState(false);
  
  // Array of section IDs that match the <section id="..."> tags
  const sectionIds = ['scorecard', 'founder', 'claims', 'competitors', 'questions'];
  const activeSection = useScrollSpy(sectionIds, 100);

  const handleExportPDF = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-bg-base flex">
      <Sidebar active={activeSection} onNavigate={onNavigate} filename={filename} />
      
      <main className="ml-56 flex-1 px-8 py-8 h-screen overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8 pb-32">
          
          {/* Header */}
          <div className="flex items-start justify-between border-b border-white/5 pb-8 mb-4">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <h1 className="text-4xl font-sans font-bold tracking-tight text-white drop-shadow-sm">
                  {report.scorecard?.startup_name || "Unknown Startup"}
                </h1>
                <span className="px-2.5 py-1 rounded bg-accent/10 border border-accent/20 text-[10px] font-mono text-accent-light uppercase tracking-widest">
                  Intelligence Report
                </span>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-[11px] font-mono text-text-faint tracking-wide">{filename}</p>
                <span className="text-text-faint/30 text-[10px]">|</span>
                <p className="text-[10px] font-mono text-text-faint uppercase tracking-wider">Analysed just now</p>
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              {/* Overall Score Badge */}
              <div className="flex flex-col items-end">
                <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-1">Overall Verdict</p>
                <div className="flex items-center gap-3">
                  <div className={`text-4xl font-mono font-bold tracking-tighter ${
                    report.scorecard?.overall_score?.value >= 7 ? 'text-verdict-green-text drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]' : 
                    report.scorecard?.overall_score?.value >= 4 ? 'text-verdict-amber-text drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]' : 
                    'text-verdict-red-text drop-shadow-[0_0_15px_rgba(248,113,113,0.3)]'
                  }`}>
                    {report.scorecard?.overall_score?.value || 0}<span className="text-lg text-text-faint">/10</span>
                  </div>
                </div>
              </div>

              <div className="w-px h-12 bg-white/10" />

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <Button variant="primary" onClick={handleShare}>
                  {copied ? '✓ Link Copied' : 'Share Report'}
                </Button>
                <Button variant="ghost" onClick={handleExportPDF}>
                  Export PDF
                </Button>
              </div>
            </div>
          </div>

          {/* 01: Deal Scorecard */}
          <section id="scorecard" className="scroll-mt-8">
            <ErrorBoundary eyebrow="01" title="Deal Scorecard">
              <Section1Scorecard scorecard={report.scorecard} />
            </ErrorBoundary>
          </section>

          {/* 02: Founder Card */}
          <section id="founder" className="scroll-mt-8">
            <ErrorBoundary eyebrow="02" title="Founder Intelligence">
              <Section2Founder founder={report.founder} />
            </ErrorBoundary>
          </section>

          {/* 03: Claim Verification */}
          <section id="claims" className="scroll-mt-8">
            <ErrorBoundary eyebrow="03" title="Claim Verification">
              <Section3Claims claims={report.claims} />
            </ErrorBoundary>
          </section>

          {/* 04: Competitor Map */}
          <section id="competitors" className="scroll-mt-8">
            <ErrorBoundary eyebrow="04" title="Competitor Map">
              <Section4Competitors competitors={report.competitors} moat={report.claims.moat} />
            </ErrorBoundary>
          </section>

          {/* 05: Investor Questions */}
          <section id="questions" className="scroll-mt-8">
            <ErrorBoundary eyebrow="05" title="Investor Questions">
              <Section5Questions questions={report.questions} />
            </ErrorBoundary>
          </section>

        </div>
      </main>
    </div>
  );
}
