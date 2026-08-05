import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PulseMark from '../components/PulseMark'
import { useAuth } from '../lib/AuthContext'
import { useTheme } from '../lib/ThemeContext'

export default function Login() {
  const { login } = useAuth()
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [busy, setBusy]         = useState(false)
  const [showPwd, setShowPwd]   = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await login(email, password)
      navigate('/companies')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className="min-h-screen flex font-body"
      style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}
    >
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[60%] rounded-full opacity-30"
          style={{ background: 'radial-gradient(ellipse, var(--gold-glow) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[50%] rounded-full opacity-20"
          style={{ background: 'radial-gradient(ellipse, #3FBFAD30 0%, transparent 70%)' }} />
      </div>

      {/* ── Left panel (branding) ── desktop only */}
      <div
        className="hidden lg:flex flex-col justify-between w-[45%] shrink-0 p-12 relative overflow-hidden border-r"
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
      >
        {/* Decorative grid lines */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

        {/* Gold glow top right */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 -translate-y-1/2 translate-x-1/2"
          style={{ background: 'radial-gradient(ellipse, var(--gold-glow) 0%, transparent 70%)' }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <PulseMark size={40} />
            <div>
              <span className="font-display font-bold text-xl text-gradient-gold block">VentureIQ</span>
              <span className="text-2xs font-mono" style={{ color: 'var(--text-muted)' }}>AI Co‑Founder System</span>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <h2 className="font-display font-bold text-3xl mb-4 leading-tight" style={{ color: 'var(--text-primary)' }}>
            Your AI co‑founder<br />
            <span className="text-gradient-gold">never sleeps.</span>
          </h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
            Market research, competitive analysis, growth strategies, and a co-founder
            that knows your company inside out — all in one place.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {['Idea Validation', 'Market Research', 'Competitor Analysis', 'Growth Roadmap', 'Data Dashboard'].map((f) => (
              <span key={f} className="badge badge-gold">{f}</span>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-2xs font-mono" style={{ color: 'var(--text-muted)' }}>
          © 2026 VentureIQ · AI‑Powered Startup Intelligence
        </div>
      </div>

      {/* ── Right panel (form) ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <PulseMark size={34} />
          <span className="font-display font-bold text-lg text-gradient-gold">VentureIQ</span>
        </div>

        {/* Theme toggle top-right */}
        <button
          onClick={toggle}
          id="theme-toggle-login"
          className="absolute top-6 right-6 p-2 rounded-xl transition-all duration-200"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
          title="Toggle theme"
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>

        <div className="w-full max-w-md animate-slide-up">
          {/* Header */}
          <div className="mb-8">
            <p className="section-label mb-2">Welcome back</p>
            <h1 className="font-display font-bold text-3xl" style={{ color: 'var(--text-primary)' }}>
              Sign in to your workspace
            </h1>
            <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
              Pick up right where you left off with your AI co-founder.
            </p>
          </div>

          {/* Card */}
          <div
            className="rounded-2xl p-8"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
            }}
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Field label="Email address" id="login-email">
                <input
                  id="login-email"
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="input"
                />
              </Field>

              <Field label="Password" id="login-password">
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPwd ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {showPwd ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </Field>

              {error && (
                <div
                  className="flex items-center gap-2 text-sm px-4 py-3 rounded-xl animate-fade-in"
                  style={{ background: 'var(--alert)/15', border: '1px solid #E8615A40', color: 'var(--alert)' }}
                >
                  <WarningIcon />
                  {error}
                </div>
              )}

              <button id="login-submit" type="submit" disabled={busy} className="btn-primary mt-1 w-full">
                {busy ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Signing in…
                  </span>
                ) : 'Sign in'}
              </button>
            </form>
          </div>

          <p className="text-sm text-center mt-6" style={{ color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold transition-colors" style={{ color: 'var(--gold)' }}>
              Create one free →
            </Link>
          </p>
        </div>
      </div>
    </div>
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

function EyeIcon() {
  return <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
}
function EyeOffIcon() {
  return <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" strokeLinecap="round" /><line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" /></svg>
}
function WarningIcon() {
  return <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="shrink-0"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" /><line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" /></svg>
}
function SunIcon() {
  return <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" strokeLinecap="round" /><line x1="12" y1="21" x2="12" y2="23" strokeLinecap="round" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" strokeLinecap="round" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" strokeLinecap="round" /><line x1="1" y1="12" x2="3" y2="12" strokeLinecap="round" /><line x1="21" y1="12" x2="23" y2="12" strokeLinecap="round" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" strokeLinecap="round" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" strokeLinecap="round" /></svg>
}
function MoonIcon() {
  return <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" strokeLinecap="round" strokeLinejoin="round" /></svg>
}
