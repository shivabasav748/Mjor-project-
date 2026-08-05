import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PulseMark from '../components/PulseMark'
import { useAuth } from '../lib/AuthContext'
import { useTheme } from '../lib/ThemeContext'

export default function Signup() {
  const { signup } = useAuth()
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
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
      await signup(fullName, email, password)
      navigate('/companies')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const strength = password.length === 0 ? 0
    : password.length < 6 ? 1
    : password.length < 10 ? 2
    : 3

  const strengthLabel = ['', 'Weak', 'Good', 'Strong']
  const strengthColor = ['', '#E8615A', '#F5A623', '#3DBF7A']

  return (
    <div
      className="min-h-screen flex font-body"
      style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}
    >
      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full opacity-25"
          style={{ background: 'radial-gradient(ellipse, var(--gold-glow) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[50%] rounded-full opacity-15"
          style={{ background: 'radial-gradient(ellipse, #3FBFAD30 0%, transparent 70%)' }} />
      </div>

      {/* ── Left: form ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <PulseMark size={34} />
          <span className="font-display font-bold text-lg text-gradient-gold">VentureIQ</span>
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          id="theme-toggle-signup"
          className="absolute top-6 left-6 p-2 rounded-xl transition-all duration-200"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>

        <div className="w-full max-w-md animate-slide-up">
          <div className="mb-8">
            <p className="section-label mb-2">Get started free</p>
            <h1 className="font-display font-bold text-3xl" style={{ color: 'var(--text-primary)' }}>
              Bring on your AI co‑founder
            </h1>
            <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
              Set up your account in 30 seconds. No credit card needed.
            </p>
          </div>

          <div
            className="rounded-2xl p-8"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
            }}
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Field label="Full name" id="signup-name">
                <input
                  id="signup-name"
                  required
                  autoFocus
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Johnson"
                  className="input"
                />
              </Field>

              <Field label="Work email" id="signup-email">
                <input
                  id="signup-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@startup.com"
                  className="input"
                />
              </Field>

              <Field label="Password" id="signup-password">
                <div className="relative">
                  <input
                    id="signup-password"
                    type={showPwd ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
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
                {/* Strength meter */}
                {password.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 flex gap-1">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-1 flex-1 rounded-full transition-all duration-300"
                          style={{
                            background: i <= strength ? strengthColor[strength] : 'var(--border)',
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-2xs font-mono" style={{ color: strengthColor[strength] }}>
                      {strengthLabel[strength]}
                    </span>
                  </div>
                )}
              </Field>

              {error && (
                <div
                  className="flex items-center gap-2 text-sm px-4 py-3 rounded-xl animate-fade-in"
                  style={{ background: '#E8615A15', border: '1px solid #E8615A40', color: 'var(--alert)' }}
                >
                  <WarningIcon />
                  {error}
                </div>
              )}

              <button id="signup-submit" type="submit" disabled={busy} className="btn-primary mt-1 w-full">
                {busy ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Creating your workspace…
                  </span>
                ) : 'Create account →'}
              </button>

              <p className="text-2xs text-center" style={{ color: 'var(--text-muted)' }}>
                By continuing, you agree to our Terms and Privacy Policy.
              </p>
            </form>
          </div>

          <p className="text-sm text-center mt-6" style={{ color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold transition-colors" style={{ color: 'var(--gold)' }}>
              Sign in →
            </Link>
          </p>
        </div>
      </div>

      {/* ── Right panel (branding) ── desktop only */}
      <div
        className="hidden lg:flex flex-col justify-between w-[40%] shrink-0 p-12 relative overflow-hidden border-l"
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
      >
        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-20 translate-y-1/2 -translate-x-1/2"
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

        <div className="relative z-10 flex flex-col gap-5">
          {[
            { icon: '🧠', title: 'Idea Validation', desc: 'Validate your startup idea with AI-powered market insights' },
            { icon: '🔍', title: 'Market Research', desc: 'Competitor analysis, trends, and opportunity mapping' },
            { icon: '📊', title: 'Data Dashboard', desc: 'Upload your metrics and see them visualized instantly' },
            { icon: '🚀', title: 'Growth Roadmap', desc: 'Prioritized, actionable steps to scale faster' },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                style={{ background: 'var(--gold-soft)', border: '1px solid var(--gold-glow)' }}
              >
                {f.icon}
              </div>
              <div>
                <p className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{f.title}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-10 text-2xs font-mono" style={{ color: 'var(--text-muted)' }}>
          Trusted by founders building the next big thing.
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
