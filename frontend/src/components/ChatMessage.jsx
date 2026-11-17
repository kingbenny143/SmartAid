import { useState } from 'react'

function renderFormattedContent(text) {
  if (!text) return null

  // Split into lines for basic markdown parsing
  const lines = text.split('\n')
  const elements = []
  let listItems = []
  let listType = null // 'ul' or 'ol'
  let keyIdx = 0

  const flushList = () => {
    if (listItems.length > 0) {
      if (listType === 'ul') {
        elements.push(
          <ul key={`ul-${keyIdx++}`} className="my-2.5 space-y-1.5 pl-5 list-disc marker:text-teal-600">
            {listItems.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {formatInline(item)}
              </li>
            ))}
          </ul>
        )
      } else if (listType === 'ol') {
        elements.push(
          <ol key={`ol-${keyIdx++}`} className="my-2.5 space-y-1.5 pl-5 list-decimal marker:text-teal-700 font-medium">
            {listItems.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {formatInline(item)}
              </li>
            ))}
          </ol>
        )
      }
      listItems = []
      listType = null
    }
  }

  const formatInline = (str) => {
    // Replace **bold**
    const parts = str.split(/(\*\*[^*]+\*\*)/g)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>
      }
      return part
    })
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i]
    const trimmed = rawLine.trim()

    if (!trimmed) {
      flushList()
      continue
    }

    // Heading ###
    if (trimmed.startsWith('### ')) {
      flushList()
      elements.push(
        <h4 key={`h-${keyIdx++}`} className="text-[16px] sm:text-[17px] font-bold text-slate-900 tracking-tight mt-3 mb-2">
          {formatInline(trimmed.replace('### ', ''))}
        </h4>
      )
      continue
    }

    // Unordered list item
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (listType !== 'ul') {
        flushList()
        listType = 'ul'
      }
      listItems.push(trimmed.slice(2))
      continue
    }

    // Ordered list item (e.g. 1. )
    const olMatch = trimmed.match(/^(\d+)\.\s+(.*)$/)
    if (olMatch) {
      if (listType !== 'ol') {
        flushList()
        listType = 'ol'
      }
      listItems.push(olMatch[2])
      continue
    }

    // Normal paragraph
    flushList()
    elements.push(
      <p key={`p-${keyIdx++}`} className="leading-relaxed my-1.5 break-words">
        {formatInline(trimmed)}
      </p>
    )
  }

  flushList()
  return elements
}

const ChatMessage = ({ role, content, disclaimer, riskLevel }) => {
  const isUser = role === 'user'
  const isEmergency = riskLevel === 'emergency'
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className={'flex gap-2 sm:gap-3 min-w-0 w-full ' + (isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <div
          className={
            'shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ring-2 ring-white mt-0.5 ' +
            (isEmergency ? 'bg-gradient-to-br from-rose-500 to-rose-700 text-white' : 'bg-gradient-to-br from-teal-500 to-teal-700 text-white')
          }
          style={{ boxShadow: '0 1px 2px rgba(15,118,110,0.18), 0 4px 10px -2px rgba(13,148,136,0.28)' }}
          aria-hidden="true"
        >
          {isEmergency ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
              <path d="M15.5 7h-1a1 1 0 0 0-1 1v.5a1 1 0 0 1-1 1 1 1 0 0 1 1 1V11a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-.5a1 1 0 0 1 1-1 1 1 0 0 1-1-1V8a1 1 0 0 0-1-1Z" />
            </svg>
          )}
        </div>
      )}

      <div
        className={
          'max-w-[88%] sm:max-w-[80%] md:max-w-[74%] rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 text-[14px] sm:text-[14.5px] leading-relaxed transition overflow-visible min-w-0 break-words ' +
          (isUser
            ? 'bg-gradient-to-br from-teal-600 to-teal-700 text-white rounded-br-sm shadow-md shadow-teal-700/15'
            : isEmergency
            ? 'bg-rose-50/70 border border-rose-200 text-slate-800 rounded-bl-sm shadow-sm'
            : 'bg-white border border-slate-100 text-slate-800 rounded-bl-sm shadow-[0_1px_2px_rgba(15,23,42,0.04),0_2px_6px_-1px_rgba(15,23,42,0.04)]')
        }
      >
        {!isUser && (
          <div className="flex items-center justify-between gap-2 mb-2 pb-1 border-b border-slate-100/80">
            <div className="flex items-center gap-2">
              <span className="text-[12.5px] font-bold text-slate-900 tracking-tight whitespace-nowrap">Smart Aid Assistant</span>
              {isEmergency ? (
                <span className="inline-flex items-center gap-1 shrink-0 px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[10px] tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" aria-hidden />
                  EMERGENCY
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 shrink-0 px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-semibold text-[9.5px] tracking-wider">
                  <span className="w-1 h-1 rounded-full bg-emerald-500" aria-hidden />
                  ONLINE
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="text-[11.5px] text-slate-400 hover:text-slate-700 px-1.5 py-0.5 rounded hover:bg-slate-100 transition inline-flex items-center gap-1"
              title="Copy response"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        )}

        <div className="min-w-0 break-words">
          {isUser ? (
            <p className="whitespace-pre-wrap">{content}</p>
          ) : (
            renderFormattedContent(content)
          )}
        </div>

        {disclaimer && !isUser && (
          <div className="mt-3.5 pt-2.5 border-t border-slate-100 text-[11px] sm:text-[11.5px] leading-relaxed text-slate-500 break-words">
            <span className="font-semibold text-slate-600">Note: </span>
            {disclaimer}
          </div>
        )}
      </div>

      {isUser && (
        <div
          className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-sm ring-2 ring-white mt-0.5"
          style={{ boxShadow: '0 1px 2px rgba(15,23,42,0.18), 0 4px 10px -2px rgba(15,23,42,0.18)' }}
          aria-hidden="true"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      )}
    </div>
  )
}

export default ChatMessage
