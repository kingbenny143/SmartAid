import { useEffect, useRef, useState } from 'react'
import ChatMessage from '../components/ChatMessage.jsx'
import Disclaimer from '../components/Disclaimer.jsx'
import { sendChatMessage } from '../services/api.js'

const STARTER_PROMPTS = [
  { label: 'What should I do for a mild fever?', icon: '🌡️' },
  { label: 'How do I treat a minor burn?', icon: '🔥' },
  { label: 'Signs of dehydration & fluid intake', icon: '💧' },
  { label: 'How do I perform hands-only CPR?', icon: '❤️' },
  { label: 'Everyday preventive wellness habits', icon: '🌿' },
  { label: 'When to seek emergency medical care', icon: '🚨' },
]

const initialWelcome = {
  role: 'assistant',
  content:
    "### Welcome to Smart Aid Assistant 👋\n\n" +
    "I am your AI health awareness and preventive guidance companion. I can share evidence-informed educational tips on common symptoms, first-aid procedures, hydration, and healthy habits.\n\n" +
    "**You can ask me things like:**\n" +
    "- **\"How do I treat a sprained ankle?\"**\n" +
    "- **\"What temperature is dangerous for a fever?\"**\n" +
    "- **\"What are signs of heat exhaustion vs heatstroke?\"**\n" +
    "- **\"How do I perform hands-only CPR?\"**\n\n" +
    "What would you like to explore today?",
  disclaimer:
    'Smart Aid provides informational health guidance and first-aid education. It does not provide a medical diagnosis or replace a qualified healthcare professional. Seek professional medical care when appropriate.',
  suggested_prompts: [
    'What should I do for a mild fever?',
    'How do I treat a minor burn?',
    'Everyday preventive wellness habits',
  ],
}

const Assistant = () => {
  const [messages, setMessages] = useState([initialWelcome])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const scrollRef = useRef(null)
  const textareaRef = useRef(null)

  const hasUserMessage = messages.some((m) => m.role === 'user')
  const lastAssistantMessage = [...messages].reverse().find((m) => m.role === 'assistant')
  const activeSuggestedPrompts = lastAssistantMessage?.suggested_prompts || []

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, thinking])

  const submit = async (e, textOverride = null) => {
    if (e && e.preventDefault) e.preventDefault()
    const text = (textOverride !== null ? textOverride : input).trim()
    if (!text || thinking) return

    const userMsg = { role: 'user', content: text }
    const currentHistory = [...messages, userMsg]
    setMessages(currentHistory)
    setInput('')
    setThinking(true)

    try {
      const reply = await sendChatMessage({
        message: text,
        history: currentHistory.slice(-6),
      })

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: reply.reply,
          category: reply.category,
          riskLevel: reply.risk_level,
          suggested_prompts: reply.suggested_prompts,
          disclaimer: reply.disclaimer,
        },
      ])
    } catch (err) {
      console.error('Chat error:', err)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "Smart Aid couldn't connect to the health guidance service. Please check that the backend is running and try again. You can also use the Symptom Checker and First Aid sections directly.",
          disclaimer:
            'Smart Aid provides informational health guidance and first-aid education. It does not provide a medical diagnosis or replace a qualified healthcare professional. Seek professional medical care when appropriate.',
          suggested_prompts: ['What should I do for a mild fever?', 'How do I treat a minor burn?'],
        },
      ])
    } finally {
      setThinking(false)
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    }
  }

  const handlePromptClick = (prompt) => {
    submit(null, prompt)
  }

  const handleClear = () => {
    setMessages([initialWelcome])
    setInput('')
  }

  return (
    <div className="page-wrap page-wrap--assistant min-w-0 max-w-5xl mx-auto px-3 sm:px-6">
      <header className="page-header fade-in min-w-0 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="page-eyebrow mb-2">AI Health Assistant</span>
            <h1 className="page-title text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Smart Aid Assistant</h1>
            <p className="text-[14px] sm:text-[15px] leading-relaxed text-slate-600 max-w-xl">
              Ask questions about common symptoms, first-aid procedures, triage warning signs, and preventive habits.
            </p>
          </div>
          {hasUserMessage && (
            <button
              type="button"
              onClick={handleClear}
              className="self-start sm:self-auto btn btn-secondary btn-sm text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
              New Conversation
            </button>
          )}
        </div>
      </header>

      <div className="chat-page fade-in min-w-0">
        <div className="chat-container border border-slate-200/90 shadow-xl bg-white flex flex-col rounded-3xl min-h-[500px] sm:min-h-[600px] overflow-hidden">
          {/* Header */}
          <div className="chat-shell-header px-4 sm:px-6 py-3.5 sm:py-4 bg-gradient-to-r from-slate-50 via-white to-teal-50/30 border-b border-slate-100 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <div
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white flex items-center justify-center shadow-md ring-4 ring-teal-50"
                  style={{ boxShadow: '0 1px 2px rgba(15,118,110,0.18), 0 4px 10px -2px rgba(13,148,136,0.30)' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
                    <path d="M15.5 7h-1a1 1 0 0 0-1 1v.5a1 1 0 0 1-1 1 1 1 0 0 1 1 1V11a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-.5a1 1 0 0 1 1-1 1 1 0 0 1-1-1V8a1 1 0 0 0-1-1Z" />
                  </svg>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[14.5px] sm:text-[15px] font-bold text-slate-900 tracking-tight truncate flex items-center gap-2">
                  Smart Aid Assistant
                  <span className="hidden xs:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100 font-semibold text-[10px] tracking-wider uppercase">
                    AI Model v1.0
                  </span>
                </div>
                <div className="text-[12px] text-slate-500 flex items-center gap-1.5 flex-wrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" aria-hidden />
                  <span className="truncate">Health Guidance &amp; First Aid</span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-semibold text-[9.5px]">
                    ONLINE
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-slate-400 hidden md:inline">24/7 Educational</span>
            </div>
          </div>

          {/* Conversation Log */}
          <div
            ref={scrollRef}
            className="conversation chat-shell-body flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 min-w-0"
            role="log"
            aria-live="polite"
            style={{ minHeight: '320px', maxHeight: 'calc(75vh - 200px)' }}
          >
            {messages.map((m, i) => (
              <div key={i} className="w-full min-w-0">
                <ChatMessage
                  role={m.role}
                  content={m.content}
                  disclaimer={m.disclaimer}
                  riskLevel={m.riskLevel}
                />
              </div>
            ))}

            {thinking && (
              <div className="flex gap-2.5 sm:gap-3 justify-start w-full min-w-0 pt-2">
                <div className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 text-white flex items-center justify-center shadow-sm ring-2 ring-white mt-0.5">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
                  </svg>
                </div>
                <div className="bg-white border border-slate-200/80 shadow-sm rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2 text-slate-500 text-sm">
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '-0.32s' }} />
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '-0.16s' }} />
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" />
                  <span className="text-xs text-slate-400 ml-1">Analyzing health query...</span>
                </div>
              </div>
            )}
          </div>

          {/* Contextual Suggested Prompts */}
          {activeSuggestedPrompts.length > 0 && !thinking && (
            <div className="px-4 sm:px-6 py-2.5 bg-slate-50/70 border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-thin">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
                Suggested:
              </span>
              <div className="flex items-center gap-2 flex-nowrap">
                {activeSuggestedPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePromptClick(p)}
                    className="chat-suggested-pill"
                  >
                    <span>{p}</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Starters if no user messages yet */}
          {!hasUserMessage && !thinking && (
            <div className="chat-shell-starters px-4 sm:px-6 py-3 border-t border-slate-100 bg-white">
              <span className="chat-shell-starters-label text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                Common Topics
              </span>
              <div className="chat-starter-list flex flex-wrap gap-2">
                {STARTER_PROMPTS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => handlePromptClick(p.label)}
                    className="chat-pill-btn"
                  >
                    <span aria-hidden="true" className="shrink-0 text-base">{p.icon}</span>
                    <span className="truncate">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Subtle Disclaimer */}
          <div className="chat-disclaimer px-4 sm:px-6 py-2 bg-slate-50/50 border-t border-slate-100">
            <Disclaimer tone="subtle" />
          </div>

          {/* Message Composer */}
          <form onSubmit={submit} className="composer chat-shell-composer p-3 sm:p-4 bg-white border-t border-slate-200">
            <div className="flex items-end gap-2 sm:gap-3 min-w-0">
              <div className="flex-1 relative min-w-0">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about symptoms, burns, fever, first aid, or preventive habits..."
                  rows={1}
                  className="form-textarea !rounded-2xl !text-[14.5px] !py-3 !px-4 leading-relaxed resize-none shadow-sm min-h-[50px] max-h-[140px] w-full border-slate-200 focus:border-teal-500 focus:ring-teal-500/20"
                  aria-label="Message to Smart Aid Assistant"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      submit(e)
                    }
                  }}
                  disabled={thinking}
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim() || thinking}
                aria-label="Send message"
                className={
                  'shrink-0 w-11 h-11 sm:w-12 sm:h-12 !rounded-2xl flex items-center justify-center font-semibold text-white transition-all active:scale-95 shadow-md ' +
                  (input.trim() && !thinking
                    ? 'bg-gradient-to-br from-teal-500 to-teal-700 hover:from-teal-600 hover:to-teal-800 shadow-teal-600/30'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none')
                }
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
            <div className="chat-shell-composer-hint mt-2 text-[11px] text-slate-400 flex items-center justify-between">
              <div>
                Press <kbd>Enter</kbd> to send <span className="dot-sep">·</span> <kbd>Shift</kbd>+<kbd>Enter</kbd> for newline
              </div>
              <span className="hidden sm:inline text-teal-700 font-medium text-[11px]">
                Powered by Smart Aid Health Intelligence
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Assistant
