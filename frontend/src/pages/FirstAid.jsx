import { useEffect, useRef, useState } from 'react'
import FirstAidCard from '../components/FirstAidCard.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import Disclaimer from '../components/Disclaimer.jsx'
import { getFirstAidGuides, getFirstAidGuideById } from '../services/api.js'

const FirstAid = () => {
  const [topics, setTopics] = useState([])
  const [categories, setCategories] = useState(['All'])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [active, setActive] = useState(null)
  const [activeLoading, setActiveLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [disclaimer, setDisclaimer] = useState('')

  const activeRequestRef = useRef(0)
  const closeBtnRef = useRef(null)

  useEffect(() => {
    let ignore = false
    ;(async () => {
      try {
        const res = await getFirstAidGuides()
        if (ignore) return
        const loadedTopics = res?.topics || []
        setTopics(loadedTopics)
        setDisclaimer(res?.disclaimer || '')

        const uniqueCats = ['All', ...Array.from(new Set(loadedTopics.map((t) => t.category || 'General')))]
        setCategories(uniqueCats)
      } catch (e) {
        if (ignore) return
        console.error('First aid load error:', e)
        setError(
          "Smart Aid couldn't connect to the health guidance service. Please verify that the backend is running and try again."
        )
      } finally {
        if (!ignore) setLoading(false)
      }
    })()
    return () => {
      ignore = true
    }
  }, [])

  // Lock background scroll & handle Escape key when modal is open
  const isModalOpen = Boolean(active)
  useEffect(() => {
    if (!isModalOpen) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeBtnRef.current?.focus()

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActive(null)
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isModalOpen])

  const openTopic = async (guide) => {
    const requestId = ++activeRequestRef.current
    setActiveLoading(true)
    setActive({ id: guide.id, title: guide.title, description: guide.description, category: guide.category })

    try {
      const res = await getFirstAidGuideById(guide.id)
      if (activeRequestRef.current !== requestId) return
      setActive(res?.topic || guide)
    } catch (e) {
      if (activeRequestRef.current !== requestId) return
      console.error('First aid detail error:', e)
      setActive(guide)
    } finally {
      if (activeRequestRef.current === requestId) {
        setActiveLoading(false)
      }
    }
  }

  const filtered = topics.filter((g) => {
    const matchCategory = selectedCategory === 'All' || g.category === selectedCategory
    const q = query.trim().toLowerCase()
    const matchQuery =
      !q ||
      (g.title || '').toLowerCase().includes(q) ||
      (g.description || '').toLowerCase().includes(q)
    return matchCategory && matchQuery
  })

  const isEmergencyGuide = active?.category === 'Emergency Response' || active?.id === 'cpr' || active?.id === 'choking'

  return (
    <div className="page-wrap max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 min-w-0">
      <header className="page-header mb-8 min-w-0">
        <span className="page-eyebrow inline-block text-xs font-bold uppercase tracking-widest text-teal-700 mb-2">
          Educational Protocols
        </span>
        <h1 className="page-title text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
          First Aid Guides
        </h1>
        <p className="text-[15px] sm:text-[16px] leading-relaxed text-slate-600 max-w-2xl break-words">
          Clear, step-by-step educational first-aid instructions for everyday wounds, sudden injuries, and emergency response.
        </p>

        {/* Consolidated Disclaimer */}
        <div className="mt-5 max-w-2xl space-y-3 min-w-0">
          <Disclaimer tone="amber" />
        </div>
      </header>

      {/* Search & Category Filter Controls */}
      <div className="mb-8 space-y-4 min-w-0">
        <div className="search-input-wrap">
          <svg
            className="search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            id="fa-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search guides (e.g. burn, cut, sprain, CPR, choking, heat)..."
            className="search-input"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="search-clear-btn"
            >
              ✕
            </button>
          )}
        </div>

        {/* Categories Bar */}
        {categories.length > 1 && (
          <div className="filter-chips-bar">
            {categories.map((cat) => {
              const active = selectedCategory === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={'pill-filter-chip ' + (active ? 'is-active' : '')}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {loading && (
        <div className="py-16">
          <LoadingSpinner label="Loading first-aid guides..." />
        </div>
      )}

      {!loading && error && (
        <div
          role="alert"
          className="p-5 rounded-2xl border border-rose-200 bg-rose-50 text-rose-800 text-[14.5px] leading-relaxed flex items-start gap-3 shadow-sm min-w-0"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0 mt-0.5 text-rose-600"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span className="min-w-0 break-words">{error}</span>
        </div>
      )}

      {!loading && !error && (
        <>
          {filtered.length > 0 ? (
            <div className="grid-cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((g) => (
                <FirstAidCard key={g.id} guide={g} onOpen={openTopic} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 sm:py-20 rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 min-w-0 mt-2">
              <p className="text-slate-600 text-[15px] px-4">
                No guides match <span className="font-semibold text-slate-800">"{query}"</span> in {selectedCategory}.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setSelectedCategory('All')
                }}
                className="mt-3 text-[13.5px] font-semibold text-teal-700 hover:text-teal-800 px-4 py-1.5 rounded-lg hover:bg-teal-50 transition"
              >
                Reset filters
              </button>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      {active && (
        <div
          className="fa-modal-backdrop"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="fa-modal-title"
        >
          {/* Modal Container */}
          <div
            className="fa-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Pinned Header */}
            <div className="fa-modal-head">
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-[11px] font-bold uppercase tracking-wider border border-teal-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600" aria-hidden="true" />
                    {active.category || 'First-Aid Guide'}
                  </span>
                  {isEmergencyGuide && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-[11px] font-bold uppercase tracking-wider border border-rose-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" aria-hidden="true" />
                      Emergency Action
                    </span>
                  )}
                </div>
                <h2
                  id="fa-modal-title"
                  className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight break-words"
                >
                  {active.title}
                </h2>
                {active.description && (
                  <p className="text-[14px] sm:text-[15px] text-slate-600 mt-2 leading-relaxed">
                    {active.description}
                  </p>
                )}
              </div>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={() => setActive(null)}
                className="fa-modal-close-btn"
                aria-label="Close guide"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="fa-modal-content">
              {activeLoading ? (
                <div className="py-12">
                  <LoadingSpinner label="Loading guide details..." />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Warning banner */}
                  {active.warning && (
                    <section className="fa-warning-card">
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center border border-rose-300 shrink-0">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                          </svg>
                        </div>
                        <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-rose-900">
                          Critical Safety Notice
                        </h3>
                      </div>
                      <p className="text-[14px] sm:text-[14.5px] leading-relaxed text-rose-950 font-medium break-words pl-0.5">
                        {active.warning}
                      </p>
                    </section>
                  )}

                  {/* Step by Step */}
                  {active.steps && active.steps.length > 0 ? (
                    <section>
                      <div className="flex items-center justify-between gap-2 mb-3.5">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Step-by-Step Action Guide
                        </h3>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {active.steps.length} {active.steps.length === 1 ? 'Step' : 'Steps'}
                        </span>
                      </div>
                      <ol className="space-y-3.5">
                        {active.steps.map((s, i) => (
                          <li key={i} className="fa-step-item">
                            <span className={'fa-step-num ' + (isEmergencyGuide ? 'is-emergency' : '')}>
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <div className="flex-1 min-w-0 pt-1">
                              <p className="text-[14.5px] sm:text-[15px] leading-relaxed text-slate-800 font-medium break-words">
                                {s}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </section>
                  ) : (
                    <p className="text-sm text-slate-500 text-center py-6">
                      No detailed steps available for this guide.
                    </p>
                  )}

                  <section className="text-[11.5px] sm:text-[12px] text-slate-500 leading-relaxed border-t border-slate-100 pt-4">
                    {disclaimer || 'First-aid guidance is educational and does not substitute for certified clinical training. In case of life-threatening emergency, call 911 / 112 immediately.'}
                  </section>
                </div>
              )}
            </div>

            {/* Pinned Footer */}
            <div className="fa-modal-foot">
              <span className="text-xs text-slate-500 hidden sm:inline flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" aria-hidden="true" />
                Emergency? Dial <strong>911 / 112</strong> immediately
              </span>
              <button
                type="button"
                onClick={() => setActive(null)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FirstAid
