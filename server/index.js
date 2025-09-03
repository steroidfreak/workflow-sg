import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { Agent, run } from '@openai/agents'
import { initRag, upsertDocuments, querySimilar } from './rag/store.js' // keep if you still want RAG APIs

const app = express()
const PORT = process.env.PORT || 4000

// Agent that answers questions about AI services for SMEs
const chatAgent = new Agent({
    name: 'SME AI Advisor',
    instructions:
        'You provide concise, helpful answers about AI services for small and medium-sized enterprises (SMEs).',
})

app.use(cors())
app.use(express.json({ limit: '8mb' }))
app.use(morgan('dev'))

await initRag().catch((e) => {
    console.warn('RAG init failed (you can ignore if not using RAG endpoints):', e.message)
})

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'workflow-sg', timestamp: new Date().toISOString() })
})

// Simple demo (optional)
app.post('/api/demo/summarize', (req, res) => {
    const { text = '' } = req.body || {}
    const clean = String(text).replace(/\s+/g, ' ').trim()
    const summary = clean ? (clean.length <= 220 ? clean : clean.slice(0, 220) + '…') : 'No text provided.'
    res.json({ summary, length: summary.length })
})

// Contact stub
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body || {}
    if (!name || !email || !message) return res.status(400).json({ error: 'Missing name, email, or message' })
    console.log('New contact:', { name, email, message })
    res.json({ message: 'Thanks! We will get back to you within 1 business day.' })
})

// SME AI services agent endpoint
app.post('/api/agent', async (req, res) => {
    const { question } = req.body || {}
    if (!question?.trim()) return res.status(400).json({ error: 'Missing question' })
    try {
        const result = await run(chatAgent, question)
        res.json({ answer: result.finalOutput })
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: e.message || 'agent_error' })
    }
})

/** -------- OPTIONAL: keep these only if you still want manual RAG APIs ---------- */
// Upsert docs into your Mongo collection with embeddings
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

// Query similar docs
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
/** ------------------------------------------------------------------------------ */

app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`)
})
