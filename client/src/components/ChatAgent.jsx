import { useState, useRef, useEffect } from 'react'
import './ChatAgent.css'   // 👈 new local stylesheet

export default function ChatAgent() {
    const [open, setOpen] = useState(false)
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const listRef = useRef(null)

    useEffect(() => {
        const el = listRef.current
        if (el) el.scrollTop = el.scrollHeight
    }, [messages])

    const send = async () => {
        const question = input.trim()
        if (!question || loading) return
        setMessages(m => [...m, { from: 'user', text: question }])
        setInput('')
        setLoading(true)
        try {
            const res = await fetch('/api/agent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question })
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok || data.error) {
                setMessages(m => [...m, { from: 'bot', text: '⚠️ Service unavailable' }])
            } else {
                setMessages(m => [...m, { from: 'bot', text: data.answer || 'No answer' }])
            }
        } catch {
            setMessages(m => [...m, { from: 'bot', text: '⚠️ Network error' }])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="chat-agent">
            {!open && (
                <button
                    className="chat-toggle"
                    onClick={() => setOpen(true)}
                    aria-label="Open AI SME chat"
                >
                    💬 AI SME Chat
                </button>
            )}

            {open && (
                <div className="chat-box">
                    <div className="chat-header">
                        <span>Workflow.sg Assistant</span>
                        <button className="chat-close" onClick={() => setOpen(false)}>×</button>
                    </div>

                    <div className="chat-messages" ref={listRef}>
                        {messages.map((m, i) => (
                            <div key={i} className={`chat-message ${m.from}`}>
                                {m.text}
                            </div>
                        ))}
                        {loading && <div className="chat-message bot">…thinking…</div>}
                    </div>

                    <div className="chat-controls">
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && send()}
                            placeholder="Ask about AI services for SMEs…"
                        />
                        <button onClick={send} disabled={loading}>Send</button>
                    </div>
                </div>
            )}
        </div>
    )
}
