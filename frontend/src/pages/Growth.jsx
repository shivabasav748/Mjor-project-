import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { api } from '../lib/api'

const PRIORITY_CONFIG = {
  high:   { label: 'High',   emoji: '🔴', bg: '#E8615A18', color: '#E8615A', border: '#E8615A35', rank: 0 },
  medium: { label: 'Medium', emoji: '🟡', bg: '#F5A62318', color: '#F5A623', border: '#F5A62335', rank: 1 },
  low:    { label: 'Low',    emoji: '🟢', bg: '#3DBF7A18', color: '#3DBF7A', border: '#3DBF7A35', rank: 2 },
}

export default function Growth() {
  const { companyId } = useParams()
  const [suggestions, setSuggestions] = useState([])
  const [loading,     setLoading]     = useState(true)
  const [filter,      setFilter]      = useState('all') // all | high | medium | low

  useEffect(() => {
    api.growthSuggestions(companyId).then((d) => {
      setSuggestions(d.suggestions || [])
      setLoading(false)
    })
  }, [companyId])

  const sorted = [...suggestions].sort(
    (a, b) => (PRIORITY_CONFIG[a.priority]?.rank ?? 99) - (PRIORITY_CONFIG[b.priority]?.rank ?? 99)
  )
  const filtered = filter === 'all' ? sorted : sorted.filter((s) => s.priority === filter)

  const counts = {
    high:   suggestions.filter((s) => s.priority === 'high').length,
    medium: suggestions.filter((s) => s.priority === 'medium').length,
    low:    suggestions.filter((s) => s.priority === 'low').length,
  }

  return (
    <AppShell>
      <div className="p-6 md:p-10 max-w-3xl mx-auto">

        {/* Header */}
        <div className="animate-slide-up mb-2">
          <p className="section-label mb-2">Growth Engine</p>
          <h1 className="font-display font-bold text-3xl" style={{ color: 'var(--text-primary)' }}>
            Growth Roadmap
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            AI-prioritized actions to grow and scale your company, grounded in what your co-founder knows.
          </p>
        </div>

        <div className="divider-gold mt-4 mb-8" />

        {/* Loading */}
        {loading && (
          <div className="flex items-center gap-3 py-8">
            <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--gold)', borderTopColor: 'transparent' }} />
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading suggestions…</span>
          </div>
        )}

        {!loading && suggestions.length > 0 && (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {(['high', 'medium', 'low']).map((level) => {
                const cfg = PRIORITY_CONFIG[level]
                return (
                  <div
                    key={level}
                    className="card text-center cursor-pointer transition-all duration-200 animate-slide-up"
                    style={filter === level ? {
                      background: cfg.bg,
                      borderColor: cfg.border,
                    } : {}}
                    onClick={() => setFilter(filter === level ? 'all' : level)}
                  >
                    <p className="font-display font-bold text-2xl" style={{ color: cfg.color }}>{counts[level]}</p>
                    <p className="text-2xs font-mono uppercase tracking-wider mt-1" style={{ color: 'var(--text-muted)' }}>
                      {cfg.label}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              {['all', 'high', 'medium', 'low'].map((f) => {
                const cfg = f !== 'all' ? PRIORITY_CONFIG[f] : null
                const isActive = filter === f
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 capitalize"
                    style={isActive ? {
                      background: cfg ? cfg.bg : 'var(--gold-soft)',
                      color: cfg ? cfg.color : 'var(--gold)',
                      border: `1px solid ${cfg ? cfg.border : 'var(--gold-glow)'}`,
                    } : {
                      background: 'var(--bg-elevated)',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    {f === 'all' ? `All (${suggestions.length})` : `${cfg.emoji} ${cfg.label}`}
                  </button>
                )
              })}
            </div>

            {/* Suggestion cards */}
            <div className="flex flex-col gap-3">
              {filtered.map((s, i) => {
                const cfg = PRIORITY_CONFIG[s.priority] || PRIORITY_CONFIG.low
                return (
                  <div
                    key={i}
                    className="card flex items-start gap-4 hover:border-[color:var(--gold)] transition-all duration-200 animate-slide-up group"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    {/* Priority badge */}
                    <div
                      className="text-2xs font-mono font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full shrink-0 mt-0.5"
                      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
                    >
                      {cfg.label}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-display font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                        {s.title}
                      </p>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        {s.detail}
                      </p>
                    </div>

                    {/* Number indicator */}
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center font-mono text-2xs font-bold shrink-0 mt-0.5 opacity-30 group-hover:opacity-80 transition-opacity"
                      style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)' }}
                    >
                      {i + 1}
                    </div>
                  </div>
                )
              })}

              {filtered.length === 0 && (
                <div className="card text-center py-10">
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    No {filter} priority suggestions at the moment.
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Empty state */}
        {!loading && suggestions.length === 0 && (
          <div className="card text-center py-16 animate-fade-in">
            <div className="text-4xl mb-4">🚀</div>
            <p className="font-display font-semibold text-base mb-2" style={{ color: 'var(--text-primary)' }}>
              No suggestions yet
            </p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Chat with your AI co-founder first so it can learn about your company and generate personalized growth actions.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  )
}
