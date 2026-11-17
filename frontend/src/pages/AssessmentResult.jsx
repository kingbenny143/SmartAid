import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ResultCard from '../components/ResultCard.jsx'
import Disclaimer from '../components/Disclaimer.jsx'

const getInitialAssessment = () => {
  try {
    const stored = sessionStorage.getItem('assessment')
    return stored ? JSON.parse(stored) : null
  } catch (e) {
    console.error('Failed to parse stored assessment:', e)
    return null
  }
}

const AssessmentResult = () => {
  const navigate = useNavigate()
  const [result] = useState(getInitialAssessment)

  if (!result) {
    return (
      <div className="page-wrap px-4 py-12">
        <div className="max-w-lg mx-auto text-center py-12 fade-in">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center border border-slate-200 dark:border-slate-700">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 12l2 2 4-4" />
              <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.39 0 4.57.94 6.19 2.48" />
            </svg>
          </div>
          <span className="page-eyebrow !mb-4">No Data</span>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
            No Assessment Available
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
            Please run the Symptom Checker first to generate an informational health assessment.
          </p>
          <Link to="/symptom-checker" className="btn btn-primary btn-lg">
            Start Symptom Checker
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>
    )
  }

  const symptomsList = result.matched_symptoms || result.selectedIds || []

  return (
    <div className="page-wrap min-w-0 max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <header className="mb-8 flex flex-col sm:flex-row items-start justify-between gap-4 fade-in min-w-0">
        <div className="max-w-2xl min-w-0">
          <span className="page-eyebrow">Triage &amp; Guidance</span>
          <h1 className="page-title text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight !mb-2">
            Assessment Result
          </h1>
          <p className="text-[15px] leading-relaxed text-slate-600 dark:text-slate-300 break-words">
            Evidence-informed health guidance based on your selected symptoms, duration, and severity.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/symptom-checker')}
          className="btn btn-secondary btn-sm shrink-0 w-full sm:w-auto justify-center"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Adjust Symptoms
        </button>
      </header>

      {/* Snapshot badges */}
      <div className="mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
        <span className="font-semibold text-slate-800 dark:text-slate-200">Evaluated Parameters:</span>
        {result.duration && (
          <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium">
            Duration: <strong className="text-slate-800 dark:text-slate-100">{result.duration}</strong>
          </span>
        )}
        {result.severity && (
          <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium capitalize">
            Severity: <strong className="text-slate-800 dark:text-slate-100">{result.severity}</strong>
          </span>
        )}
        {symptomsList.length > 0 && (
          <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium">
            Symptoms: <strong className="text-slate-800 dark:text-slate-100">{symptomsList.join(', ')}</strong>
          </span>
        )}
      </div>

      <ResultCard result={result} />

      {result.disclaimer && (
        <div className="mt-8 p-5 rounded-2xl border border-amber-200 dark:border-amber-800/60 bg-gradient-to-br from-amber-50/80 to-amber-50/40 dark:from-amber-950/40 dark:to-amber-950/20 text-[14px] leading-relaxed text-amber-900 dark:text-amber-200 flex items-start gap-3 shadow-sm min-w-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5 text-amber-700 dark:text-amber-400" aria-hidden="true">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div className="flex-1 min-w-0 break-words">
            <strong className="font-bold">Medical Disclaimer:&nbsp;</strong>
            {result.disclaimer}
          </div>
        </div>
      )}

      <div className="mt-6 min-w-0">
        <Disclaimer tone="amber" />
      </div>

      {/* Navigation action buttons */}
      <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full">
        <button
          type="button"
          onClick={() => {
            sessionStorage.removeItem('assessment')
            navigate('/symptom-checker')
          }}
          className="btn btn-primary btn-lg w-full sm:w-auto justify-center"
        >
          Start New Assessment
        </button>
        <Link
          to="/assistant"
          className="btn btn-secondary btn-lg w-full sm:w-auto justify-center"
        >
          Discuss With AI Assistant
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </Link>
        <Link
          to="/first-aid"
          className="btn btn-secondary btn-lg w-full sm:w-auto justify-center"
        >
          Explore First Aid
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>
    </div>
  )
}

export default AssessmentResult
