import React, { useState, useEffect } from 'react';

const STEPS = [
  { id: 1, label: 'Extracting claims from deck', short: 'Extract' },
  { id: 2, label: 'Searching market reports', short: 'Search' },
  { id: 3, label: 'Mapping competitors', short: 'Map' },
  { id: 4, label: 'Researching founders', short: 'Research' },
  { id: 5, label: 'Generating investor questions', short: 'Generate' },
];

const INSIGHTS = [
  "Did you know? Teams with prior domain experience are 3x more likely to reach Series A.",
  "Warning: \"First mover advantage\" is often a myth; execution speed beats being first.",
  "A top-tier TAM analysis builds bottoms-up rather than just citing a top-down report.",
  "The best pitch decks are 10-15 slides long. Conciseness is a strong indicator of clarity.",
];

/* Wave pipeline node positions (viewBox 0 0 900 200) */
const NODES = [
  { x: 90,  y: 90 },
  { x: 270, y: 50 },
  { x: 450, y: 90 },
  { x: 630, y: 50 },
  { x: 810, y: 90 },
];

/* Smooth S-curve path connecting all nodes */
const PIPE = `M 90,90 C 160,90 200,50 270,50 S 380,90 450,90 S 560,50 630,50 S 740,90 810,90`;

export default function LoadingPage({ currentStep }) {
  const [insightIndex, setInsightIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setInsightIndex(prev => (prev + 1) % INSIGHTS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const pct = (currentStep / STEPS.length) * 100;
  /* How much of the path to reveal (0–100, using pathLength="100") */
  const pathFill = (currentStep / STEPS.length) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden bg-bg-base">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="w-full max-w-4xl relative z-10 space-y-6">

        {/* ── HEADER ── */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 mb-3 animate-pulse">
            <svg className="w-5 h-5 text-accent-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-sans font-bold text-white tracking-tight">Analysing Pitch Deck</h2>
          <p className="text-sm font-mono text-text-faint">Running multi-source intelligence pipeline...</p>
        </div>

        {/* ── HORIZONTAL PIPELINE (Desktop) ── */}
        <div className="hidden md:block py-4">
          <svg viewBox="0 0 900 200" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="pipeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(113,112,255,0.9)" />
                <stop offset="100%" stopColor="rgba(113,112,255,0.4)" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="5" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="softGlow">
                <feGaussianBlur stdDeviation="3" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Track (dim) */}
            <path d={PIPE} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" strokeLinecap="round" />

            {/* Filled progress */}
            <path
              d={PIPE} fill="none" stroke="url(#pipeGrad)" strokeWidth="3" strokeLinecap="round"
              pathLength="100" strokeDasharray="100" strokeDashoffset={100 - pathFill}
              style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
              filter="url(#softGlow)"
            />

            {/* Nodes */}
            {NODES.map((n, i) => {
              const status = i + 1 < currentStep ? 'done' : i + 1 === currentStep ? 'active' : 'pending';
              const isLow = n.y > 70;
              const labelY = isLow ? n.y + 38 : n.y - 30;

              return (
                <g key={i}>
                  {/* Active pulse ring */}
                  {status === 'active' && (
                    <circle cx={n.x} cy={n.y} r="22" fill="none" stroke="rgba(113,112,255,0.3)" strokeWidth="1.5">
                      <animate attributeName="r" values="22;30;22" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}

                  {/* Node circle */}
                  <circle
                    cx={n.x} cy={n.y} r="18"
                    fill={status === 'done' ? 'rgba(52,211,153,0.12)' : status === 'active' ? 'rgba(113,112,255,0.15)' : 'rgba(255,255,255,0.02)'}
                    stroke={status === 'done' ? 'rgba(52,211,153,0.5)' : status === 'active' ? 'rgba(113,112,255,0.6)' : 'rgba(255,255,255,0.08)'}
                    strokeWidth="1.5"
                    filter={status === 'active' ? 'url(#glow)' : undefined}
                    style={{ transition: 'all 0.8s ease-out' }}
                  />

                  {/* Inner icon: checkmark or step number */}
                  {status === 'done' ? (
                    <path
                      d={`M ${n.x - 5},${n.y} L ${n.x - 1},${n.y + 4} L ${n.x + 6},${n.y - 4}`}
                      fill="none" stroke="rgba(52,211,153,0.9)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    />
                  ) : (
                    <text
                      x={n.x} y={n.y + 1} textAnchor="middle" dominantBaseline="central"
                      fill={status === 'active' ? 'rgba(113,112,255,1)' : 'rgba(255,255,255,0.2)'}
                      style={{ fontSize: '12px', fontFamily: 'ui-monospace, monospace', fontWeight: 600, transition: 'fill 0.8s' }}
                    >
                      {i + 1}
                    </text>
                  )}

                  {/* Label */}
                  <text
                    x={n.x} y={labelY} textAnchor="middle"
                    fill={status === 'done' ? 'rgba(255,255,255,0.45)' : status === 'active' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.15)'}
                    style={{ fontSize: '10px', fontFamily: 'ui-monospace, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: status === 'active' ? 600 : 400, transition: 'fill 0.8s' }}
                  >
                    {STEPS[i].short}
                  </text>
                </g>
              );
            })}

            {/* Traveling glow dot at active node */}
            <circle
              cx={NODES[Math.min(currentStep - 1, 4)].x}
              cy={NODES[Math.min(currentStep - 1, 4)].y}
              r="4" fill="rgba(113,112,255,1)" filter="url(#glow)"
              style={{ transition: 'cx 1.2s ease-out, cy 1.2s ease-out' }}
            >
              <animate attributeName="r" values="3;6;3" dur="1.5s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>

        {/* ── VERTICAL PIPELINE (Mobile) ── */}
        <div className="md:hidden bg-bg-surface/50 border border-white/[0.03] rounded-2xl p-6 shadow-card space-y-4">
          {STEPS.map((step, i) => {
            const status = i + 1 < currentStep ? 'done' : i + 1 === currentStep ? 'active' : 'pending';
            return (
              <div key={step.id} className="flex items-center gap-4">
                {status === 'done' ? (
                  <div className="w-5 h-5 rounded-full bg-verdict-green-bg/30 border border-verdict-green-bar flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-verdict-green-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                ) : status === 'active' ? (
                  <div className="w-5 h-5 rounded-full border-2 border-accent border-t-transparent animate-spin flex-shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-white/10 bg-white/5 flex items-center justify-center flex-shrink-0">
                    <span className="text-[9px] font-mono text-white/30">{step.id}</span>
                  </div>
                )}
                <span className={`text-sm font-sans transition-all duration-300 ${
                  status === 'done' ? 'text-text-muted' : status === 'active' ? 'text-white font-medium' : 'text-text-faint'
                }`}>{step.label}</span>
              </div>
            );
          })}
        </div>

        {/* ── PROGRESS PERCENTAGE ── */}
        <div className="text-center">
          <span className="text-4xl font-mono font-bold text-white tabular-nums">{Math.round(pct)}</span>
          <span className="text-lg font-mono text-text-faint ml-1">%</span>
        </div>

        {/* ── INSIGHTS CAROUSEL ── */}
        <div className="pt-2">
          <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-text-muted mb-3 text-center">
            Analyst Insight
          </p>
          <div className="h-16 relative flex justify-center">
            {INSIGHTS.map((insight, idx) => (
              <p
                key={idx}
                className={`text-[13px] font-sans text-text-secondary text-center italic max-w-md absolute transition-all duration-700 ease-in-out ${
                  idx === insightIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
                }`}
              >
                "{insight}"
              </p>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
