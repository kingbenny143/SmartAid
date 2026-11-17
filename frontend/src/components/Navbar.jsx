import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useTheme } from '../context/useTheme.js'

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/symptom-checker', label: 'Symptom Checker' },
  { to: '/first-aid', label: 'First Aid' },
  { to: '/assistant', label: 'Assistant' },
]

const NavIcon = ({ open }) => (
  open ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
)

const BrandLogo = () => (
  <div className="flex items-center gap-3 shrink-0">
    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl overflow-hidden bg-black flex items-center justify-center shadow-md shadow-emerald-950/40 ring-2 ring-emerald-500/40 shrink-0">
      <img
        src="/logo.jpg"
        alt="Smart Aid Logo"
        className="w-full h-full object-cover scale-105"
      />
    </div>
    <div className="flex flex-col">
      <span className="font-extrabold tracking-tight text-lg sm:text-xl text-slate-900 dark:text-white leading-none">
        SMART <span className="text-emerald-600 dark:text-emerald-400">AID</span>
      </span>
      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 tracking-wider uppercase mt-1">
        Health Awareness
      </span>
    </div>
  </div>
)

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`theme-toggle-btn ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400 transition-transform duration-300">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 dark:text-slate-300 transition-transform duration-300">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )
}

const Navbar = () => {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [prevPath, setPrevPath] = useState(location.pathname)

  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname)
    setOpen(false)
  }

  return (
    <header className="navbar-shell">
      <div className="site-container">
        <div className="navbar-inner">
          <Link to="/" className="navbar-brand" aria-label="Smart Aid home">
            <BrandLogo />
          </Link>

          <nav className="navbar-nav-capsule hidden md:flex items-center" aria-label="Primary navigation">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  'navbar-nav-link ' + (isActive ? 'is-active' : '')
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link to="/symptom-checker" className="navbar-cta-btn">
              <span>Check Symptoms</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition bg-white dark:bg-slate-900"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label="Toggle navigation"
            >
              <NavIcon open={open} />
            </button>
          </div>
        </div>

        <div
          id="mobile-nav"
          className="md:hidden overflow-hidden transition-[max-height,opacity] duration-200 ease-out"
          style={{ maxHeight: open ? '520px' : '0px', opacity: open ? 1 : 0 }}
          hidden={!open}
        >
          <nav className="flex flex-col gap-1.5 py-4 border-t border-slate-200/80 dark:border-slate-800" aria-label="Mobile">
            {LINKS.map((l) => {
              const active = l.end ? location.pathname === l.to : location.pathname.startsWith(l.to)
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={
                    'px-4 py-3 rounded-2xl text-[14.5px] font-bold transition flex items-center justify-between ' +
                    (active
                      ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800 shadow-2xs'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60')
                  }
                >
                  <span>{l.label}</span>
                  {active && (
                    <span className="w-2 h-2 rounded-full bg-teal-600 dark:bg-teal-400" aria-hidden="true" />
                  )}
                </Link>
              )
            })}
            <Link
              to="/symptom-checker"
              onClick={() => setOpen(false)}
              className="mt-2 navbar-cta-btn justify-center text-center py-3 rounded-2xl"
            >
              <span>Check Symptoms</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Navbar
