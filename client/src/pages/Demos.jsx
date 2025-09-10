import { useState } from 'react'
import { api } from '../lib/api.js'
import Loader from '../components/Loader.jsx'

export default function Demos() {
    const [text, setText] = useState('Paste a paragraph, and we will summarize it.')
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const runDemo = async () => {
        setError(null); setResult(null); setLoading(true)
        try {
            const res = await api.post('/demo/summarize', { text })
            setResult(res.data)
        } catch (e) {
            setError(e.message)
        } finally { setLoading(false) }
    }

    return (
        <section className="grid" style={{ gap: 16 }}>
            <div className="card">
                <h2 style={{ marginTop: 0 }}>Demo: Summarize text</h2>
                <p>This calls <code>/api/demo/summarize</code> on your server and returns a concise summary.</p>
                <textarea className="textarea" value={text} onChange={(e) => setText(e.target.value)} />
                <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                    <button className="btn" onClick={runDemo}>Summarize</button>
                    <a className="btn" href="/api/health" target="_blank" rel="noreferrer">Health check</a>
                </div>
            </div>

            {loading && <Loader text="Summarizing…" />}
            {error && <div className="card" style={{ borderColor: '#ff6b6b' }}>Error: {error}</div>}
            {result && (
                <div className="card">
                    <h3>Summary</h3>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{result.summary}</p>
                    {typeof result.length === 'number' && (
                        <p style={{ fontSize: 12, opacity: 0.7 }}>({result.length} chars)</p>
                    )}
                </div>
            )}
        </section>
    )
}
