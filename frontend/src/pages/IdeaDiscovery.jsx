import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PulseMark from '../components/PulseMark'
import { useTheme } from '../lib/ThemeContext'

const DOMAINS = [
  ['AI & Machine Learning', 'AI & ML', 'Intelligent products', 'BrainIcon'],
  ['FinTech', 'FinTech', 'Finance & payments', 'CoinIcon'],
  ['HealthTech', 'HealthTech', 'Healthcare innovation', 'HealthIcon'],
  ['AgriTech', 'AgriTech', 'Smart agriculture', 'LeafIcon'],
  ['EdTech', 'EdTech', 'Future education', 'BookIcon'],
  ['Robotics', 'Robotics', 'Intelligent machines', 'RobotIcon'],
  ['GreenTech', 'GreenTech', 'Sustainable solutions', 'LeafIcon'],
  ['E-Commerce', 'E-Commerce', 'Digital commerce', 'CartIcon'],
]

const OPTIONS = {
  investment: ['Low', 'Medium', 'High'],
  customer: ['Consumers', 'Businesses', 'Both'],
  experience: ['Beginner', 'Intermediate', 'Advanced'],
}

const IDEAS = {
  'AI & Machine Learning': [
    ['AI Personal Finance Copilot', 'An intelligent financial assistant that helps users understand spending, savings and financial decisions.', 'High', '92', 'Medium', 'ChartIcon'],
    ['AI Skill Gap Navigator', 'A personalized AI platform that identifies career skill gaps and creates adaptive learning paths.', 'High', '89', 'Low', 'RouteIcon'],
    ['AI Business Opportunity Scanner', 'An AI system that identifies emerging business opportunities from market and consumer trends.', 'Very High', '94', 'Medium', 'SearchIcon'],
  ],
  FinTech: [
    ['Smart Micro-Investment Assistant', 'A beginner-friendly platform that helps users understand and plan small-scale investments.', 'High', '86', 'Medium', 'CoinIcon'],
    ['AI Expense Intelligence', 'An AI-powered system that turns personal spending patterns into actionable financial insights.', 'High', '88', 'Low', 'WalletIcon'],
  ],
  HealthTech: [
    ['AI Preventive Health Companion', 'A digital assistant that helps users understand lifestyle patterns and preventive wellness actions.', 'Very High', '91', 'Medium', 'HealthIcon'],
    ['Smart Elder Care Network', 'A connected platform supporting families and caregivers with intelligent elderly-care coordination.', 'High', '90', 'Medium', 'HeartIcon'],
  ],
  AgriTech: [
    ['AI Crop Doctor', 'A smart agricultural assistant that helps farmers identify crop diseases and receive actionable guidance.', 'Very High', '94', 'Medium', 'LeafIcon'],
    ['Smart Farm Decision Engine', 'An intelligent platform that combines crop, weather and market information to support farm decisions.', 'High', '91', 'Medium', 'ChartIcon'],
  ],
  EdTech: [
    ['AI Personalized Study Mentor', 'An AI mentor that adapts learning plans based on student progress, goals and weak areas.', 'Very High', '90', 'Low', 'BookIcon'],
    ['Skill-to-Career Navigator', 'A platform connecting student skills with suitable career paths and learning opportunities.', 'High', '87', 'Low', 'RouteIcon'],
  ],
  Robotics: [
    ['AI Elderly Care Robot', 'An intelligent assistive robot designed to support elderly users with daily activities and safety.', 'High', '96', 'High', 'RobotIcon'],
    ['Autonomous Campus Assistant', 'A mobile robot designed to assist institutions with delivery, guidance and campus services.', 'Medium', '93', 'High', 'MapIcon'],
  ],
  GreenTech: [
    ['AI Energy Optimization', 'An intelligent platform that helps businesses identify energy waste and optimize consumption.', 'Very High', '89', 'Medium', 'BoltIcon'],
    ['Smart Waste Intelligence', 'A technology platform that improves waste collection and recycling using predictive analytics.', 'High', '91', 'Medium', 'RecycleIcon'],
  ],
  'E-Commerce': [
    ['AI Shopping Personalizer', 'An AI commerce assistant that creates personalized product discovery experiences.', 'Very High', '88', 'Medium', 'CartIcon'],
    ['Local Business Commerce Engine', 'A digital commerce platform helping small local businesses reach and understand customers.', 'High', '86', 'Low', 'StoreIcon'],
  ],
}

export default function IdeaDiscovery() {
  const navigate = useNavigate()
  const { theme, toggle } = useTheme()
  const [domain, setDomain] = useState('')
  const [preferences, setPreferences] = useState({ investment: '', customer: '', experience: '' })
  const [status, setStatus] = useState('idle')
  const [selectedIdea, setSelectedIdea] = useState('')

  function choose(group, value) {
    setPreferences((current) => ({ ...current, [group]: value }))
  }

  function discover() {
    if (!domain) return
    setStatus('loading')
    window.setTimeout(() => setStatus('results'), 700)
  }

  function reset() {
    setDomain('')
    setPreferences({ investment: '', customer: '', experience: '' })
    setSelectedIdea('')
    setStatus('idle')
  }

  const ideas = IDEAS[domain] || []
  const summary = [domain || 'Choose a domain', preferences.investment || 'Not selected', preferences.customer || 'Not selected', preferences.experience || 'Not selected']

  return (
    <div className="min-h-screen font-body relative overflow-hidden" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      <div className="fixed inset-0 pointer-events-none bg-glow" />
      <header className="sticky top-0 z-20 backdrop-blur-md border-b" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/companies')} className="flex items-center gap-3">
            <PulseMark size={32} />
            <span className="font-display font-bold text-lg text-gradient-gold">VentureIQ</span>
          </button>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline section-label">AI Startup Intelligence</span>
            <button onClick={toggle} className="p-2 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-muted)' }} aria-label="Toggle theme">
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
            <button onClick={() => navigate('/companies')} className="btn-secondary px-3 py-2">← <span className="hidden sm:inline">Workspace</span></button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <section className="grid lg:grid-cols-[1fr_280px] gap-8 items-center mb-14">
          <div>
            <p className="section-label mb-3">✨ VentureIQ Idea Discovery</p>
            <h1 className="font-display font-bold text-4xl md:text-6xl leading-tight mb-5">Discover your next <span className="text-gradient-gold">startup opportunity.</span></h1>
            <p className="text-lg max-w-2xl" style={{ color: 'var(--text-secondary)' }}>Tell VentureIQ what interests you. Our intelligence engine will help you discover startup opportunities worth exploring.</p>
          </div>
          <div className="hidden lg:flex relative h-64 items-center justify-center rounded-full" style={{ background: 'radial-gradient(circle, var(--gold-soft), transparent 66%)' }}>
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl" style={{ background: 'var(--gold-soft)', border: '1px solid var(--gold-glow)' }}>💡</div>
            <span className="absolute top-8 right-6 text-2xl">✦</span><span className="absolute bottom-10 left-8 text-2xl">✧</span>
          </div>
        </section>

        <section className="mb-8">
          <div className="mb-5"><p className="section-label mb-2">Step 01</p><h2 className="font-display font-bold text-2xl">Choose your domain</h2><p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Select an area where you want to explore startup opportunities.</p></div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {DOMAINS.map(([value, label, detail, icon]) => <button key={value} onClick={() => setDomain(value)} className="card card-hover text-left" style={domain === value ? { borderColor: 'var(--gold)', boxShadow: '0 0 0 1px var(--gold-soft)' } : undefined}><span className="text-2xl block mb-3" style={{ color: 'var(--gold)' }}><Icon name={icon} /></span><strong className="block text-sm">{label}</strong><small style={{ color: 'var(--text-muted)' }}>{detail}</small></button>)}
          </div>
        </section>

        <section className="card mb-14">
          <div className="mb-6"><p className="section-label mb-2">Step 02</p><h2 className="font-display font-bold text-2xl">Tell us about your direction</h2><p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>These preferences help VentureIQ generate more relevant opportunities.</p></div>
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(OPTIONS).map(([group, values]) => <div key={group}><label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>{group}</label><div className="flex flex-wrap gap-2 mt-3">{values.map((value) => <button key={value} onClick={() => choose(group, value)} className="btn-secondary px-3 py-2 text-xs" style={preferences[group] === value ? { borderColor: 'var(--gold)', color: 'var(--gold)', background: 'var(--gold-soft)' } : undefined}>{value}</button>)}</div></div>)}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 border-t mt-8 pt-6" style={{ borderColor: 'var(--border)' }}>{summary.map((value, index) => <div key={index}><p className="section-label text-[9px] mb-1">{['Selected domain', 'Investment', 'Customer', 'Experience'][index]}</p><p className="text-sm font-semibold truncate">{value}</p></div>)}</div>
          <button onClick={discover} disabled={!domain || status === 'loading'} className="btn-primary mt-7 w-full sm:w-auto">✦ Discover startup ideas →</button>
        </section>

        {status === 'loading' && <section className="card text-center py-14 mb-14"><div className="text-4xl mb-4 animate-pulse">◉</div><h2 className="font-display font-bold text-2xl">VentureIQ is thinking...</h2><p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>Analyzing opportunities, market patterns and startup possibilities.</p></section>}
        {status === 'results' && <section className="mb-14"><div className="flex flex-wrap gap-4 items-end justify-between mb-6"><div><p className="section-label mb-2">AI Discovery Results</p><h2 className="font-display font-bold text-3xl">Opportunities worth exploring</h2><p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>VentureIQ discovered opportunities in {domain} based on your preferences.</p></div><button onClick={reset} className="btn-secondary">↻ Discover again</button></div><div className="grid lg:grid-cols-3 gap-4">{ideas.map(([title, description, market, innovation, investment, icon], index) => <article key={title} className="card card-hover flex flex-col"><div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5" style={{ background: 'var(--gold-soft)', color: 'var(--gold)' }}><Icon name={icon} /></div><span className="section-label text-[9px]">AI Discovery {index + 1}</span><h3 className="font-display font-bold text-xl mt-2">{title}</h3><p className="text-sm leading-relaxed mt-3 flex-1" style={{ color: 'var(--text-secondary)' }}>{description}</p><div className="grid grid-cols-3 gap-2 border-t mt-6 pt-4" style={{ borderColor: 'var(--border)' }}>{[['Market', market], ['Innovation', innovation], ['Investment', investment]].map(([label, value]) => <div key={label}><p className="section-label text-[9px]">{label}</p><p className="text-xs font-semibold mt-1">{value}</p></div>)}</div><button onClick={() => setSelectedIdea(title)} className="btn-secondary w-full mt-5">Analyze this idea →</button></article>)}</div></section>}
        {selectedIdea && <div className="fixed inset-0 z-30 flex items-center justify-center p-6" style={{ background: '#0008' }} onClick={() => setSelectedIdea('')}><div className="card max-w-md w-full" onClick={(event) => event.stopPropagation()}><p className="section-label mb-2">Idea selected</p><h2 className="font-display font-bold text-2xl">{selectedIdea}</h2><p className="text-sm mt-3" style={{ color: 'var(--text-secondary)' }}>This idea is ready to continue into VentureIQ's analysis workspace.</p><button onClick={() => setSelectedIdea('')} className="btn-primary mt-6 w-full">Close</button></div></div>}
      </main>
    </div>
  )
}

function Icon({ name }) { return <span aria-hidden="true">{({ BrainIcon: '◈', CoinIcon: '◉', HealthIcon: '♡', LeafIcon: '✦', BookIcon: '▤', RobotIcon: '◇', CartIcon: '□', ChartIcon: '↗', RouteIcon: '⌁', SearchIcon: '⌕', HeartIcon: '♡', MapIcon: '⌖', BoltIcon: 'ϟ', RecycleIcon: '♻', WalletIcon: '▣', StoreIcon: '▤' }[name] || '✦')}</span> }
function MoonIcon() { return <span aria-hidden="true">◐</span> }
function SunIcon() { return <span aria-hidden="true">☼</span> }
