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
  <div className="flex items-center gap-2.5 shrink-0">
    <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 text-white flex items-center justify-center font-bold shadow-sm" style={{ boxShadow: '0 1px 2px rgba(15,118,110,0.18), 0 4px 10px -2px rgba(13,148,136,0.35)' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 5v14M5 12h14" />
      </svg>
    </span>
    <span className="font-bold tracking-tight text-lg sm:text-xl text-slate-900">
      SMART <span className="text-teal-600">AID</span>
    </span>
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
          <Link to="/" className="navbar-brand flex items-center" aria-label="Smart Aid home">
            <BrandLogo />
          </Link>

          <nav className="navbar-links hidden md:flex items-center" aria-label="Primary">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  'px-4 py-2 rounded-xl text-sm font-semibold transition duration-150 whitespace-nowrap ' +
                  (isActive
                    ? 'bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50')
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="navbar-cta hidden md:flex">
            <Link to="/symptom-checker" className="btn btn-primary btn-sm">
              Check Symptoms
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden justify-self-end inline-flex items-center justify-center w-11 h-11 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition bg-white"
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
          <nav className="flex flex-col gap-1 py-3 border-t border-slate-100" aria-label="Mobile">
            {LINKS.map((l) => {
              const active = location.pathname === l.to
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={
                    'px-4 py-3 rounded-xl text-sm font-semibold transition ' +
                    (active
                      ? 'bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-100'
                      : 'text-slate-700 hover:bg-slate-50')
                  }
                >
                  {l.label}
                </Link>
              )
            })}
            <Link
              to="/symptom-checker"
              onClick={() => setOpen(false)}
              className="mt-2 btn btn-primary btn-block"
            >
              Check Symptoms
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Navbar
