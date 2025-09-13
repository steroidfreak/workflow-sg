import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { Agent, run } from '@openai/agents'

const app = express()
const PORT = process.env.PORT || 3000
const N8N_CHAT_WEBHOOK =
    'https://n8n.workflow.sg/webhook/ca7eaba9-e5ef-48a3-bb40-373b4970a778'

// console.log('N8N_CHAT_WEBHOOK =', N8N_CHAT_WEBHOOK)
// Agent that answers questions about AI services for SMEs
const chatAgent = new Agent({
    name: 'SME AI Advisor',
    instructions:
        'You provide concise, helpful answers about AI services for small and medium-sized enterprises (SMEs).',
    tools: [],
    handoffs: [],
    model: 'gpt-5',
})

// Agent used for summarizing arbitrary text
const summarizeAgent = new Agent({
    name: 'Text Summarizer',
    instructions: 'Summarize the provided text in 1-2 sentences.',
    tools: [],
    handoffs: [],
    model: 'gpt-5',
})

app.use(cors())
app.use(express.json({ limit: '8mb' }))
app.use(morgan('dev'))

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'workflow-sg', timestamp: new Date().toISOString() })
})

// Simple demo using an agent to summarize text
app.post('/api/demo/summarize', async (req, res) => {
    const { text = '' } = req.body || {}
    const clean = String(text).replace(/\s+/g, ' ').trim()
    if (!clean) return res.status(400).json({ error: 'No text provided.' })

    try {
        const result = await run(summarizeAgent, clean)
        const summary = result.finalOutput
        res.json({ summary, length: summary.length })
    } catch (e) {
        console.error('summarize error', e)
        res.status(502).json({ error: 'summarizer_unavailable' })
    }
})

// Contact stub
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body || {}
    if (!name || !email || !message) return res.status(400).json({ error: 'Missing name, email, or message' })
    console.log('New contact:', { name, email, message })
    res.json({ message: 'Thanks! We will get back to you within 1 business day.' })
})

// SME AI services agent endpoint
async function handleAgent(question, res) {
    if (!question?.trim()) return res.status(400).json({ error: 'Missing question' })
    try {
        const result = await run(chatAgent, question)
        res.json({ answer: result.finalOutput })
    } catch (e) {
        console.error(e)
        res.status(502).json({ error: 'agent_unavailable' })
    }
}

app.post('/api/agent', (req, res) => {
    const { question } = req.body || {}
    handleAgent(question, res)
})

// lightweight GET variant for quick tests
app.get('/api/agent', (req, res) => {
    const question = req.query.question || req.query.q
    handleAgent(typeof question === 'string' ? question : undefined, res)
})

// n8n webhook trigger (GET passthrough)
// app.get('/api/n8n/trigger', async (req, res) => {
//     try {
//         const base = process.env.N8N_WEBHOOK_URL
//         if (!base) return res.status(500).json({ error: 'N8N_WEBHOOK_URL missing' })

//         // Forward all query params to n8n (e.g. ?foo=bar)
//         const url = new URL(base)
//         for (const [k, v] of Object.entries(req.query || {})) {
//             url.searchParams.set(k, String(v))
//         }

//         const resp = await fetch(url.toString(), { method: 'GET', redirect: 'follow' })
//         const text = await resp.text()

//         res.status(resp.status).send(text)
//     } catch (e) {
//         console.error('n8n trigger error:', e)
//         res.status(502).json({ error: 'upstream_error', detail: e.message })
//     }
// })

// optional: POST -> GET adapter (send body as query to n8n)
// app.post('/api/n8n/trigger', async (req, res) => {
//     console.log('POST /api/n8n/trigger body:', req.body)
//     try {
//         const base = process.env.N8N_WEBHOOK_URL
//         if (!base) return res.status(500).json({ error: 'N8N_WEBHOOK_URL missing' })

//         const url = new URL(base)
//         // flatten JSON body into query params (simple primitives only)
//         const data = req.body || {}
//         Object.entries(data).forEach(([k, v]) => url.searchParams.set(k, String(v)))

//         const resp = await fetch(url.toString(), { method: 'GET', redirect: 'follow' })
//         const text = await resp.text()

//         res.status(resp.status).send(text)
//     } catch (e) {
//         console.error('n8n trigger error:', e)
//         res.status(502).json({ error: 'upstream_error', detail: e.message })
//     }
// })

// Method-preserving passthrough (handles POST correctly)
app.post('/api/n8n/trigger', async (req, res) => {
    console.log('POST /api/n8n/trigger body:', req.body)
    try {
        const base = process.env.N8N_WEBHOOK_URL
        if (!base) return res.status(500).json({ error: 'N8N_WEBHOOK_URL missing' })

        const resp = await fetch(base, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body || {})
        })

        // try JSON first
        const ct = resp.headers.get('content-type') || ''
        let reply
        if (ct.includes('application/json')) {
            reply = await resp.json()
        } else {
            reply = await resp.text()
        }

        res.status(resp.status).send(reply)
    } catch (e) {
        console.error('n8n trigger error:', e)
        res.status(502).json({ error: 'upstream_error', detail: e.message })
    }
})


app.post('/api/n8n/chat', async (req, res) => {
    const webhook = N8N_CHAT_WEBHOOK
    console.log(webhook);
    if (!webhook) return res.status(500).json({ error: 'N8N_CHAT_WEBHOOK missing' })

    try {
        // optional: short timeout so requests don’t hang forever
        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), 10000)

        const resp = await fetch(webhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body ?? {}),
            signal: controller.signal
        })

        clearTimeout(timer)

        const ct = (resp.headers.get('content-type') || '').toLowerCase()
        const raw = await resp.text()

        // safely parse JSON if appropriate; otherwise return raw text
        let payload = raw
        if (ct.includes('application/json')) {
            try {
                payload = raw ? JSON.parse(raw) : {}
            } catch {
                // leave as raw string if parse fails
            }
        }

        res.status(resp.status).send(payload)
    } catch (e) {
        console.error('n8n chat error:', e)
        res.status(502).json({ error: 'upstream_error', detail: e.message })
    }
})

app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`)
})
