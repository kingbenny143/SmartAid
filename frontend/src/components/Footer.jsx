const Footer = () => {
  const year = new Date().getFullYear()
  return (
    <footer
      className="mt-12 sm:mt-16 border-t w-full min-w-0 box-border"
      style={{
        borderColor: 'var(--color-border)',
        background: 'linear-gradient(180deg, #0f172a 0%, #0b1220 100%)',
        color: '#cbd5e1',
      }}
    >
      <div className="site-container py-10 sm:py-12 md:py-14 grid gap-8 sm:gap-10 md:grid-cols-3 min-w-0 w-full box-border">
        <div className="space-y-4 min-w-0 w-full">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 text-white flex items-center justify-center font-bold shadow-sm shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </span>
            <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
              SMART <span className="text-teal-400">AID</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed break-words" style={{ color: '#94a3b8' }}>
            AI-assisted health awareness and preventive support.
          </p>
          <div className="flex gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase border whitespace-nowrap" style={{ background: 'rgba(20,184,166,0.12)', color: '#5eead4', borderColor: 'rgba(20,184,166,0.25)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#5eead4' }} />
              Prototype
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase border whitespace-nowrap" style={{ background: 'rgba(148,163,184,0.12)', color: '#cbd5e1', borderColor: 'rgba(148,163,184,0.25)' }}>
              Eureka! 2026
            </span>
          </div>
        </div>

        <div className="space-y-3 min-w-0 w-full">
          <h4 className="text-sm font-bold text-white tracking-wide uppercase" style={{ letterSpacing: '0.04em' }}>Founder</h4>
          <p className="text-sm break-words" style={{ color: '#e2e8f0' }}>Anish Raj Anand</p>
          <a
            href="mailto:anandanishraj@gmail.com"
            className="inline-block text-sm break-all transition hover:text-teal-300"
            style={{ color: '#5eead4' }}
          >
            anandanishraj@gmail.com
          </a>
          <p className="text-xs pt-2 break-words" style={{ color: '#64748b' }}>
            No clinical validation claimed.
          </p>
        </div>

        <div className="space-y-3 min-w-0 w-full">
          <h4 className="text-sm font-bold text-white tracking-wide uppercase" style={{ letterSpacing: '0.04em' }}>Medical Disclaimer</h4>
          <p className="text-sm leading-relaxed break-words" style={{ color: '#94a3b8' }}>
            Smart Aid provides informational health guidance and first-aid education. It does not provide a medical diagnosis or replace a qualified healthcare professional. Seek professional medical care when appropriate. In case of emergency, call your local emergency number immediately.
          </p>
        </div>
      </div>
      <div className="border-t" style={{ borderColor: 'rgba(148,163,184,0.15)' }}>
        <div className="site-container py-4 sm:py-5 text-xs text-center break-words" style={{ color: '#64748b' }}>
          &copy; {year} Smart Aid &mdash; AI-assisted health awareness and preventive support.
        </div>
      </div>
    </footer>
  )
}

export default Footer
