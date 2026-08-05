import { Link } from 'react-router-dom'
import PulseMark from '../components/PulseMark'
import { useTheme } from '../lib/ThemeContext'

const FEATURES = [
  {
    emoji: '🧠',
    title: 'AI Co-Founder',
    desc: 'An always-on co-founder that knows your company inside out. Ask anything — strategy, priorities, or how to read your numbers.',
    color: '#C9A84C',
  },
  {
    emoji: '🔍',
    title: 'Market Research',
    desc: 'Instant competitive landscape analysis. Get competitors, trends, and white-space opportunities — tailored to your industry.',
    color: '#3FBFAD',
  },
  {
    emoji: '📊',
    title: 'Data Dashboard',
    desc: 'Upload any CSV and see your metrics charted instantly. Line charts, bar charts, summary stats — no data science needed.',
    color: '#F5A623',
  },
  {
    emoji: '🚀',
    title: 'Growth Roadmap',
    desc: 'AI-prioritized action items grounded in your actual business context. High, medium, and low priority — always up to date.',
    color: '#3DBF7A',
  },
  {
    emoji: '📁',
    title: 'Knowledge Base',
    desc: 'Upload your business plan, pitch deck, notes, or any document. Your AI co-founder reads them before every response.',
    color: '#E8615A',
  },
  {
    emoji: '🏢',
    title: 'Multi-Company',
    desc: 'Manage multiple ventures from one account. Switch between companies instantly — each with its own AI context.',
    color: '#9B8EFF',
  },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Create your company', desc: 'Add your company name, industry, stage, and a quick description. This becomes the core context for your AI.' },
  { step: '02', title: 'Upload your documents', desc: 'Add your business plan, market notes, pitch deck, or any text. Your AI co-founder reads it all.' },
  { step: '03', title: 'Get AI-powered insights', desc: 'Chat, run market research, generate growth suggestions — all grounded in your real company context.' },
]

const STATS = [
  { value: '10x', label: 'Faster market research' },
  { value: '3 AI', label: 'Features powered by Gemini' },
  { value: '∞', label: 'Companies per account' },
  { value: '100%', label: 'Context-aware responses' },
]

export default function Landing() {
  const { theme, toggle } = useTheme()

  return (
    <div className="min-h-screen font-body" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>

      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[55%] h-[55%] rounded-full opacity-25"
          style={{ background: 'radial-gradient(ellipse, #C9A84C30 0%, transparent 70%)' }} />
        <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[50%] rounded-full opacity-15"
          style={{ background: 'radial-gradient(ellipse, #3FBFAD20 0%, transparent 70%)' }} />
        <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] rounded-full opacity-10"
          style={{ background: 'radial-gradient(ellipse, #C9A84C25 0%, transparent 70%)' }} />
      </div>

      {/* ── Navbar ──────────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 backdrop-blur-md border-b"
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
      >
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PulseMark size={34} />
            <div>
              <span className="font-display font-bold text-lg text-gradient-gold block leading-none">VentureIQ</span>
              <span className="text-[9px] font-mono tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>AI Co‑Founder</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium transition-colors" style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>Features</a>
            <a href="#how-it-works" className="text-sm font-medium transition-colors" style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>How it works</a>
            <a href="#about" className="text-sm font-medium transition-colors" style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>About</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              id="theme-toggle-landing"
              className="p-2 rounded-xl transition-all duration-200"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
            <Link to="/login" id="nav-login"
              className="text-sm font-medium px-4 py-2 rounded-xl transition-all duration-200"
              style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--gold)'; e.currentTarget.style.borderColor = 'var(--gold)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border)' }}
            >
              Sign in
            </Link>
            <Link to="/signup" id="nav-signup" className="btn-primary text-sm px-4 py-2">
              Get started free →
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative z-10 pt-20 pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 badge badge-gold mb-6 animate-fade-in">
            <span>✨</span>
            <span>Powered by Gemini AI</span>
          </div>

          {/* Headline */}
          <h1
            className="font-display font-bold leading-tight mb-6 animate-slide-up"
            style={{ fontSize: 'clamp(2.4rem, 6vw, 4.5rem)' }}
          >
            Your AI Co‑Founder<br />
            <span className="text-gradient-gold">Never Sleeps.</span>
          </h1>

          <p
            className="text-lg leading-relaxed mx-auto mb-10 animate-slide-up"
            style={{ color: 'var(--text-secondary)', maxWidth: '42rem', animationDelay: '0.1s' }}
          >
            VentureIQ gives every founder an always-on AI co-founder that knows your business,
            researches your market, and helps you prioritize what to build next.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-14 animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <Link to="/signup" id="hero-cta-signup" className="btn-primary text-base px-8 py-3.5">
              Start for free — no credit card →
            </Link>
            <Link to="/login" id="hero-cta-login"
              className="btn-secondary text-base px-8 py-3.5"
            >
              Sign in
            </Link>
          </div>

          {/* Stats bar */}
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden animate-fade-in mx-auto max-w-3xl"
            style={{ background: 'var(--border)', animationDelay: '0.2s' }}
          >
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col items-center py-5 px-4" style={{ background: 'var(--bg-surface)' }}>
                <span className="font-display font-bold text-2xl text-gradient-gold">{s.value}</span>
                <span className="text-xs mt-1 font-mono" style={{ color: 'var(--text-muted)' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature Cards ────────────────────────────────────────────── */}
      <section id="features" className="relative z-10 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="section-label mb-3">What VentureIQ Does</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl" style={{ color: 'var(--text-primary)' }}>
              Everything a co-founder would do — <span className="text-gradient-gold">instantly.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="card group cursor-default transition-all duration-300 hover:border-opacity-60 animate-slide-up"
                style={{
                  animationDelay: `${i * 0.07}s`,
                  borderLeft: `3px solid ${f.color}50`,
                }}
                onMouseEnter={e => e.currentTarget.style.borderLeftColor = f.color}
                onMouseLeave={e => e.currentTarget.style.borderLeftColor = `${f.color}50`}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${f.color}18`, border: `1px solid ${f.color}30` }}
                >
                  {f.emoji}
                </div>
                <h3 className="font-display font-bold text-base mb-2" style={{ color: 'var(--text-primary)' }}>
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section id="how-it-works" className="relative z-10 py-16 px-6">
        <div
          className="max-w-4xl mx-auto rounded-3xl p-10 relative overflow-hidden"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          {/* subtle glow */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 -translate-y-1/2 translate-x-1/2"
            style={{ background: 'radial-gradient(ellipse, var(--gold-glow) 0%, transparent 70%)' }} />

          <div className="text-center mb-10 relative z-10">
            <p className="section-label mb-3">Simple to Start</p>
            <h2 className="font-display font-bold text-3xl" style={{ color: 'var(--text-primary)' }}>
              Up and running in <span className="text-gradient-gold">3 steps</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {HOW_IT_WORKS.map((item, i) => (
              <div key={item.step} className="flex flex-col gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center font-mono font-bold text-base"
                  style={{ background: 'var(--gold-soft)', color: 'var(--gold)', border: '1px solid var(--gold-glow)' }}
                >
                  {item.step}
                </div>
                <h3 className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {item.desc}
                </p>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute" style={{ top: '24px', left: `${33.33 * (i + 1)}%`, transform: 'translateX(-50%)' }}>
                    <span style={{ color: 'var(--gold)', opacity: 0.4, fontSize: '1.2rem' }}>→</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ────────────────────────────────────────────────────── */}
      <section id="about" className="relative z-10 py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="section-label mb-3">About VentureIQ</p>
          <h2 className="font-display font-bold text-3xl mb-5" style={{ color: 'var(--text-primary)' }}>
            Built for founders who move fast
          </h2>
          <p className="text-base leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
            VentureIQ is an AI-powered startup intelligence platform that gives founders the insights
            they need to make better decisions, faster. Whether you're validating an idea, researching
            competitors, or looking for your next growth lever — VentureIQ has your back.
          </p>
          <p className="text-sm leading-relaxed mb-10" style={{ color: 'var(--text-muted)' }}>
            Built as a 7th semester major project demonstrating the integration of large language models
            (Google Gemini) with modern full-stack web development (React + FastAPI).
          </p>

          {/* Tech stack pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {['React 18', 'Vite', 'Tailwind CSS', 'FastAPI', 'SQLite', 'Google Gemini AI', 'Python', 'JWT Auth'].map((t) => (
              <span key={t} className="badge badge-gold">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────── */}
      <section className="relative z-10 py-16 px-6">
        <div
          className="max-w-4xl mx-auto rounded-3xl p-12 text-center relative overflow-hidden"
          style={{ background: 'var(--gold-soft)', border: '1px solid var(--gold-glow)' }}
        >
          <div className="absolute inset-0 rounded-3xl"
            style={{ background: 'radial-gradient(ellipse at center, var(--gold-glow) 0%, transparent 70%)' }} />
          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <PulseMark size={52} />
            </div>
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4" style={{ color: 'var(--text-primary)' }}>
              Ready to meet your AI co‑founder?
            </h2>
            <p className="text-base mb-8" style={{ color: 'var(--text-secondary)' }}>
              Free to get started. No credit card. Setup takes 30 seconds.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/signup" id="cta-signup" className="btn-primary text-base px-10 py-3.5">
                Create free account →
              </Link>
              <Link to="/login" className="btn-secondary text-base px-10 py-3.5">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t py-8 px-6" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <PulseMark size={24} animated={false} />
            <span className="font-display font-bold text-sm text-gradient-gold">VentureIQ</span>
            <span className="text-2xs font-mono" style={{ color: 'var(--text-muted)' }}>· AI-Powered Startup Intelligence</span>
          </div>
          <p className="text-2xs font-mono" style={{ color: 'var(--text-muted)' }}>
            © 2026 VentureIQ · Major Project, 7th Semester
          </p>
        </div>
      </footer>
    </div>
  )
}

function SunIcon() {
  return <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" strokeLinecap="round" /><line x1="12" y1="21" x2="12" y2="23" strokeLinecap="round" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" strokeLinecap="round" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" strokeLinecap="round" /><line x1="1" y1="12" x2="3" y2="12" strokeLinecap="round" /><line x1="21" y1="12" x2="23" y2="12" strokeLinecap="round" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" strokeLinecap="round" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" strokeLinecap="round" /></svg>
}
function MoonIcon() {
  return <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" strokeLinecap="round" strokeLinejoin="round" /></svg>
}
