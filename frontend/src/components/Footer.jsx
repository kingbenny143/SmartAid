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
    <footer className="mt-20 sm:mt-28 border-t border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950 text-slate-600 dark:text-slate-300 w-full min-w-0 transition-colors">
      <div className="site-container py-14 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Brand & Mission (Col span 4) */}
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" className="inline-flex items-center gap-3.5 group" aria-label="Smart Aid Homepage">
              <div className="w-11 h-11 rounded-2xl overflow-hidden bg-black flex items-center justify-center shadow-md ring-2 ring-emerald-500/40 shrink-0 group-hover:scale-105 transition-transform">
                <img
                  src="/logo.jpg"
                  alt="Smart Aid Logo"
                  className="w-full h-full object-cover scale-105"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold tracking-tight text-xl sm:text-2xl text-slate-900 dark:text-white leading-none">
                  SMART <span className="text-teal-600 dark:text-emerald-400">AID</span>
                </span>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase mt-1">
                  Health Awareness Tech
                </span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 max-w-sm">
              Evidence-informed first aid education, symptom awareness triage, and interactive AI guidance for everyday safety.
            </p>

            <div className="flex items-center gap-2.5 flex-wrap pt-2">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-teal-50 dark:bg-emerald-950/80 text-teal-800 dark:text-emerald-300 border border-teal-200 dark:border-emerald-800/50">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Health Intelligence
              </span>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-slate-200/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 border border-slate-300/80 dark:border-slate-700/60">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600 dark:text-teal-400 shrink-0" aria-hidden="true">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                  <path d="M6 6h10" />
                  <path d="M6 10h10" />
                </svg>
                Educational AI
              </span>
            </div>
          </div>

          {/* Quick Navigation (Col span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 tracking-widest uppercase">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-slate-600 hover:text-teal-700 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors inline-flex items-center gap-2 py-0.5"
                  >
                    <span className="text-teal-600 dark:text-emerald-500 text-xs font-bold">›</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency Quick Reference (Col span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-2">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-600 dark:text-rose-400 shrink-0" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 tracking-widest uppercase">
                Emergency Helplines
              </h4>
            </div>
            <div className="space-y-2.5 text-xs">
              {EMERGENCY_NUMBERS.map((em) => (
                <div
                  key={em.region}
                  className="p-3 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs"
                >
                  <span className="text-slate-600 dark:text-slate-400 font-medium">{em.region}</span>
                  <a
                    href={`tel:${em.number.replace(/\s+/g, '')}`}
                    className="font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 bg-rose-50 dark:bg-rose-950/50 px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-800/40"
                  >
                    {em.number}
                  </a>
                </div>
              ))}
            </div>
            <p className="text-[11.5px] text-slate-500 leading-relaxed pt-1">
              In severe acute trauma or unconsciousness, dial emergency services immediately.
            </p>
          </div>

          {/* Creator & Contact (Col span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 tracking-widest uppercase">
              Creator &amp; Project
            </h4>
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/80 space-y-2.5 text-xs shadow-xs">
              <div className="font-semibold text-slate-900 dark:text-slate-200 text-sm">Anish Raj Anand</div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 text-teal-600 dark:text-teal-400">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <a
                  href="mailto:anandanishraj@gmail.com"
                  className="text-teal-600 hover:text-teal-700 dark:text-emerald-400 dark:hover:text-emerald-300 break-all transition-colors font-medium"
                >
                  anandanishraj@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 pt-0.5">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
                <a
                  href="https://github.com/kingbenny143/SmartAid"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                  github.com/kingbenny143/SmartAid
                </a>
              </div>
              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800 leading-relaxed">
                Educational Health Resource · Evidence-informed guidance
              </div>
            </div>
          </div>
        </div>

        {/* Medical Notice Bar */}
        <div className="mt-12 sm:mt-14 p-4 sm:p-5 rounded-2xl bg-amber-50/70 dark:bg-slate-900/50 border border-amber-200 dark:border-slate-800/80 text-[11.5px] sm:text-xs text-amber-900 dark:text-slate-400 leading-relaxed flex items-start gap-3 sm:gap-3.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>
            <strong className="text-amber-950 dark:text-slate-300 font-semibold">Important Safety Disclaimer: </strong>
            Smart Aid provides general educational health information, symptom awareness triage, and first-aid protocols. It does not provide medical advice, diagnosis, or prescription, and is not a substitute for clinical consultation with a healthcare professional.
          </div>
        </div>

        {/* Bottom Copyright & Status */}
        <div className="mt-10 sm:mt-12 pt-7 border-t border-slate-200 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {year} <span className="text-slate-800 dark:text-slate-300 font-semibold">Smart Aid</span> &mdash; AI-Assisted Health Awareness. All rights reserved.
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-600 dark:text-slate-300">
              Evidence-Informed Healthcare Tech
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
