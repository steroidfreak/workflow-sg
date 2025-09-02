import { MongoClient } from 'mongodb'
import OpenAI from 'openai'

const client = new MongoClient(process.env.MONGODB_URI)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const DB = process.env.MONGODB_DB || 'workflow_sg'
const COLL = 'docs'
const EMBED_MODEL = process.env.EMBED_MODEL || 'text-embedding-3-large' // 3072 dims

let _db, _col
export async function initRag() {
    if (!_db) {
        await client.connect()
        _db = client.db(DB)
        _col = _db.collection(COLL)
    }
    return { db: _db, col: _col }
}

export async function embedText(text) {
    const res = await openai.embeddings.create({
        model: EMBED_MODEL,
        input: text
    })
    return res.data[0].embedding
}

export async function upsertDocuments(items = []) {
    const { col } = await initRag()
    const ops = []
    for (const it of items) {
        const text = String(it.text || '').trim()
        if (!text) continue
        const embedding = await embedText(text)
        const doc = {
            _id: it.id || undefined,
            text,
            embedding,
            metadata: it.metadata || {},
            updatedAt: new Date()
        }
        ops.push({
            updateOne: {
                filter: { _id: doc._id ?? null, text: doc.text },
                update: { $set: doc },
                upsert: true
            }
        })
    }
    if (!ops.length) return { upserted: 0 }
    const res = await col.bulkWrite(ops)
    return { upserted: res.upsertedCount ?? 0, modified: res.modifiedCount ?? 0 }
}

/**
 * Retrieves topK similar docs. If you’re on MongoDB Atlas Search Vector,
 * swap the fallback with a $vectorSearch pipeline for better performance.
 */
export async function querySimilar(query, topK = 4) {
    const { col } = await initRag()
    const qVec = await embedText(query)

    // Fallback: compute cosine in Node (OK for small datasets; use Atlas Vector Search for scale)
    const docs = await col.find({}, { projection: { text: 1, embedding: 1, metadata: 1 } }).limit(500).toArray()
    const scored = docs.map(d => ({
        _id: d._id,
        text: d.text,
        metadata: d.metadata || {},
        score: cosine(qVec, d.embedding)
    }))
    scored.sort((a, b) => b.score - a.score)
    return scored.slice(0, topK)
}

function cosine(a, b) {
    let dot = 0, na = 0, nb = 0
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
        dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]
    }
    return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-12)
}
