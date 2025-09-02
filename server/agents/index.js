import { Agent } from '@openai/agents'
import { docSearchTool } from './tools.js'

export const historyTutorAgent = new Agent({
    name: 'History Tutor',
    instructions: 'You provide assistance with historical queries. Explain important events and context clearly.',
    tools: [docSearchTool]
})

export const mathTutorAgent = new Agent({
    name: 'Math Tutor',
    instructions: 'You provide help with math problems. Explain your reasoning at each step and include examples'
})

export const triageAgent = new Agent({
    name: 'Triage Agent',
    instructions: "You determine which agent to use based on the user's homework question. If the query needs company context, call `search_documents` first to ground your answer.",
    handoffs: [historyTutorAgent, mathTutorAgent],
    tools: [docSearchTool]
})
