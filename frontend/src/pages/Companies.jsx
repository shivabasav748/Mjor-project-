import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PulseMark from '../components/PulseMark'
import { useAuth } from '../lib/AuthContext'
import { useTheme } from '../lib/ThemeContext'
import { api } from '../lib/api'

const STAGE_CONFIG = {
  idea:           { label: 'Idea',          color: '#3FBFAD' },
  mvp:            { label: 'MVP',           color: '#F5A623' },
  'early-revenue':{ label: 'Early Revenue', color: '#C9A84C' },
  growth:         { label: 'Growth',        color: '#3DBF7A' },
}

export default function Companies() {
  const { user, logout } = useAuth()
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()
  const [companies, setCompanies] = useState([])
  const [loading, setLoading]     = useState(true)
  const [showForm, setShowForm]   = useState(false)

  useEffect(() => {
    api.listCompanies().then((data) => {
      setCompanies(data)
      setLoading(false)
      if (data.length === 0) setShowForm(true)
    })
  }, [])

  const firstName = user?.full_name?.split(' ')[0] || 'Founder'
  const initials  = user?.full_name
    ? user.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <div
      className="min-h-screen font-body relative overflow-hidden"
      style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}
    >
      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-15%] right-[-10%] w-[45%] h-[55%] rounded-full opacity-20"
          style={{ background: 'radial-gradient(ellipse, var(--gold-glow) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-20%] left-[5%] w-[35%] h-[45%] rounded-full opacity-10"
          style={{ background: 'radial-gradient(ellipse, #3FBFAD25 0%, transparent 70%)' }} />
      </div>

      {/* Top nav bar */}
      <header
        className="sticky top-0 z-20 backdrop-blur-md border-b"
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
      >
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PulseMark size={30} />
            <span className="font-display font-bold text-base text-gradient-gold">VentureIQ</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              id="theme-toggle-companies"
              className="p-2 rounded-xl transition-all duration-200"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-xs"
              style={{ background: 'var(--gold-soft)', color: 'var(--gold)', border: '1px solid var(--gold-glow)' }}
              title={user?.full_name}
            >
              {initials}
            </div>
            <button
              onClick={logout}
              id="logout-companies"
              className="text-sm font-medium transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--alert)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12">

        {/* Hero greeting */}
        <div className="mb-10 animate-slide-up">
          <p className="section-label mb-2">Your Workspace</p>
          <h1 className="font-display font-bold text-4xl leading-tight">
            Hey, <span className="text-gradient-gold">{firstName}</span> 👋
          </h1>
          <p className="text-base mt-2" style={{ color: 'var(--text-secondary)' }}>
            Pick a company to work on with your AI co-founder, or set up a new one below.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center gap-3 py-8">
            <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--gold)', borderTopColor: 'transparent' }} />
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading your companies…</span>
          </div>
        )}

        {/* Company cards */}
        {!loading && companies.length > 0 && (
          <div className="flex flex-col gap-3 mb-8">
            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>
              {companies.length} {companies.length === 1 ? 'company' : 'companies'}
            </p>
            {companies.map((c, i) => {
              const stage = STAGE_CONFIG[c.stage] || { label: c.stage || 'Unknown', color: 'var(--text-muted)' }
              return (
                <button
                  key={c.id}
                  id={`company-card-${c.id}`}
                  onClick={() => navigate(`/companies/${c.id}`)}
                  className="card card-hover w-full text-left flex items-center gap-5 animate-slide-up group"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  {/* Company avatar */}
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center font-display font-bold text-lg shrink-0 transition-transform duration-200 group-hover:scale-110"
                    style={{ background: 'var(--gold-soft)', color: 'var(--gold)', border: '1px solid var(--gold-glow)' }}
                  >
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold text-base truncate" style={{ color: 'var(--text-primary)' }}>
                      {c.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {c.industry && (
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.industry}</span>
                      )}
                      {c.industry && (
                        <span className="text-xs" style={{ color: 'var(--border)' }}>·</span>
                      )}
                      <span
                        className="text-2xs font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ background: `${stage.color}18`, color: stage.color, border: `1px solid ${stage.color}35` }}
                      >
                        {stage.label}
                      </span>
                    </div>
                  </div>
                  <ArrowIcon />
                </button>
              )
            })}
          </div>
        )}

        {/* New company CTA / Form */}
        {!showForm && !loading && (
          <button
            id="add-company-btn"
            onClick={() => setShowForm(true)}
            className="btn-secondary gap-2"
          >
            <PlusIcon /> Add new company
          </button>
        )}

        {showForm && (
          <div className="animate-slide-up">
            <NewCompanyForm
              onCreated={(company) => navigate(`/companies/${company.id}`)}
              onCancel={() => setShowForm(false)}
              showCancel={companies.length > 0}
            />
          </div>
        )}
      </div>
    </div>
  )
}

/* ── New Company Form ─────────────────────────────────────── */
function NewCompanyForm({ onCreated, onCancel, showCancel }) {
  const [name, setName]             = useState('')
  const [industry, setIndustry]     = useState('')
  const [stage, setStage]           = useState('idea')
  const [description, setDescription] = useState('')
  const [busy, setBusy]             = useState(false)
  const [error, setError]           = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const company = await api.createCompany({ name, industry, stage, description })
      onCreated(company)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl p-8"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
    >
      <div className="mb-6">
        <p className="section-label mb-1">New Company</p>
        <h2 className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)' }}>
          Tell VentureIQ about your company
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          The more context you give, the smarter your AI co-founder becomes.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <Field label="Company name" id="company-name">
          <input
            id="company-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            placeholder="e.g. Northlane Robotics"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Industry" id="company-industry">
            <input
              id="company-industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="input"
              placeholder="SaaS, fintech, D2C…"
            />
          </Field>
          <Field label="Stage" id="company-stage">
            <select
              id="company-stage"
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="input"
            >
              <option value="idea">💡 Idea</option>
              <option value="mvp">🛠 MVP</option>
              <option value="early-revenue">💰 Early Revenue</option>
              <option value="growth">🚀 Growth</option>
            </select>
          </Field>
        </div>

        <Field label="What does it do? (optional but highly recommended)" id="company-desc">
          <textarea
            id="company-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input min-h-[90px] resize-none"
            placeholder="A short description of your product and the problem it solves."
          />
        </Field>

        {error && (
          <div
            className="flex items-center gap-2 text-sm px-4 py-3 rounded-xl"
            style={{ background: '#E8615A15', border: '1px solid #E8615A40', color: 'var(--alert)' }}
          >
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button id="create-company-submit" type="submit" disabled={busy} className="btn-primary flex-1">
            {busy ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Setting up…
              </span>
            ) : 'Create company →'}
          </button>
          {showCancel && (
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  )
}

function Field({ label, id, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

function ArrowIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--gold)', opacity: 0.7 }}>
      <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
      <polyline points="12 5 19 12 12 19" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function PlusIcon() {
  return (
    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
      <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
      <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
    </svg>
  )
}
function SunIcon() {
  return <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" strokeLinecap="round" /><line x1="12" y1="21" x2="12" y2="23" strokeLinecap="round" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" strokeLinecap="round" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" strokeLinecap="round" /><line x1="1" y1="12" x2="3" y2="12" strokeLinecap="round" /><line x1="21" y1="12" x2="23" y2="12" strokeLinecap="round" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" strokeLinecap="round" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" strokeLinecap="round" /></svg>
}
function MoonIcon() {
  return <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" strokeLinecap="round" strokeLinejoin="round" /></svg>
}
