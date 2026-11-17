import { useState } from 'react'

function formatInline(text) {
  if (!text) return ''

  // Match bold (**...** or __...__), italics (*...* or _..._), and inline code (`...`)
  const tokenRegex = /(\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|`[^`]+`)/g
  const parts = text.split(tokenRegex)

  return parts.map((part, i) => {
    if (!part) return null
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={i} className="font-semibold text-slate-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.startsWith('__') && part.endsWith('__') && part.length >= 4) {
      return (
        <strong key={i} className="font-semibold text-slate-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return (
        <em key={i} className="italic text-slate-700 dark:text-slate-300">
          {part.slice(1, -1)}
        </em>
      )
    }
    if (part.startsWith('_') && part.endsWith('_') && part.length >= 2) {
      return (
        <em key={i} className="italic text-slate-700 dark:text-slate-300">
          {part.slice(1, -1)}
        </em>
      )
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code key={i} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-teal-800 dark:text-teal-300 font-mono text-[0.85em]">
          {part.slice(1, -1)}
        </code>
      )
    }
    return part
  })
}

function renderFormattedContent(text, onPromptClick) {
  if (!text) return null

  const lines = text.split('\n')
  const elements = []
  let listItems = []
  let listType = null // 'ul' or 'ol'
  let keyIdx = 0

  const flushList = () => {
    if (listItems.length > 0) {
      if (listType === 'ul') {
        const hasPromptPills = listItems.some((item) => {
          const cleanText = item.replace(/^\*\*|\*\*$/g, '').trim()
          return /^["“](.+)["”]$/.test(cleanText)
        })

        elements.push(
          <ul
            key={`ul-${keyIdx++}`}
            className={`my-3 space-y-2.5 ${hasPromptPills ? 'chat-prompt-list !list-none !pl-0' : 'pl-5 list-disc marker:text-teal-600'}`}
          >
            {listItems.map((item, idx) => {
              // Check if item looks like a quoted prompt: e.g. "How do I treat a sprained ankle?" or **"..."**
              const cleanText = item.replace(/^\*\*|\*\*$/g, '').trim()
              const promptMatch = cleanText.match(/^["“](.+)["”]$/)
              if (promptMatch && onPromptClick) {
                const promptQuery = promptMatch[1]
                return (
                  <li key={idx} className="chat-prompt-item !list-none my-2 !pl-0">
                    <button
                      type="button"
                      onClick={() => onPromptClick(promptQuery)}
                      className="chat-prompt-pill w-full sm:w-auto text-left"
                    >
                      <span className="text-teal-600 text-xs shrink-0">💬</span>
                      <span className="font-semibold text-teal-900 dark:text-teal-100 flex-1 min-w-0 break-words">{promptQuery}</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="chat-prompt-pill-arrow shrink-0 text-teal-600" aria-hidden="true">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </button>
                  </li>
                )
              }
              return (
                <li key={idx} className="leading-relaxed text-slate-700 dark:text-slate-300 pl-1 break-words">
                  {formatInline(item)}
                </li>
              )
            })}
          </ul>
        )
      } else if (listType === 'ol') {
        elements.push(
          <ol key={`ol-${keyIdx++}`} className="my-3 space-y-2.5 pl-6 list-decimal marker:text-teal-700 font-medium">
            {listItems.map((item, idx) => (
              <li key={idx} className="leading-relaxed text-slate-700 dark:text-slate-300 font-normal pl-1 break-words">
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

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i]
    const trimmed = rawLine.trim()

    if (!trimmed) {
      flushList()
      continue
    }

    // Heading (# or ## or ###)
    if (trimmed.startsWith('#')) {
      flushList()
      const headingText = trimmed.replace(/^#+\s*/, '')
      elements.push(
        <h4 key={`h-${keyIdx++}`} className="text-[15px] sm:text-[16px] font-bold text-slate-900 dark:text-white tracking-tight mt-3 mb-1.5">
          {formatInline(headingText)}
        </h4>
      )
      continue
    }

    // Unordered list item (- or * or •)
    const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')
    if (isBullet) {
      if (listType !== 'ul') {
        flushList()
        listType = 'ul'
      }
      listItems.push(trimmed.replace(/^[-*•]\s+/, ''))
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
      <p key={`p-${keyIdx++}`} className="leading-relaxed my-2 text-slate-700 dark:text-slate-300 break-words">
        {formatInline(trimmed)}
      </p>
    )
  }

  flushList()
  return elements
}

const ChatMessage = ({ role, content, disclaimer, riskLevel, onPromptClick }) => {
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

  if (isUser) {
    return (
      <div className="flex gap-2.5 sm:gap-3 justify-end items-end w-full min-w-0">
        <div className="chat-bubble-user max-w-[85%] sm:max-w-[76%] md:max-w-[70%] break-words shadow-sm">
          <p className="whitespace-pre-wrap font-medium m-0">{content}</p>
        </div>
        <div
          className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-xs ring-2 ring-white dark:ring-slate-800 mb-0.5"
          aria-hidden="true"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-2.5 sm:gap-3 justify-start items-start w-full min-w-0">
      {isEmergency ? (
        <div
          className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold shadow-xs ring-2 ring-white mt-0.5 bg-gradient-to-br from-rose-500 to-rose-700 text-white"
          style={{ boxShadow: '0 2px 8px rgba(225,29,72,0.3)' }}
          aria-hidden="true"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
      ) : (
        <div
          className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden bg-black flex items-center justify-center shadow-xs ring-2 ring-emerald-500/40 mt-0.5"
          style={{ boxShadow: '0 2px 8px rgba(13,148,136,0.25)' }}
          aria-hidden="true"
        >
          <img src="/logo.jpg" alt="Smart Aid AI" className="w-full h-full object-cover scale-105" />
        </div>
      )}

      <div
        className={
          'chat-bubble-assistant max-w-[88%] sm:max-w-[82%] md:max-w-[78%] rounded-2xl rounded-tl-sm text-[14px] sm:text-[14.5px] leading-relaxed transition min-w-0 break-words ' +
          (isEmergency
            ? 'bg-rose-50/70 border border-rose-200 text-slate-800 shadow-sm'
            : 'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-xs')
        }
      >
        {isEmergency && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 mb-2.5 rounded-lg bg-rose-100/80 border border-rose-200 text-rose-800 font-bold text-[11px] tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" aria-hidden="true" />
            URGENT MEDICAL ATTENTION ADVISED
          </div>
        )}

        <div className="min-w-0 break-words text-slate-800 dark:text-slate-200">
          {renderFormattedContent(content, onPromptClick)}
        </div>

        <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            Smart Aid AI
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="text-[11.5px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 px-2 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition inline-flex items-center gap-1 cursor-pointer"
            title="Copy response"
          >
            {copied ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-teal-700 dark:text-teal-400 font-semibold">Copied</span>
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {disclaimer && (
          <div className="mt-2 text-[10.5px] leading-relaxed text-slate-400 dark:text-slate-500 break-words">
            <span className="font-semibold text-slate-500 dark:text-slate-400">Note: </span>
            {disclaimer}
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatMessage
