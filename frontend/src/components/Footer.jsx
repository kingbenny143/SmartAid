import { Link } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/', label: 'Home Overview' },
  { to: '/symptom-checker', label: 'Symptom Checker' },
  { to: '/first-aid', label: 'First Aid Guides' },
  { to: '/assistant', label: 'AI Health Assistant' },
]

const EMERGENCY_NUMBERS = [
  { region: 'US / Canada', number: '911' },
  { region: 'Europe / UK / Global', number: '112' },
  { region: 'India (Ambulance)', number: '108 / 102' },
]

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer
      className="mt-14 sm:mt-20 border-t border-slate-800/80 bg-slate-950 text-slate-300 w-full min-w-0 transition-colors"
      style={{
        background: 'linear-gradient(180deg, #090d16 0%, #030712 100%)',
      }}
    >
      <div className="site-container py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Brand & Mission (Col span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 group" aria-label="Smart Aid Homepage">
              <div className="w-10 h-10 rounded-2xl overflow-hidden bg-black flex items-center justify-center shadow-lg shadow-emerald-950/60 ring-2 ring-emerald-500/40 shrink-0 group-hover:scale-105 transition-transform">
                <img
                  src="/logo.jpg"
                  alt="Smart Aid Logo"
                  className="w-full h-full object-cover scale-105"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold tracking-tight text-xl text-white leading-none">
                  SMART <span className="text-emerald-400">AID</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-1">
                  Health Awareness Tech
                </span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              Evidence-informed first aid education, symptom awareness triage, and interactive AI guidance for everyday safety.
            </p>

            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-800/50">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                Prototype
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-slate-800/70 text-slate-300 border border-slate-700/60">
                Eureka! 2026
              </span>
            </div>
          </div>

          {/* Quick Navigation (Col span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 tracking-widest uppercase">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-slate-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5"
                  >
                    <span className="text-emerald-500 text-xs">›</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency Quick Reference (Col span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" aria-hidden="true" />
              <h4 className="text-xs font-bold text-rose-400 tracking-widest uppercase">
                Emergency Helplines
              </h4>
            </div>
            <div className="space-y-2 text-xs">
              {EMERGENCY_NUMBERS.map((em) => (
                <div
                  key={em.region}
                  className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between"
                >
                  <span className="text-slate-400">{em.region}</span>
                  <a
                    href={`tel:${em.number.replace(/\s+/g, '')}`}
                    className="font-bold text-rose-400 hover:text-rose-300 bg-rose-950/50 px-2 py-0.5 rounded border border-rose-800/40"
                  >
                    {em.number}
                  </a>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              In severe acute trauma or unconsciousness, dial emergency services immediately.
            </p>
          </div>

          {/* Creator & Contact (Col span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 tracking-widest uppercase">
              Creator &amp; Project
            </h4>
            <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-2 text-xs">
              <div className="font-semibold text-slate-200 text-sm">Anish Raj Anand</div>
              <div className="flex items-center gap-2 text-slate-400">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <a
                  href="mailto:anandanishraj@gmail.com"
                  className="text-emerald-400 hover:text-emerald-300 break-all transition-colors"
                >
                  anandanishraj@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-400 pt-1">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
                <a
                  href="https://github.com/kingbenny143/SmartAid"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  github.com/kingbenny143/SmartAid
                </a>
              </div>
              <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-800">
                Educational prototype · No clinical diagnosis claimed.
              </div>
            </div>
          </div>
        </div>

        {/* Medical Notice Bar */}
        <div className="mt-10 p-3.5 sm:p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 text-[11.5px] sm:text-xs text-slate-400 leading-relaxed flex items-start gap-2.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-amber-400 mt-0.5" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>
            <strong className="text-slate-300">Important Safety Disclaimer: </strong>
            Smart Aid provides general educational health information, symptom awareness triage, and first-aid protocols. It does not provide medical advice, diagnosis, or prescription, and is not a substitute for clinical consultation with a healthcare professional.
          </div>
        </div>

        {/* Bottom Copyright & Status */}
        <div className="mt-8 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            &copy; {year} <span className="text-slate-300 font-semibold">Smart Aid</span> &mdash; AI-Assisted Health Awareness. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
              Online System
            </span>
            <span>·</span>
            <span>Educational Use Only</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
