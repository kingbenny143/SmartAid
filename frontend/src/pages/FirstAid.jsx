import { useEffect, useRef, useState } from 'react'
import FirstAidCard from '../components/FirstAidCard.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import Disclaimer from '../components/Disclaimer.jsx'
import { getFirstAidGuides, getFirstAidGuideById } from '../services/api.js'

const StepIcon = ({ num }) => (
  <div className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 text-white flex items-center justify-center font-black text-xs sm:text-sm tracking-tighter shadow-md shadow-teal-600/20 ring-4 ring-teal-50">
    {String(num).padStart(2, '0')}
  </div>
)

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
        <div className="relative max-w-xl">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
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
            className="form-input w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-10 py-3 text-[14.5px] text-slate-800 placeholder:text-slate-400 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition"
            >
              ✕
            </button>
          )}
        </div>

        {/* Categories Bar */}
        {categories.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {categories.map((cat) => {
              const active = selectedCategory === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={
                    'px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ' +
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
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="fa-modal-title"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Modal Card */}
          <div
            className="relative z-10 bg-white w-full max-w-2xl max-h-[92dvh] sm:rounded-3xl rounded-t-[28px] shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Pinned Header */}
            <div className="shrink-0 bg-gradient-to-br from-white via-white to-slate-50/60 border-b border-slate-100 px-5 sm:px-8 py-4 sm:py-6 flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 text-[10.5px] font-bold uppercase tracking-widest border border-teal-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500" aria-hidden="true" />
                    {active.category || 'First-Aid Guide'}
                  </span>
                  {isEmergencyGuide && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10.5px] font-bold uppercase tracking-widest border border-rose-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" aria-hidden="true" />
                      Emergency Action
                    </span>
                  )}
                </div>
                <h2
                  id="fa-modal-title"
                  className="text-xl sm:text-[26px] font-bold tracking-tight text-slate-900 leading-snug break-words"
                >
                  {active.title}
                </h2>
                {active.description && (
                  <p className="text-[13.5px] sm:text-[14.5px] text-slate-600 mt-1.5 leading-relaxed">
                    {active.description}
                  </p>
                )}
              </div>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={() => setActive(null)}
                className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-2xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 active:scale-95 flex items-center justify-center transition border border-slate-200"
                aria-label="Close guide"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-8 py-5 sm:py-7">
              {activeLoading ? (
                <div className="py-12">
                  <LoadingSpinner label="Loading guide details..." />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Warning banner */}
                  {active.warning && (
                    <section className="rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-rose-50 via-rose-50/80 to-amber-50/50 border border-rose-200 shadow-2xs">
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center border border-rose-200 shrink-0">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                          </svg>
                        </div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-rose-800">
                          Critical Safety Notice
                        </h3>
                      </div>
                      <p className="text-[13.5px] sm:text-[14px] leading-relaxed text-rose-900 font-medium break-words">
                        {active.warning}
                      </p>
                    </section>
                  )}

                  {/* Step by Step */}
                  {active.steps && active.steps.length > 0 ? (
                    <section>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                        Action Steps
                      </h3>
                      <ol className="space-y-3">
                        {active.steps.map((s, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl bg-slate-50/70 border border-slate-100 hover:border-teal-100 transition"
                          >
                            <StepIcon num={i + 1} />
                            <div className="flex-1 min-w-0 pt-0.5">
                              <p className="text-[14px] sm:text-[14.5px] leading-relaxed text-slate-800 font-medium break-words">
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

                  <section className="text-[12px] text-slate-400 leading-relaxed border-t border-slate-100 pt-4">
                    {disclaimer || 'First-aid guidance is educational and does not substitute for certified clinical training. In case of life-threatening emergency, call 911 / 112 immediately.'}
                  </section>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FirstAid
