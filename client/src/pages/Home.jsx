import { Link } from 'react-router-dom'

export default function Home() {
    return (
        <section className="grid" style={{ gap: 24 }}>
            <div className="card">
                <h1 style={{ marginTop: 0, fontSize: 36 }}>Automate your SME workflows with AI</h1>
                <p>We help Singapore businesses cut manual work, integrate tools, and scale with AI-driven automation.</p>
                <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                    <Link to="/services" className="btn">See Services</Link>
                    <Link to="/assistant" className="btn" style={{ background: '#0a1324', color: '#e6eefb' }}>Talk to Assistant</Link>
                </div>
            </div>

            <div className="grid grid-2">
                <div className="card">
                    <h3>Invoice & Email Triage</h3>
                    <p>Auto-extract data, label priorities, and route to the right person—no more inbox chaos.</p>
                </div>
                <div className="card">
                    <h3>HR Onboarding</h3>
                    <p>Generate checklists, schedule trainings, and keep records consistent across your apps.</p>
                </div>
            </div>

            <div className="card">
                <h3>Where AI helps</h3>
                <ul>
                    <li><strong>Personal Productivity:</strong> Like building a personal assistant to handle your emails, calendar, and documents.</li>
                    <li><strong>Marketing & Business:</strong> Automate social media posting, manage your CRM, handle customer onboarding, or even run entire sales processes.</li>
                    <li><strong>E-commerce:</strong> From syncing product data to processing orders and handling customer support.</li>
                    <li><strong>Data & Reporting:</strong> Pull data from multiple sources, clean it up, and generate reports automatically.</li>
                    <li><strong>Home & Lifestyle:</strong> Connect it to smart home devices, trigger routines based on your time or location, or build little quality-of-life automations.</li>
                    <li><strong>AI Integrations:</strong> Hook up language models, image tools, or custom APIs for task summarization, content creation, and advanced agents.</li>
                </ul>
            </div>
        </section>
    )
}
