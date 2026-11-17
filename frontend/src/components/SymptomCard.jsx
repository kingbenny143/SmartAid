const SymptomCard = ({ symptom, selected, onToggle }) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={'symptom-card flex flex-col h-full w-full relative ' + (selected ? 'is-selected' : '')}
    >
      <div className="absolute top-3 right-3 z-10">
        <div
          className={
            'w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ' +
            (selected
              ? 'bg-teal-600 border-teal-600 text-white shadow-[0_0_0_3px_rgba(20,184,166,0.15)]'
              : 'bg-white border-slate-300')
          }
          aria-hidden="true"
        >
          {selected && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
      </div>
      <div className="flex-1 min-w-0 pr-8">
        <h3 className="font-semibold text-[15px] text-slate-900 leading-snug">
          {symptom.name}
        </h3>
        <p className="text-[11px] font-medium uppercase tracking-wider text-teal-700 mt-1.5 opacity-80">
          {symptom.category}
        </p>
        <p className="text-[13px] text-slate-600 mt-2 leading-relaxed">
          {symptom.description}
        </p>
      </div>
    </button>
  )
}

export default SymptomCard
