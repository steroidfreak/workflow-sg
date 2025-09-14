import { useState, useRef, useEffect } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'

export default function N8nChat() {
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([
        { from: 'bot', text: 'Hi! You are chatting with an n8n workflow.' }
    ])
    const [sending, setSending] = useState(false)
    const listRef = useRef(null)

    useEffect(() => {
        const el = listRef.current
        if (el) el.scrollTop = el.scrollHeight
    }, [messages])

    const send = async () => {
        const text = input.trim()
        if (!text || sending) return
        setMessages(m => [...m, { from: 'user', text }])
        setInput('')
        setSending(true)
        try {
            const res = await fetch(`${API_BASE}/n8n/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text }),
            })
            const ct = res.headers.get('content-type') || ''
            let reply = ''
            if (ct.includes('application/json')) {
                const data = await res.json()
                if (typeof data === 'string') {
                    reply = data
                } else {
                    // try common keys first, fall back to JSON string
                    reply =
                        data.reply ||
                        data.message ||
                        data.text ||
                        data.answer ||
                        JSON.stringify(data, null, 2)
                }
            } else {
                reply = await res.text()
            }
            setMessages(m => [...m, { from: 'bot', text: reply || 'OK' }])
        } catch (e) {
            setMessages(m => [...m, { from: 'bot', text: '⚠️ Network error: ' + e.message }])
        } finally {
            setSending(false)
        }
    }

    return (
        <div style={styles.wrap}>
            <div style={styles.chatBox}>
                <div style={styles.header}>n8n Chat</div>
                <div style={styles.messages} ref={listRef}>
                    {messages.map((m, i) => (
                        <div key={i} style={{ ...styles.msg, ...(m.from === 'user' ? styles.user : styles.bot) }}>
                            {m.text}
                        </div>
                    ))}
                    {sending && <div style={{ ...styles.msg, ...styles.bot }}>…sending…</div>}
                </div>
                <div style={styles.controls}>
                    <input
                        style={styles.input}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && send()}
                        placeholder="Type a message…"
                    />
                    <button style={styles.button} onClick={send} disabled={sending}>Send</button>
                </div>
            </div>
        </div>
    )
}

const styles = {
    wrap: {
        display: 'grid',
        placeItems: 'center',
        padding: '32px 16px',
        minHeight: '100vh',
    },
    chatBox: {
        width: '100%',
        maxWidth: 560,
        height: '80vh',
        maxHeight: 600,
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid var(--border)',
        borderRadius: 12,
        overflow: 'hidden',
        background: 'var(--bg)',
        color: 'var(--text)',
        boxShadow: '0 8px 28px rgba(0,0,0,0.35)',
    },
    header: {
        padding: '14px 16px',
        borderBottom: '1px solid var(--border)',
        fontWeight: 700,
    },
    messages: {
        flex: 1,
        overflowY: 'auto',
        padding: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        background: '#20242b',
    },
    msg: {
        maxWidth: '80%',
        padding: '8px 12px',
        borderRadius: 10,
        whiteSpace: 'pre-wrap',
        lineHeight: 1.4,
        fontSize: 14,
    },
    user: { alignSelf: 'flex-end', background: '#2e3a52', color: '#fff' },
    bot: { alignSelf: 'flex-start', background: '#333d4f', color: '#fff' },
    controls: {
        display: 'flex',
        gap: 8,
        padding: 10,
        borderTop: '1px solid var(--border)',
        background: '#1c1f24',
    },
    input: {
        flex: 1,
        padding: '10px 12px',
        borderRadius: 8,
        border: '1px solid var(--border)',
        background: '#0f1622',
        color: '#fff',
    },
    button: {
        padding: '10px 14px',
        borderRadius: 8,
        border: 'none',
        background: 'var(--link)',
        color: '#fff',
        fontWeight: 700,
        cursor: 'pointer',
    },
}
