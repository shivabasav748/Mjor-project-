import { useState } from 'react'
import { useParams } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { api } from '../lib/api'

export default function Market() {
  const { companyId } = useParams()
  const [result,  setResult]  = useState(null)
  const [loading, setLoading] = useState(false)

  async function runAnalysis() {
    setLoading(true)
    try {
      const data = await api.analyzeMarket(companyId)
      setResult(data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppShell>
      <div className="p-6 md:p-10 max-w-4xl mx-auto">

        {/* Header */}
        <div className="animate-slide-up mb-2">
          <p className="section-label mb-2">Market Intelligence</p>
          <h1 className="font-display font-bold text-3xl" style={{ color: 'var(--text-primary)' }}>
            Market Research
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            A snapshot of your competitive landscape — competitors, trends, and openings.
          </p>
        </div>

        <div className="divider-gold mt-4 mb-8" />

        {/* CTA */}
        {!result && !loading && (
          <div className="card text-center py-16 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="text-4xl mb-4">🔍</div>
            <p className="font-display font-semibold text-base mb-2" style={{ color: 'var(--text-primary)' }}>
              Ready to analyze your market
            </p>
            <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: 'var(--text-muted)' }}>
              Get a breakdown of competitors, market trends, and strategic opportunities — powered by your company profile.
            </p>
            <button id="run-market-analysis" onClick={runAnalysis} className="btn-primary inline-flex gap-2">
              <AnalysisIcon /> Run Market Analysis
            </button>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="card text-center py-16 animate-pulse-draw">
            <div className="flex flex-col items-center gap-4">
              <div
                className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: 'var(--gold)', borderTopColor: 'transparent' }}
              />
              <div>
                <p className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                  Analyzing your market…
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  Scanning competitors, trends, and opportunities
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div className="flex flex-col gap-6 animate-slide-up">

            {/* Re-run button */}
            <div className="flex justify-end">
              <button id="rerun-market-analysis" onClick={runAnalysis} className="btn-secondary gap-2 text-sm">
                <RefreshIcon /> Re-run analysis
              </button>
            </div>

            {/* Summary */}
            <div className="card-gold rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">📝</span>
                <p className="font-display font-semibold text-sm" style={{ color: 'var(--gold)' }}>Summary</p>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>{result.summary}</p>
            </div>

            {/* Competitors */}
            <div>
              <p className="section-label mb-4">🏢 Competitors</p>
              <div className="flex flex-col gap-3">
                {result.competitors.map((c, i) => (
                  <div
                    key={i}
                    className="card flex items-start gap-4 hover:border-[color:var(--gold)] transition-colors animate-slide-up"
                    style={{ animationDelay: `${i * 0.06}s` }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-base shrink-0"
                      style={{ background: 'var(--gold-soft)', color: 'var(--gold)', border: '1px solid var(--gold-glow)' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div className="flex-1">
                      <p className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{c.name}</p>
                      <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{c.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trends & Opportunities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Trends */}
              <div>
                <p className="section-label mb-4">📈 Market Trends</p>
                <div className="card flex flex-col gap-3">
                  {result.trends.map((t, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 text-sm animate-slide-up"
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-2xs font-mono font-bold shrink-0 mt-0.5"
                        style={{ background: '#3FBFAD18', color: '#3FBFAD', border: '1px solid #3FBFAD35' }}
                      >
                        {i + 1}
                      </span>
                      <p style={{ color: 'var(--text-secondary)' }}>{t}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Opportunities */}
              <div>
                <p className="section-label mb-4" style={{ color: '#3DBF7A' }}>✨ Opportunities</p>
                <div className="card flex flex-col gap-3">
                  {result.opportunities.map((o, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 text-sm animate-slide-up"
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-2xs font-mono font-bold shrink-0 mt-0.5"
                        style={{ background: '#3DBF7A18', color: '#3DBF7A', border: '1px solid #3DBF7A35' }}
                      >
                        ✓
                      </span>
                      <p style={{ color: 'var(--text-secondary)' }}>{o}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}

function AnalysisIcon() {
  return <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" strokeLinecap="round" /></svg>
}
function RefreshIcon() {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><polyline points="23 4 23 10 17 10" strokeLinecap="round" strokeLinejoin="round" /><polyline points="1 20 1 14 7 14" strokeLinecap="round" strokeLinejoin="round" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" strokeLinecap="round" /></svg>
}
