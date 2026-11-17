import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SymptomCard from '../components/SymptomCard.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import Disclaimer from '../components/Disclaimer.jsx'
import { getSymptomsList, fetchSymptoms, assessSymptoms } from '../services/api.js'

const DURATION_OPTIONS = [
  { value: 'Less than 1 day', label: 'Less than 1 day', sub: 'Onset today' },
  { value: '1–3 days', label: '1–3 days', sub: 'Recent onset' },
  { value: '4–7 days', label: '4–7 days', sub: 'Several days' },
  { value: 'More than 7 days', label: 'More than 7 days', sub: 'Ongoing concern' },
]

const SEVERITY_OPTIONS = [
  { value: 'mild', label: 'Mild', desc: 'Noticeable but tolerable with minimal daily disruption', dot: 'bg-emerald-500', ring: 'ring-emerald-200' },
  { value: 'moderate', label: 'Moderate', desc: 'Interferes with work, sleep, or daily activities', dot: 'bg-amber-500', ring: 'ring-amber-200' },
  { value: 'severe', label: 'Severe', desc: 'Significant distress, debilitating pain, or acute concern', dot: 'bg-rose-500', ring: 'ring-rose-200' },
]

const StepHeader = ({ num, title, subtitle }) => (
  <div className="flex items-start gap-3 mb-5">
    <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 text-white font-bold text-[15px] flex items-center justify-center shadow-sm shadow-teal-600/25">
      {num}
    </div>
    <div className="min-w-0 flex-1">
      <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-tight">{title}</h2>
      {subtitle && <p className="text-[13.5px] text-slate-500 mt-1 leading-relaxed">{subtitle}</p>}
    </div>
  </div>
)

const SymptomChecker = () => {
  const navigate = useNavigate()
  const [symptoms, setSymptoms] = useState(getSymptomsList())
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [duration, setDuration] = useState('1–3 days')
  const [severity, setSeverity] = useState('mild')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    fetchSymptoms().then((data) => {
      if (active && data && data.symptoms) {
        setSymptoms(data.symptoms)
      }
    })
    return () => {
      active = false
    }
  }, [])

  const categories = ['All', ...Array.from(new Set(symptoms.map((s) => s.category || 'General')))]

  const filteredSymptoms = symptoms.filter((s) => {
    const matchCat = selectedCategory === 'All' || s.category === selectedCategory
    const matchQuery =
      !searchQuery.trim() ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchQuery
  })

  const toggle = (id) =>
    setSelectedIds((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  const clearSelection = () => {
    setSelectedIds([])
  }

  const canSubmit = selectedIds.length > 0 && !submitting

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (selectedIds.length === 0) {
      setError('Please select at least one symptom to proceed with the assessment.')
      return
    }
    setError('')
    setSubmitting(true)

    try {
      const selectedSymptoms = symptoms
        .filter((s) => selectedIds.includes(s.id))
        .map((s) => s.id)

      const result = await assessSymptoms({
        symptoms: selectedSymptoms,
        duration,
        severity,
      })

      // Store in sessionStorage for assessment page
      sessionStorage.setItem('assessment', JSON.stringify({
        ...result,
        selectedIds,
        duration,
        severity,
      }))

      navigate('/assessment-result')
    } catch (err) {
      console.error('Assessment error:', err)
      const status = String(err.message || '')
      if (status.includes('422')) {
        setError('Please select at least one valid symptom and try again.')
      } else if (status.startsWith('4') || status.startsWith('5')) {
        setError('Smart Aid assessment service encountered a problem. Please try again shortly.')
      } else {
        setError("Smart Aid couldn't connect to the health guidance service. Please ensure the backend is running and try again.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (submitting) {
    return (
      <div className="page-wrap px-4 py-16">
        <div className="max-w-lg mx-auto text-center py-10">
          <LoadingSpinner size="lg" label="Analyzing health factors..." />
          <p className="text-sm text-slate-500 mt-6 leading-relaxed">
            Smart Aid is matching your symptoms against clinical guidance indicators and safety red flags.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-wrap page-wrap--symptomchecker min-w-0 max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-10">
      <header className="page-header fade-in mb-8 sm:mb-10 min-w-0">
        <span className="page-eyebrow">Interactive Health Assessment</span>
        <h1 className="page-title text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Symptom Checker
        </h1>
        <p className="text-[15px] sm:text-[16px] leading-relaxed text-slate-600 max-w-2xl break-words">
          Select what you're experiencing to receive structured health awareness, supportive self-care recommendations, and safety red flags.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="sc-form space-y-0 fade-in">
        {/* Step 1 — Select Symptoms */}
        <section id="step-symptoms" className="sc-step min-w-0 mb-8 sm:mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <StepHeader
              num="01"
              title="Select Symptoms"
              subtitle="Choose all symptoms that apply to you right now."
            />
            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                  {selectedIds.length} selected
                </span>
                <button
                  type="button"
                  onClick={clearSelection}
                  className="text-xs text-slate-500 hover:text-rose-600 underline font-medium transition"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 p-4 rounded-2xl border border-rose-200 bg-rose-50 text-rose-800 text-[14px] leading-relaxed flex items-start gap-3 shadow-sm min-w-0 break-words"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5 text-rose-600" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span className="min-w-0 break-words font-medium">{error}</span>
            </div>
          )}

          {/* Search & Category Filter Controls */}
          <div className="mb-6 space-y-3">
            <div className="relative max-w-md">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search symptoms (e.g. fever, cough, joint)..."
                className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs p-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {categories.map((cat) => {
                const active = selectedCategory === cat
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={
                      'px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ' +
                      (active
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50')
                    }
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Grid of Symptoms */}
          {filteredSymptoms.length > 0 ? (
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid-flow-row auto-rows-fr items-stretch">
              {filteredSymptoms.map((s) => (
                <div key={s.id} className="min-w-0 flex flex-col min-h-full">
                  <SymptomCard
                    symptom={s}
                    selected={selectedIds.includes(s.id)}
                    onToggle={() => toggle(s.id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
              <p className="text-sm text-slate-500">No symptoms found matching "{searchQuery}".</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('All')
                }}
                className="mt-2 text-xs font-semibold text-teal-600 hover:underline"
              >
                Reset filters
              </button>
            </div>
          )}
        </section>

        {/* Step 2 — Duration */}
        <section id="step-duration" className="sc-step min-w-0 mb-7 sm:mb-8">
          <StepHeader
            num="02"
            title="Duration"
            subtitle="How long have you been experiencing these symptoms?"
          />
          <fieldset className="min-w-0">
            <legend className="sr-only">Duration of symptoms</legend>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 grid-flow-row auto-rows-fr items-stretch">
              {DURATION_OPTIONS.map((opt) => {
                const isSel = duration === opt.value
                return (
                  <label
                    key={opt.value}
                    className={'sc-option-card flex h-full flex-col justify-start ' + (isSel ? 'is-selected' : '')}
                  >
                    <input
                      type="radio"
                      name="duration"
                      value={opt.value}
                      checked={isSel}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                    <div className="w-full flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-[14.5px] font-semibold text-slate-900 leading-tight">{opt.label}</div>
                        <div className="text-[12.5px] text-slate-500 mt-1">{opt.sub}</div>
                      </div>
                      <span className="sc-option-indicator shrink-0 mt-0.5" aria-hidden="true" />
                    </div>
                  </label>
                )
              })}
            </div>
          </fieldset>
        </section>

        {/* Step 3 — Severity */}
        <section id="step-severity" className="sc-step min-w-0 mb-7">
          <StepHeader
            num="03"
            title="Perceived Severity"
            subtitle="How much do these symptoms disrupt your everyday function?"
          />
          <fieldset className="min-w-0">
            <legend className="sr-only">Symptom Severity</legend>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 grid-flow-row auto-rows-fr items-stretch">
              {SEVERITY_OPTIONS.map((opt) => {
                const isSel = severity === opt.value
                return (
                  <label
                    key={opt.value}
                    className={'sc-option-card flex h-full flex-col justify-start ' + (isSel ? 'is-selected' : '')}
                  >
                    <input
                      type="radio"
                      name="severity"
                      value={opt.value}
                      checked={isSel}
                      onChange={(e) => setSeverity(e.target.value)}
                    />
                    <div className="w-full flex items-start gap-3">
                      <span className="shrink-0 mt-0.5 flex items-center justify-center" aria-hidden="true">
                        <span className={`w-4 h-4 rounded-full ${opt.dot} ring-4 ${opt.ring} transition-all ${isSel ? 'scale-110' : 'opacity-70 scale-90'}`} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[14.5px] font-bold text-slate-900 leading-tight">{opt.label}</div>
                        <div className="text-[12.5px] text-slate-500 mt-1 leading-relaxed">{opt.desc}</div>
                      </div>
                    </div>
                  </label>
                )
              })}
            </div>
          </fieldset>
        </section>

        {/* Disclaimer */}
        <section className="sc-disclaimer min-w-0 mb-6">
          <Disclaimer tone="amber" />
        </section>

        {/* Submit */}
        <section className="sc-submit min-w-0 flex flex-col items-center justify-center pb-12 sm:pb-16 gap-3">
          <button
            type="submit"
            disabled={!canSubmit}
            className="sc-analyze-btn shadow-lg shadow-teal-600/20"
          >
            Analyze Symptoms
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
          {selectedIds.length === 0 && (
            <p className="text-xs text-slate-400">Please select at least 1 symptom above to enable analysis</p>
          )}
        </section>
      </form>
    </div>
  )
}

export default SymptomChecker
