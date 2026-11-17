const FirstAidCard = ({ guide, onOpen }) => {
  const isEmergency = guide.category === 'Emergency Response' || guide.id === 'cpr' || guide.id === 'choking'

  const renderIcon = () => {
    switch (guide.id) {
      case 'cpr':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
            <path d="M12 5v14M5 12h14" />
          </svg>
        )
      case 'choking':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
        )
      case 'minor-burns':
      case 'heatstroke':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2s4 4 4 8a4 4 0 1 1-8 0c0-2 1-3 1-3s-3 2-3 6a6 6 0 0 0 12 0c0-5-6-11-6-11z" />
          </svg>
        )
      case 'sprains':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        )
      case 'allergic-reaction':
      case 'eye-injury':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )
      case 'poisoning':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        )
      case 'cuts':
      default:
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M12 8v8" />
            <path d="M8 12h8" />
          </svg>
        )
    }
  }

  return (
    <article
      className={
        'card p-5 sm:p-6 flex flex-col justify-between h-full group transition-all duration-200 hover:-translate-y-1 ' +
        (isEmergency ? 'border-rose-200/80 hover:border-rose-300' : 'hover:border-teal-200')
      }
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div
            className={
              'w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ring-1 ' +
              (isEmergency
                ? 'bg-rose-50 text-rose-600 ring-rose-100'
                : 'bg-teal-50 text-teal-700 ring-teal-100/60')
            }
          >
            {renderIcon()}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {isEmergency ? (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                Emergency
              </span>
            ) : (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60">
                {guide.category || 'Guide'}
              </span>
            )}
          </div>
        </div>

        <h3 className="font-bold text-slate-900 text-base sm:text-lg tracking-tight mb-2 group-hover:text-teal-700 transition">
          {guide.title}
        </h3>
        <p className="text-[13.5px] sm:text-[14px] text-slate-600 leading-relaxed line-clamp-3">
          {guide.description}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={() => onOpen && onOpen(guide)}
          className={
            'btn btn-sm btn-block card-action font-semibold text-xs sm:text-sm ' +
            (isEmergency
              ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
              : 'btn-primary')
          }
        >
          View step-by-step
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </article>
  )
}

export default FirstAidCard
