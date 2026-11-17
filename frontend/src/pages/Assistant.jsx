import { useEffect, useRef, useState } from 'react'
import ChatMessage from '../components/ChatMessage.jsx'
import { sendChatMessage } from '../services/api.js'

const STARTER_PROMPTS = [
  { label: 'Mild Fever Care', query: 'What should I do for a mild fever?', icon: '🌡️' },
  { label: 'Minor Burn Relief', query: 'How do I treat a minor burn?', icon: '🔥' },
  { label: 'Dehydration Signs', query: 'Signs of dehydration & fluid intake advice', icon: '💧' },
  { label: 'Hands-Only CPR', query: 'How do I perform hands-only CPR step by step?', icon: '❤️' },
  { label: 'Daily Wellness', query: 'What are everyday preventive wellness habits?', icon: '🌿' },
  { label: 'Emergency Warning Signs', query: 'When should I seek emergency medical care immediately?', icon: '🚨' },
]

const initialWelcome = {
  role: 'assistant',
  content:
    "### Welcome to Smart Aid Assistant 👋\n\n" +
    "I am your AI health awareness and preventive guidance companion. I can share evidence-informed educational tips on common symptoms, first-aid procedures, hydration, and healthy habits.\n\n" +
    "**You can ask me things like:**\n" +
    "- \"How do I treat a sprained ankle?\"\n" +
    "- \"What temperature is dangerous for a fever?\"\n" +
    "- \"What are signs of heat exhaustion vs heatstroke?\"\n" +
    "- \"How do I perform hands-only CPR?\"\n\n" +
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
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
      }, 60)
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
      <header className="page-header fade-in min-w-0 mb-3 sm:mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="page-eyebrow !mb-0">Interactive Companion</span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10.5px] font-bold border border-emerald-200/80">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                ONLINE
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Smart Aid Assistant</h1>
          </div>
          {hasUserMessage && (
            <button
              type="button"
              onClick={handleClear}
              className="self-start sm:self-auto btn btn-secondary btn-sm text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
              New Conversation
            </button>
          )}
        </div>
      </header>

      <div className="chat-page fade-in min-w-0">
        <div className="chat-container border border-slate-200/90 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-950 flex flex-col rounded-3xl h-[calc(100vh-175px)] min-h-[520px] max-h-[820px] overflow-hidden">
          {/* Shell Header */}
          <div className="chat-shell-header px-4 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-slate-50 via-white to-teal-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <div
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden bg-black flex items-center justify-center shadow-sm ring-2 ring-emerald-500/40"
                >
                  <img src="/logo.jpg" alt="Smart Aid AI" className="w-full h-full object-cover scale-105" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[14px] sm:text-[14.5px] font-bold text-slate-900 dark:text-white tracking-tight truncate flex items-center gap-2">
                  Smart Aid Assistant
                  <span className="hidden xs:inline-flex items-center px-1.5 py-0.2 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-100 dark:border-teal-800/60 font-semibold text-[9.5px]">
                    Health AI
                  </span>
                </div>
                <div className="text-[11.5px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 flex-wrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" aria-hidden="true" />
                  <span className="truncate">First-aid guidance &amp; symptom awareness</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-slate-400 hidden sm:inline">24/7 Educational Guidance</span>
            </div>
          </div>

          {/* Conversation Log */}
          <div
            ref={scrollRef}
            className="conversation chat-shell-body flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 min-w-0"
            role="log"
            aria-live="polite"
          >
            {messages.map((m, i) => (
              <div key={i} className="w-full min-w-0">
                <ChatMessage
                  role={m.role}
                  content={m.content}
                  disclaimer={m.disclaimer}
                  riskLevel={m.riskLevel}
                  onPromptClick={handlePromptClick}
                />
              </div>
            ))}

            {thinking && (
              <div className="flex gap-2.5 sm:gap-3 justify-start items-center w-full min-w-0 pt-2">
                <div className="shrink-0 w-8 h-8 rounded-full overflow-hidden bg-black flex items-center justify-center shadow-xs ring-2 ring-emerald-500/40">
                  <img src="/logo.jpg" alt="Smart Aid AI" className="w-full h-full object-cover scale-105" />
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-xs rounded-2xl rounded-tl-sm px-4 py-2.5 flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '-0.32s' }} />
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '-0.16s' }} />
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" />
                  <span className="text-xs text-slate-400 dark:text-slate-400 ml-1">Analyzing health query...</span>
                </div>
              </div>
            )}

            {/* Extra bottom spacer so content never touches the bottom border */}
            <div className="h-4 shrink-0" aria-hidden="true" />
          </div>

          {/* Suggested Follow-ups (shown during active conversation) */}
          {hasUserMessage && activeSuggestedPrompts.length > 0 && !thinking && (
            <div className="px-4 sm:px-6 py-2.5 bg-gradient-to-r from-teal-50/40 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3 shrink-0 overflow-hidden">
              <div className="flex items-center gap-1.5 text-teal-700 dark:text-teal-400 font-semibold text-[11px] uppercase tracking-wider shrink-0 select-none">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600" aria-hidden="true">
                  <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
                </svg>
                <span className="hidden xs:inline">Suggested</span>
              </div>
              <div
                className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1 pr-8 flex-1 min-w-0"
                style={{
                  maskImage: 'linear-gradient(to right, black calc(100% - 28px), transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to right, black calc(100% - 28px), transparent 100%)',
                }}
              >
                {activeSuggestedPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePromptClick(p)}
                    className="chat-suggested-pill shrink-0 group"
                  >
                    <span>{p}</span>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 text-teal-500 group-hover:text-teal-700 group-hover:translate-x-0.5 transition-all">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                ))}
                <div className="w-8 shrink-0" aria-hidden="true" />
              </div>
            </div>
          )}

          {/* Starter Topics */}
          {!hasUserMessage && !thinking && (
            <div className="px-4 sm:px-6 py-2.5 bg-slate-50/80 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3 shrink-0 overflow-hidden">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 shrink-0 select-none">
                Topics:
              </span>
              <div
                className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1 pr-8 flex-1 min-w-0"
                style={{
                  maskImage: 'linear-gradient(to right, black calc(100% - 28px), transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to right, black calc(100% - 28px), transparent 100%)',
                }}
              >
                {STARTER_PROMPTS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => handlePromptClick(p.query)}
                    className="chat-starter-pill shrink-0"
                  >
                    <span aria-hidden="true" className="shrink-0 text-sm">{p.icon}</span>
                    <span>{p.label}</span>
                  </button>
                ))}
                <div className="w-8 shrink-0" aria-hidden="true" />
              </div>
            </div>
          )}

          {/* Composer */}
          <form onSubmit={submit} className="chat-shell-composer px-3 sm:px-5 py-3 bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 shrink-0">
            <div className="chat-composer-box">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about symptoms, burns, fever, first aid, or preventive habits..."
                rows={1}
                className="chat-composer-textarea"
                aria-label="Message to Smart Aid Assistant"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    submit(e)
                  }
                }}
                disabled={thinking}
              />
              <button
                type="submit"
                disabled={!input.trim() || thinking}
                aria-label="Send message"
                className={'chat-send-btn ' + (input.trim() && !thinking ? 'is-active' : '')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>

            <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>Press <kbd>Enter</kbd> to send <span className="dot-sep">·</span> <kbd>Shift</kbd>+<kbd>Enter</kbd> for newline</span>
              </div>
              <div className="flex items-center gap-1 text-slate-500 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" aria-hidden="true" />
                <span>Informational guidance only · Dial 911 / 112 for emergencies</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Assistant
