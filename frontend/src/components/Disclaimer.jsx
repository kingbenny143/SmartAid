const TONES = {
  default: {
    wrap: 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-900/70 dark:border-slate-800 dark:text-slate-300',
    strong: 'text-slate-700 dark:text-slate-200',
    icon: 'info',
  },
  amber: {
    wrap: 'bg-amber-50/80 border-amber-200 text-amber-900 dark:bg-amber-950/40 dark:border-amber-800/60 dark:text-amber-200',
    strong: 'text-amber-900 dark:text-amber-100',
    icon: 'warn',
  },
  subtle: {
    wrap: 'bg-transparent border border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400',
    strong: 'text-slate-600 dark:text-slate-300',
    icon: 'info',
  },
}

const ICON = {
  info: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 mt-0.5">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  warn: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 mt-0.5">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  none: null,
}

const Disclaimer = ({ tone = 'default', className = '' }) => {
  const t = TONES[tone] || TONES.default
  const isSubtle = tone === 'subtle'
  return (
    <div
      role="note"
      className={
        'rounded-xl border px-4 sm:px-5 py-3 sm:py-3.5 text-[12px] sm:text-[12.5px] leading-relaxed flex items-start gap-3 min-w-0 break-words ' +
        t.wrap +
        ' ' +
        className
      }
      style={isSubtle ? { letterSpacing: '0.005em' } : undefined}
    >
      {ICON[t.icon] && (
        <div className="shrink-0 mt-0.5 opacity-80">{ICON[t.icon]}</div>
      )}
      <div className="flex-1 min-w-0" style={{ lineHeight: '1.65' }}>
        <strong className={'font-semibold ' + t.strong}>Disclaimer:&nbsp;</strong>
        <span className="break-words">
          Smart Aid provides informational health guidance and first-aid education. It does not provide a medical diagnosis or replace a qualified healthcare professional. Seek professional medical care when appropriate.
        </span>
      </div>
    </div>
  )
}

export default Disclaimer
