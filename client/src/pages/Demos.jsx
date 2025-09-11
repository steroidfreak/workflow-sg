import { Link } from 'react-router-dom'

export default function Demos() {
    const demos = [
        {
            title: 'Demo: Summarize text',
            description: 'Summarize a paragraph via /api/demo/summarize.',
            path: '/demos/summarize',
            image: '/summarize-placeholder.png'
        },
        {
            title: 'Demo: WhatsApp agent',
            description: 'Chat with an AI via /api/demo/whatsapp.',
            path: '/demos/whatsapp',
            image: '/whatsapp-placeholder.png'
        },
        {
            title: 'Demo: n8n webhook chat',
            description: 'Test messaging through an n8n workflow.',
            path: '/demos/webhook-chat',
            image: '/summarize-placeholder.png'
        }
    ]

    return (
        <section className="grid" style={{ gap: 16 }}>
            {demos.map((demo) => (
                <Link key={demo.path} to={demo.path} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <img src={demo.image} alt={demo.title} style={{ width: '60%', height: 'auto', marginBottom: 12 }} />
                    <h2 style={{ marginTop: 0 }}>{demo.title}</h2>
                    <p>{demo.description}</p>
                </Link>
            ))}
        </section>
    )
}

