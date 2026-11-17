const riskStyles = {
  low: {
    key: 'low',
    label: 'LOW ATTENTION',
    lead: 'Continue monitoring and follow general self-care guidance.',
    dot: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
    ),
  },
  moderate: {
    key: 'moderate',
    label: 'MODERATE ATTENTION',
    lead: 'Monitor symptoms closely and consider consulting a healthcare provider if they worsen.',
    dot: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
    ),
  },
  high: {
    key: 'high',
    label: 'HIGH ATTENTION',
    lead: 'Seek prompt medical evaluation. Do not delay professional care.',
    dot: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
    ),
  },
}

const SectionCard = ({ title, icon, tone = 'neutral', children }) => {
  const tones = {
    neutral: 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100',
    success: 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200',
    warning: 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-100 dark:border-amber-800/40 text-amber-900 dark:text-amber-200',
    danger: 'bg-rose-50/50 dark:bg-rose-950/25 border-rose-100 dark:border-rose-800/40 text-rose-900 dark:text-rose-200',
    info: 'bg-sky-50/40 dark:bg-sky-950/20 border-sky-100 dark:border-sky-800/40 text-sky-900 dark:text-sky-200',
  }
  const headerTones = {
    neutral: 'text-slate-900 dark:text-white',
    success: 'text-emerald-800 dark:text-emerald-300',
    warning: 'text-amber-800 dark:text-amber-300',
    danger: 'text-rose-800 dark:text-rose-300',
    info: 'text-sky-800 dark:text-sky-300',
  }
  return (
    <section className={`rounded-2xl p-6 sm:p-7 border shadow-sm h-full flex flex-col min-w-0 ${tones[tone]}`}>
      <header className="flex items-center gap-3 mb-5 shrink-0 min-w-0">
        {icon && <div className={`shrink-0 ${headerTones[tone]}`}>{icon}</div>}
        <h2 className={`text-[17px] font-bold tracking-tight truncate min-w-0 ${headerTones[tone]}`}>{title}</h2>
      </header>
      <div className="flex-1 min-w-0">{children}</div>
    </section>
  )
}

const NumberedList = ({ items, accent = 'teal' }) => {
  const accents = {
    teal: 'bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200',
    sky: 'bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-200',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200',
  }
  return (
    <ul className="space-y-3.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-4">
          <span className={`shrink-0 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center mt-0.5 ${accents[accent]}`}>
            {i + 1}
          </span>
          <span className="flex-1 min-w-0 text-[14.5px] leading-relaxed text-slate-700 dark:text-slate-300 break-words">{item}</span>
        </li>
      ))}
    </ul>
  )
}

const ResultCard = ({ result }) => {
  const risk = riskStyles[result.risk_level] || riskStyles.low

  return (
    <div className="space-y-6 sm:space-y-8 fade-in min-w-0">
      {/* Triage banner */}
      <div className={`status-banner ${risk.key}`} style={{ padding: '24px 28px' }}>
        <div className="flex flex-wrap items-start gap-4 pl-1 w-full min-w-0">
          <div className={`status-badge ${risk.key} gap-2 shrink-0`}>
            <span aria-hidden="true">{risk.dot}</span>
            <span>{risk.label}</span>
          </div>
          <div className="flex-1 min-w-[200px]">
            <p className="text-[14.5px] leading-relaxed opacity-90 font-medium break-words">
              {risk.lead}
            </p>
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-wider opacity-75 shrink-0">
            Informational assessment
          </span>
        </div>
      </div>

      {/* 2-col grid — ensure equal heights */}
      {(result.possible_categories?.length > 0 || result.guidance?.length > 0) && (
        <div className="grid gap-6 md:grid-cols-2 items-stretch">
          {result.possible_categories && result.possible_categories.length > 0 && (
            <div className="h-full min-w-0">
              <SectionCard
                title="Possible Categories"
                tone="info"
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /><path d="M12 2L2 7l10 5 10-5-10-5z" /></svg>
                }
              >
                <ul className="flex flex-wrap gap-2">
                  {result.possible_categories.map((c, i) => (
                    <li
                      key={i}
                      className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-sky-100 dark:border-sky-900/60 text-slate-800 dark:text-slate-100 text-[13.5px] font-semibold shadow-sm break-words"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
                <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-4 leading-relaxed">
                  Categories are informational and based on general health-pattern matching.
                </p>
              </SectionCard>
            </div>
          )}

          {result.guidance && result.guidance.length > 0 && (
            <div className="h-full min-w-0">
              <SectionCard
                title="Guidance"
                tone="success"
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
                }
              >
                <NumberedList items={result.guidance} accent="emerald" />
              </SectionCard>
            </div>
          )}
        </div>
      )}

      {result.red_flags && result.red_flags.length > 0 && (
        <div className="min-w-0">
          <SectionCard
            title="Red Flags"
            tone="danger"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
            }
          >
            <ul className="space-y-3">
              {result.red_flags.map((r, i) => (
                <li key={i} className="flex items-start gap-3 min-w-0">
                  <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-rose-500" aria-hidden="true" />
                  <span className="flex-1 min-w-0 text-[14.5px] leading-relaxed text-rose-900 dark:text-rose-200 font-medium break-words">
                    {r}
                  </span>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      )}

      {result.next_steps && result.next_steps.length > 0 && (
        <div className="min-w-0">
          <SectionCard
            title="Next Steps"
            tone="neutral"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="13 17 18 12 13 7" /><polyline points="6 17 11 12 6 7" /></svg>
            }
          >
            <NumberedList items={result.next_steps} accent="sky" />
          </SectionCard>
        </div>
      )}
    </div>
  )
}

export default ResultCard
