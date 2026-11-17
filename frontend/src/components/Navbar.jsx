import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

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
    <div
      className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white flex items-center justify-center font-bold shadow-md shadow-teal-700/20 ring-4 ring-teal-50"
    >
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 5v14M5 12h14" />
      </svg>
    </div>
    <div className="flex flex-col">
      <span className="font-extrabold tracking-tight text-lg sm:text-xl text-slate-900 leading-none">
        SMART <span className="text-teal-600">AID</span>
      </span>
      <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-1">
        Health Awareness
      </span>
    </div>
  </div>
)

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

          <div className="hidden md:flex items-center">
            <Link to="/symptom-checker" className="navbar-cta-btn">
              <span>Check Symptoms</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition bg-white"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label="Toggle navigation"
          >
            <NavIcon open={open} />
          </button>
        </div>

        <div
          id="mobile-nav"
          className="md:hidden overflow-hidden transition-[max-height,opacity] duration-200 ease-out"
          style={{ maxHeight: open ? '520px' : '0px', opacity: open ? 1 : 0 }}
          hidden={!open}
        >
          <nav className="flex flex-col gap-1.5 py-4 border-t border-slate-200/80" aria-label="Mobile">
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
                      ? 'bg-teal-50 text-teal-800 border border-teal-200/80 shadow-2xs'
                      : 'text-slate-700 hover:bg-slate-50')
                  }
                >
                  <span>{l.label}</span>
                  {active && (
                    <span className="w-2 h-2 rounded-full bg-teal-600" aria-hidden="true" />
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
