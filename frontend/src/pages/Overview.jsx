import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { api } from '../lib/api'

const QUICK_ACTIONS = [
  { label: 'Ask a question', action: 'chat', emoji: '💬', color: '#C9A84C' },
  { label: 'Market research', action: 'market', emoji: '🔍', color: '#3FBFAD' },
  { label: 'Upload data', action: 'dashboard', emoji: '📊', color: '#F5A623' },
  { label: 'Growth ideas', action: 'growth', emoji: '🚀', color: '#3DBF7A' },
]

const MODULE_CARDS = [
  {
    to: 'chat',
    emoji: '🧠',
    title: 'AI Co-Founder',
    desc: 'Chat with your AI co-founder — strategy, priorities, company Q&A.',
    color: '#C9A84C',
  },
  {
    to: 'market',
    emoji: '🔍',
    title: 'Market Research',
    desc: 'Competitor landscape, trends, and market opportunities.',
    color: '#3FBFAD',
  },
  {
    to: 'dashboard',
    emoji: '📊',
    title: 'Data Dashboard',
    desc: 'Upload your metrics CSV and see them charted instantly.',
    color: '#F5A623',
  },
  {
    to: 'growth',
    emoji: '🚀',
    title: 'Growth Roadmap',
    desc: 'AI-prioritized actions to grow and scale faster.',
    color: '#3DBF7A',
  },
]

export default function Overview() {
  const { companyId } = useParams()
  const navigate = useNavigate()
  const [company, setCompany]       = useState(null)
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    api.getCompany(companyId).then(setCompany)
    api.growthSuggestions(companyId).then((d) => setSuggestions(d.suggestions))
  }, [companyId])

  if (!company) {
    return (
      <AppShell>
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--gold)', borderTopColor: 'transparent' }} />
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading…</span>
          </div>
        </div>
      </AppShell>
    )
  }

  const highSuggestions = suggestions.filter((s) => s.priority === 'high')

  return (
    <AppShell>
      <div className="p-4 md:p-6 max-w-5xl mx-auto">

        {/* Page header */}
        <div className="mb-5 animate-slide-up">
          <p className="section-label mb-1.5">Overview</p>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-display font-bold text-2xl md:text-3xl" style={{ color: 'var(--text-primary)' }}>
                {company.name}
              </h1>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                {company.industry && (
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{company.industry}</span>
                )}
                {company.stage && (
                  <StagePill stage={company.stage} />
                )}
              </div>
              {company.description && (
                <p className="text-sm mt-3 max-w-xl leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {company.description}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="divider-gold mb-5" />

        {/* Quick action bar */}
        <div className="grid grid-cols-4 gap-2 mb-5">
          {QUICK_ACTIONS.map((qa) => (
            <button
              key={qa.action}
              onClick={() => navigate(`/companies/${companyId}/${qa.action}`)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
              style={{ background: `${qa.color}12`, border: `1px solid ${qa.color}30`, color: qa.color }}
              onMouseEnter={e => e.currentTarget.style.background = `${qa.color}22`}
              onMouseLeave={e => e.currentTarget.style.background = `${qa.color}12`}
            >
              <span className="text-base">{qa.emoji}</span>
              <span className="text-xs hidden sm:inline">{qa.label}</span>
            </button>
          ))}
        </div>

        {/* Feature cards grid */}
        <div className="mb-5">
          <p className="section-label mb-3">Features</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {MODULE_CARDS.map((card, i) => (
              <button
                key={card.to}
                id={`overview-${card.to}`}
                onClick={() => navigate(`/companies/${companyId}/${card.to}`)}
                className="card card-hover text-left group animate-slide-up p-4"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${card.color}18`, border: `1px solid ${card.color}30` }}
                >
                  {card.emoji}
                </div>
                <p className="font-display font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                  {card.title}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {card.desc}
                </p>
                <div
                  className="mt-3 flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-1"
                  style={{ color: card.color }}
                >
                  Open →
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Priority focus section */}
        {suggestions.length > 0 && (
          <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between mb-3">
              <p className="section-label">Where to focus next</p>
              <button
                onClick={() => navigate(`/companies/${companyId}/growth`)}
                className="text-xs font-semibold transition-colors"
                style={{ color: 'var(--gold)' }}
              >
                View all →
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {suggestions.slice(0, 3).map((s, i) => (
                <div
                  key={i}
                  className="card flex items-start gap-4 animate-slide-up"
                  style={{ animationDelay: `${0.35 + i * 0.06}s` }}
                >
                  <PriorityBadge level={s.priority} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{s.title}</p>
                    <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{s.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {suggestions.length === 0 && (
          <div
            className="card text-center py-12 animate-fade-in"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="text-3xl mb-3">💬</div>
            <p className="font-display font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
              Chat with your co-founder first
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Once VentureIQ knows your company, it'll suggest where to focus.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  )
}

function StagePill({ stage }) {
  const map = {
    idea:            { label: '💡 Idea',          bg: '#3FBFAD18', color: '#3FBFAD', border: '#3FBFAD35' },
    mvp:             { label: '🛠 MVP',            bg: '#F5A62318', color: '#F5A623', border: '#F5A62335' },
    'early-revenue': { label: '💰 Early Revenue', bg: '#C9A84C18', color: '#C9A84C', border: '#C9A84C35' },
    growth:          { label: '🚀 Growth',         bg: '#3DBF7A18', color: '#3DBF7A', border: '#3DBF7A35' },
  }
  const s = map[stage] || { label: stage, bg: 'var(--bg-elevated)', color: 'var(--text-muted)', border: 'var(--border)' }
  return (
    <span className="text-2xs font-mono font-semibold uppercase tracking-wider px-3 py-1 rounded-full"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      {s.label}
    </span>
  )
}

function PriorityBadge({ level }) {
  const map = {
    high:   { label: 'High',   bg: '#E8615A18', color: '#E8615A', border: '#E8615A35' },
    medium: { label: 'Med',    bg: '#F5A62318', color: '#F5A623', border: '#F5A62335' },
    low:    { label: 'Low',    bg: '#3FBFAD18', color: '#3FBFAD', border: '#3FBFAD35' },
  }
  const s = map[level] || map.low
  return (
    <span className="text-2xs font-mono font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full shrink-0 mt-0.5"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      {s.label}
    </span>
  )
}
