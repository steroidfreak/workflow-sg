import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

import { run } from '@openai/agents'
import { triageAgent } from './agents/index.js'
import { initRag, upsertDocuments, querySimilar } from './rag/store.js'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json({ limit: '8mb' }))
app.use(morgan('dev'))

await initRag()

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'workflow-sg', timestamp: new Date().toISOString() })
})

// Basic demo (optional)
app.post('/api/demo/summarize', (req, res) => {
    const { text = '' } = req.body || {}
    const clean = String(text).replace(/\s+/g, ' ').trim()
    const summary = clean.length <= 220 ? clean : clean.slice(0, 220) + '…'
    res.json({ summary, length: summary.length })
})

// Contact stub
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body || {}
    if (!name || !email || !message) return res.status(400).json({ error: 'Missing name, email, or message' })
    console.log('New contact:', { name, email, message })
    res.json({ message: 'Thanks! We will get back to you within 1 business day.' })
})

// ===== Agents endpoints =====
const sessions = new Map()

app.post('/api/assistant/chat', async (req, res) => {
    try {
        const { sessionId = 'default', message = '' } = req.body || {}
        if (!message.trim()) return res.status(400).json({ error: 'Missing message' })

        const history = sessions.get(sessionId) || []
        const result = await run(triageAgent, history.concat({ role: 'user', content: message }))
        sessions.set(sessionId, result.history)

        res.json({
            output: result.finalOutput?.output_text ?? result.finalOutput ?? '',
            history: result.history
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: e.message || 'agent_error' })
    }
})

app.post('/api/rag/upsert', async (req, res) => {
    try {
        const { documents = [] } = req.body || {}
        if (!Array.isArray(documents) || !documents.length) {
            return res.status(400).json({ error: 'Provide documents[] with {text}' })
        }
        const result = await upsertDocuments(documents)
        res.json({ ok: true, ...result })
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: e.message || 'upsert_error' })
    }
})

app.post('/api/rag/query', async (req, res) => {
    try {
        const { query, topK = 4 } = req.body || {}
        if (!query?.trim()) return res.status(400).json({ error: 'Missing query' })
        const hits = await querySimilar(query, topK)
        res.json({ hits })
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: e.message || 'query_error' })
    }
})

app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`)
})
