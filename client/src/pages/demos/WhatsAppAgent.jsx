import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../lib/api.js'
import Loader from '../../components/Loader.jsx'

export default function WhatsAppAgent() {
    const navigate = useNavigate()
    const [message, setMessage] = useState('Hello')
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const sendMessage = async () => {
        setError(null); setResult(null); setLoading(true)
        try {
            const res = await api.post('/demo/whatsapp', { message })
            setResult(res.data)
        } catch (e) {
            setError(e.message)
        } finally { setLoading(false) }
    }

    return (
        <section className="grid" style={{ gap: 16 }}>
            <button className="btn" onClick={() => navigate('/demos')} style={{ maxWidth: 'fit-content' }}>&larr; Back</button>
            <div className="card">
                <h2 style={{ marginTop: 0 }}>Demo: WhatsApp agent</h2>
                <p>This calls <code>/api/demo/whatsapp</code> on your server and displays the AI agent reply.</p>
                <input className="input" value={message} onChange={(e) => setMessage(e.target.value)} />
                <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                    <button className="btn" onClick={sendMessage}>Send</button>
                    <a className="btn" href="/api/health" target="_blank" rel="noreferrer">Health check</a>
                </div>
            </div>

            {loading && <Loader text="Sending…" />}
            {error && <div className="card" style={{ borderColor: '#ff6b6b' }}>Error: {error}</div>}
            {result && (
                <div className="card">
                    <h3>Response</h3>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{result.reply}</p>
                </div>
            )}
        </section>
    )
}

