/**
 * VentureIQ logo mark — animated gold heartbeat on dark/light gear-brain icon
 */
export default function PulseMark({ size = 32, animated = true }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="VentureIQ logo"
    >
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#E8C55C" />
          <stop offset="50%"  stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#9A7620" />
        </linearGradient>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#1A2340" />
          <stop offset="100%" stopColor="#0B0F1E" />
        </linearGradient>
      </defs>

      {/* Background rect */}
      <rect x="0.5" y="0.5" width="39" height="39" rx="10" fill="url(#bgGrad)" stroke="#C9A84C30" strokeWidth="1" />

      {/* Inner glow */}
      <rect x="2" y="2" width="36" height="36" rx="8.5" fill="none" stroke="#C9A84C18" strokeWidth="0.5" />

      {/* Heartbeat / pulse line */}
      <path
        className={animated ? 'pulse-line' : ''}
        d="M5 20 L11 20 L14 11 L18 29 L22 13 L25 20 L35 20"
        stroke="url(#goldGrad)"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={!animated ? { opacity: 0.9 } : undefined}
      />
    </svg>
  )
}
