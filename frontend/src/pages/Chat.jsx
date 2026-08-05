import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { api } from '../lib/api'

export default function Chat() {
  const { companyId } = useParams()
  const [messages,  setMessages]   = useState([])
  const [documents, setDocuments]  = useState([])
  const [input,     setInput]      = useState('')
  const [sending,   setSending]    = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const fileInputRef = useRef(null)
  const scrollRef    = useRef(null)
  const inputRef     = useRef(null)

  useEffect(() => {
    api.chatHistory(companyId).then(setMessages)
    api.listDocuments(companyId).then(setDocuments)
  }, [companyId])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, sending])

  async function handleSend(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    setInput('')
    setMessages((prev) => [...prev, { id: `tmp-${Date.now()}`, role: 'user', content: text }])
    setSending(true)
    try {
      await api.sendChat(companyId, text)
      const history = await api.chatHistory(companyId)
      setMessages(history)
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  async function handleFileUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    await api.uploadDocument(companyId, file)
    const docs = await api.listDocuments(companyId)
    setDocuments(docs)
    e.target.value = ''
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend(e)
    }
  }

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-0px)] md:h-screen overflow-hidden">

        {/* ── Knowledge Base Sidebar ─────────────────────────────────── */}
        <div
          className={`flex flex-col border-r transition-all duration-300 shrink-0 ${
            sidebarOpen ? 'w-64' : 'w-0 overflow-hidden border-r-0'
          }`}
          style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
        >
          {/* Sidebar header */}
          <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-1">
              <p className="section-label">Knowledge Base</p>
              <button
                onClick={() => setSidebarOpen(false)}
                className="transition-colors"
                style={{ color: 'var(--text-muted)' }}
              >
                <CloseIcon />
              </button>
            </div>
            <p className="text-2xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Documents your co-founder reads before answering.
            </p>
          </div>

          {/* Upload button */}
          <div className="p-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.csv"
              onChange={handleFileUpload}
              className="hidden"
              id="doc-upload"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-secondary w-full text-xs gap-2"
            >
              <UploadIcon /> Upload document
            </button>
          </div>

          {/* Document list */}
          <div className="flex-1 overflow-y-auto px-3 pb-4 flex flex-col gap-1.5">
            {documents.length === 0 && (
              <p className="text-xs italic text-center py-4" style={{ color: 'var(--text-muted)' }}>
                Nothing uploaded yet.
              </p>
            )}
            {documents.map((d) => (
              <div
                key={d.id}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs truncate"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
              >
                <DocIcon />
                <span className="truncate">{d.filename}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Chat Column ─────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Chat header */}
          <div
            className="flex items-center gap-3 px-4 py-3 border-b shrink-0"
            style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
          >
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: 'var(--text-muted)' }}
                title="Open knowledge base"
              >
                <BooksIcon />
              </button>
            )}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-base"
              style={{ background: 'var(--gold-soft)', border: '1px solid var(--gold-glow)' }}
            >
              🧠
            </div>
            <div>
              <p className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                AI Co-Founder
              </p>
              <p className="text-2xs font-mono" style={{ color: 'var(--text-muted)' }}>
                {documents.length > 0 ? `${documents.length} doc${documents.length !== 1 ? 's' : ''} in knowledge base` : 'Upload docs to ground replies'}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 md:px-6 py-6 flex flex-col gap-4"
            style={{ background: 'var(--bg-base)' }}
          >
            {messages.length === 0 && !sending && (
              <div className="flex flex-col items-center justify-center h-full text-center py-12 animate-fade-in">
                <div className="text-5xl mb-4">🧠</div>
                <p className="font-display font-semibold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                  Your AI co-founder is ready
                </p>
                <p className="text-sm max-w-sm" style={{ color: 'var(--text-muted)' }}>
                  Ask about strategy, priorities, competitors, or how to read your numbers. 
                  Upload documents first for grounded answers.
                </p>
                <div className="mt-6 flex flex-wrap gap-2 justify-center">
                  {[
                    'What should I focus on this week?',
                    'Who are my main competitors?',
                    'How do I improve retention?',
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => setInput(q)}
                      className="text-xs px-3 py-2 rounded-xl transition-all duration-200"
                      style={{
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-secondary)',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'var(--gold)'
                        e.currentTarget.style.color = 'var(--gold)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'var(--border)'
                        e.currentTarget.style.color = 'var(--text-secondary)'
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <MessageBubble key={m.id} role={m.role} content={m.content} timestamp={m.created_at} index={i} />
            ))}

            {sending && <TypingBubble />}
          </div>

          {/* Input area */}
          <div
            className="border-t px-4 py-3 shrink-0"
            style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
          >
            <form onSubmit={handleSend} className="flex gap-2 items-end">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask your co-founder anything… (Enter to send, Shift+Enter for newline)"
                rows={1}
                className="input flex-1 resize-none min-h-[44px] max-h-32 py-2.5"
                style={{ overflow: 'auto', lineHeight: '1.5' }}
              />
              <button
                id="chat-send"
                type="submit"
                disabled={sending || !input.trim()}
                className="btn-primary shrink-0 h-11"
              >
                <SendIcon />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
            <p className="text-2xs mt-1.5 text-center" style={{ color: 'var(--text-muted)' }}>
              Responses are AI-generated. Verify important facts independently.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

function MessageBubble({ role, content, timestamp, index }) {
  const isUser = role === 'user'
  const time = timestamp
    ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : ''

  return (
    <div
      className={`flex gap-3 animate-slide-up ${isUser ? 'justify-end' : 'justify-start'}`}
      style={{ animationDelay: `${Math.min(index * 0.03, 0.3)}s` }}
    >
      {!isUser && (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 mt-0.5"
          style={{ background: 'var(--gold-soft)', border: '1px solid var(--gold-glow)' }}
        >
          🧠
        </div>
      )}

      <div className={`flex flex-col gap-1 max-w-[75%] md:max-w-[60%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className="rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap"
          style={isUser ? {
            background: 'linear-gradient(135deg, #C9A84C 0%, #E8C55C 50%, #B8912F 100%)',
            color: '#1A1409',
            fontWeight: 500,
            boxShadow: '0 4px 16px var(--gold-glow)',
          } : {
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
          }}
        >
          {content}
        </div>
        {time && (
          <span className="text-2xs font-mono px-1" style={{ color: 'var(--text-muted)' }}>
            {time}
          </span>
        )}
      </div>

      {isUser && (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
        >
          You
        </div>
      )}
    </div>
  )
}

function TypingBubble() {
  return (
    <div className="flex gap-3 justify-start animate-fade-in">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
        style={{ background: 'var(--gold-soft)', border: '1px solid var(--gold-glow)' }}
      >
        🧠
      </div>
      <div
        className="rounded-2xl px-4 py-3.5 flex items-center gap-1.5"
        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
      >
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  )
}

/* ── Icons ─────────────────────────────────────────────────── */
function SendIcon() {
  return <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="22" y1="2" x2="11" y2="13" strokeLinecap="round" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
}
function UploadIcon() {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round" /><polyline points="17 8 12 3 7 8" strokeLinecap="round" strokeLinejoin="round" /><line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round" /></svg>
}
function DocIcon() {
  return <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{ flexShrink: 0, color: 'var(--gold)' }}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" /><polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round" /></svg>
}
function CloseIcon() {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" /><line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" /></svg>
}
function BooksIcon() {
  return <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" strokeLinecap="round" strokeLinejoin="round" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" strokeLinecap="round" strokeLinejoin="round" /></svg>
}
