import { useState, useRef, useEffect } from 'react'

export default function ChatAgent() {
    const [open, setOpen] = useState(false)
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([])
    const listRef = useRef(null)

    useEffect(() => {
        listRef.current?.scrollTo(0, listRef.current.scrollHeight)
    }, [messages])

    const send = async () => {
        const question = input.trim()
        if (!question) return
        setMessages((m) => [...m, { from: 'user', text: question }])
        setInput('')
        try {
            const res = await fetch('/api/agent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question })
            })
            const data = await res.json()
            setMessages((m) => [
                ...m,
                { from: 'bot', text: data.answer || data.error || 'Error' }
            ])
        } catch {
            setMessages((m) => [...m, { from: 'bot', text: 'Network error' }])
        }
    }

    return (
        <div className='chat-agent'>
            {open ? (
                <div className='chat-box'>
                    <div className='chat-messages' ref={listRef}>
                        {messages.map((m, i) => (
                            <div key={i} className={`chat-message ${m.from}`}>
                                {m.text}
                            </div>
                        ))}
                    </div>
                    <div className='chat-controls'>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && send()}
                            placeholder='Ask about AI services for SMEs…'
                        />
                        <button onClick={send}>Send</button>
                        <button onClick={() => setOpen(false)}>×</button>
                    </div>
                </div>
            ) : (
                <button className='chat-toggle' onClick={() => setOpen(true)}>
                    AI SME Chat
                </button>
            )}
        </div>
    )
}
