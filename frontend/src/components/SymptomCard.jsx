const SymptomCard = ({ symptom, selected, onToggle }) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={'symptom-card-item ' + (selected ? 'is-selected' : '')}
    >
      <div className="symptom-card-body flex-1 min-w-0 pr-2">
        <div className="symptom-card-header">
          <h3 className="symptom-card-title">{symptom.name}</h3>
          <span className="symptom-card-cat">{symptom.category}</span>
        </div>
        <p className="symptom-card-desc">{symptom.description}</p>
      </div>

      <div className={'symptom-card-checkbox ' + (selected ? 'is-checked' : '')}>
        {selected && (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
    </button>
  )
}

export default SymptomCard
