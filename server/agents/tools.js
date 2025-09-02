import { querySimilar } from '../rag/store.js'

export const docSearchTool = {
    function: {
        name: 'search_documents',
        description: 'Search internal knowledge base for relevant text snippets.',
        parameters: {
            type: 'object',
            properties: {
                query: { type: 'string', description: 'User question to search for' },
                topK: { type: 'integer', description: 'Number of snippets to return', default: 4, minimum: 1, maximum: 10 }
            },
            required: ['query']
        }
    },
    handler: async ({ query, topK = 4 }) => {
        const hits = await querySimilar(query, topK)
        return {
            snippets: hits.map(h => ({
                id: String(h._id || ''),
                text: h.text.slice(0, 1200),
                score: Number(h.score.toFixed(4)),
                metadata: h.metadata || {}
            }))
        }
    }
}
