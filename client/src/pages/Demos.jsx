import { Link } from 'react-router-dom'

export default function Demos() {
    const demos = [
        {
            title: 'Demo: Summarize text',
            description: 'Summarize a paragraph via /api/demo/summarize.',
            path: '/demos/summarize'
        }
    ]

    return (
        <section className="grid" style={{ gap: 16 }}>
            {demos.map((demo) => (
                <Link key={demo.path} to={demo.path} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h2 style={{ marginTop: 0 }}>{demo.title}</h2>
                    <p>{demo.description}</p>
                </Link>
            ))}
        </section>
    )
}

