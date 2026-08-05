import { NavLink, useNavigate, useParams } from 'react-router-dom'
import PulseMark from './PulseMark'
import { useAuth } from '../lib/AuthContext'
import { useTheme } from '../lib/ThemeContext'

const NAV_ITEMS = [
  { to: '',          label: 'Overview',   icon: OverviewIcon,   end: true },
  { to: 'chat',      label: 'Co-founder', icon: ChatIcon              },
  { to: 'market',    label: 'Market',     icon: MarketIcon            },
  { to: 'dashboard', label: 'Dashboard',  icon: DataIcon              },
  { to: 'growth',    label: 'Growth',     icon: GrowthIcon            },
]

export default function AppShell({ children }) {
  const { companyId } = useParams()
  const { user, logout }  = useAuth()
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()

  const initials = user?.full_name
    ? user.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <div
      className="min-h-screen flex font-body"
      style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}
    >
      {/* ── Desktop Sidebar ─────────────────────────────────────────── */}
      <aside
        className="hidden md:flex md:flex-col w-64 shrink-0 border-r"
        style={{
          background: 'linear-gradient(180deg, var(--bg-surface) 0%, var(--bg-base) 100%)',
          borderColor: 'var(--border)',
        }}
      >
        {/* Logo */}
        <div className="p-5 pb-4">
          <button
            onClick={() => navigate('/companies')}
            className="flex items-center gap-3 w-full text-left group"
          >
            <PulseMark size={36} />
            <div>
              <span
                className="font-display font-bold text-base leading-tight block text-gradient-gold"
              >
                VentureIQ
              </span>
              <span className="text-2xs font-mono" style={{ color: 'var(--text-muted)' }}>
                AI Co‑Founder
              </span>
            </div>
          </button>

          <div className="divider-gold mt-4" />
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 px-3 flex-1">
          <p className="section-label px-3 mb-2">Navigation</p>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.label}
              to={`/companies/${companyId}${item.to ? `/${item.to}` : ''}`}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive ? 'nav-active' : 'nav-idle'
                }`
              }
              style={({ isActive }) =>
                isActive
                  ? {
                      background: 'var(--gold-soft)',
                      color: 'var(--gold)',
                      border: '1px solid var(--gold-glow)',
                      boxShadow: '0 0 12px var(--gold-glow)',
                    }
                  : {
                      color: 'var(--text-muted)',
                      border: '1px solid transparent',
                    }
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                    <item.icon active={isActive} />
                  </span>
                  <span className={isActive ? '' : 'group-hover:text-[color:var(--text-primary)]'}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom: user + theme toggle */}
        <div
          className="p-4 pt-3 border-t"
          style={{ borderColor: 'var(--border)' }}
        >
          {/* Theme toggle */}
          <button
            onClick={toggle}
            id="theme-toggle-desktop"
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 mb-3"
            style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
          </button>

          {/* User */}
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-xs shrink-0"
              style={{ background: 'var(--gold-soft)', color: 'var(--gold)', border: '1px solid var(--gold-glow)' }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                {user?.full_name}
              </p>
              <p className="text-2xs font-mono truncate" style={{ color: 'var(--text-muted)' }}>
                {user?.email}
              </p>
            </div>
            <button
              onClick={logout}
              id="logout-btn"
              className="text-2xs font-mono transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--alert)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              title="Log out"
            >
              <LogoutIcon />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main content area ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile top header */}
        <header
          className="md:hidden flex items-center justify-between px-4 h-14 border-b sticky top-0 z-20 backdrop-blur-sm"
          style={{
            background: 'var(--bg-surface)',
            borderColor: 'var(--border)',
          }}
        >
          <button onClick={() => navigate('/companies')} className="flex items-center gap-2">
            <PulseMark size={26} />
            <span className="font-display font-bold text-sm text-gradient-gold">VentureIQ</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              id="theme-toggle-mobile"
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
            <button
              onClick={logout}
              className="text-xs px-2 py-1 rounded-lg transition-colors font-mono"
              style={{ color: 'var(--text-muted)' }}
            >
              Out
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">{children}</main>

        {/* Mobile bottom tab bar */}
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 flex justify-around border-t py-2 z-20 backdrop-blur-md"
          style={{
            background: 'var(--bg-surface)',
            borderColor: 'var(--border)',
          }}
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.label}
              to={`/companies/${companyId}${item.to ? `/${item.to}` : ''}`}
              end={item.end}
              className="flex flex-col items-center gap-0.5 px-2 py-1"
              style={({ isActive }) => ({
                color: isActive ? 'var(--gold)' : 'var(--text-muted)',
              })}
            >
              {({ isActive }) => (
                <>
                  <item.icon active={isActive} />
                  <span className="text-[9px] font-medium mt-0.5">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}

/* ── Icon helpers ───────────────────────────────────────────── */
function iconProps(active) {
  return {
    width: 18, height: 18, viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: active ? 2 : 1.7,
  }
}

function OverviewIcon({ active }) {
  return (
    <svg {...iconProps(active)}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  )
}
function ChatIcon({ active }) {
  return (
    <svg {...iconProps(active)}>
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinejoin="round" />
    </svg>
  )
}
function MarketIcon({ active }) {
  return (
    <svg {...iconProps(active)}>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="16 7 22 7 22 13" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function DataIcon({ active }) {
  return (
    <svg {...iconProps(active)}>
      <line x1="18" y1="20" x2="18" y2="10" strokeLinecap="round" />
      <line x1="12" y1="20" x2="12" y2="4" strokeLinecap="round" />
      <line x1="6"  y1="20" x2="6"  y2="14" strokeLinecap="round" />
    </svg>
  )
}
function GrowthIcon({ active }) {
  return (
    <svg {...iconProps(active)}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        strokeLinejoin="round" />
    </svg>
  )
}
function SunIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1"  x2="12" y2="3"  strokeLinecap="round" />
      <line x1="12" y1="21" x2="12" y2="23" strokeLinecap="round" />
      <line x1="4.22" y1="4.22"   x2="5.64" y2="5.64"   strokeLinecap="round" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" strokeLinecap="round" />
      <line x1="1" y1="12" x2="3" y2="12" strokeLinecap="round" />
      <line x1="21" y1="12" x2="23" y2="12" strokeLinecap="round" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" strokeLinecap="round" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" strokeLinecap="round" />
    </svg>
  )
}
function MoonIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function LogoutIcon() {
  return (
    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="16 17 21 12 16 7" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round" />
    </svg>
  )
}
