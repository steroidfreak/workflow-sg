import { useState } from 'react'
import { api } from '../lib/api'

export default function Assistant() {
    const [input, setInput] = useState('')
    const [msgs, setMsgs] = useState([])
    const [loading, setLoading] = useState(false)

    const send = async () => {
        if (!input.trim()) return
        const userMsg = { role: 'user', content: input }
        setMsgs(m => [...m, userMsg]); setInput(''); setLoading(true)
        try {
            const { data } = await api.post('/assistant/chat', { sessionId: 'web', message: userMsg.content })
            setMsgs(m => [...m, { role: 'assistant', content: data.output }])
        } catch (e) {
            setMsgs(m => [...m, { role: 'assistant', content: 'Error: ' + e.message }])
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="grid" style={{ gap: 16 }}>
            <div className="card">
                <h2 style={{ marginTop: 0 }}>Assistant</h2>
                <div style={{ display: 'grid', gap: 12 }}>
                    <div className="card" style={{ maxHeight: 340, overflow: 'auto', background: '#0a1324' }}>
                        {msgs.map((m, i) => (
                            <div key={i} style={{ marginBottom: 8 }}>
                                <strong>{m.role}:</strong> {m.content}
                            </div>
                        ))}
                        {loading && <div>Thinking…</div>}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <input className="input" value={input} onChange={e => setInput(e.target.value)} placeholder="Ask history, math, or company context…" />
                        <button className="btn" onClick={send}>Send</button>
                    </div>
                </div>
            </div>
        </section>
    )
}
