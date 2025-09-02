import { useState } from 'react'
import { api } from '../lib/api.js'

export default function Contact() {
    const [form, setForm] = useState({ name: '', email: '', message: '' })
    const [status, setStatus] = useState(null)
    const [error, setError] = useState(null)

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
    const onSubmit = async (e) => {
        e.preventDefault(); setStatus(null); setError(null)
        try {
            const res = await api.post('/contact', form)
            setStatus(res.data?.message || 'Sent!')
            setForm({ name: '', email: '', message: '' })
        } catch (e) { setError(e.message) }
    }

    return (
        <section className="grid" style={{ gap: 16 }}>
            <div className="card">
                <h2 style={{ marginTop: 0 }}>Contact us</h2>
                <form onSubmit={onSubmit} className="grid" style={{ gap: 12 }}>
                    <input className="input" name="name" placeholder="Name" value={form.name} onChange={onChange} required />
                    <input className="input" name="email" placeholder="Email" type="email" value={form.email} onChange={onChange} required />
                    <textarea className="textarea" name="message" placeholder="How can we help?" value={form.message} onChange={onChange} required />
                    <button className="btn" type="submit">Send</button>
                </form>
            </div>
            {status && <div className="card">✅ {status}</div>}
            {error && <div className="card" style={{ borderColor: '#ff6b6b' }}>❌ {error}</div>}
        </section>
    )
}
