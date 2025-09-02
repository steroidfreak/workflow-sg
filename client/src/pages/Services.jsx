export default function Services() {
    return (
        <section className="grid" style={{ gap: 16 }}>
            <div className="card">
                <h2 style={{ marginTop: 0 }}>Services</h2>
                <ul>
                    <li><strong>Workflow Automation:</strong> remove repetitive steps with AI agents.</li>
                    <li><strong>Systems Integration:</strong> connect CRMs, ERPs, email, WhatsApp.</li>
                    <li><strong>Custom AI Apps:</strong> RAG, chatbots, dashboards, and alerts.</li>
                    <li><strong>Consulting:</strong> roadmap, ROI analysis, and pilot projects.</li>
                </ul>
            </div>
            <div className="card">
                <h3>Typical engagement</h3>
                <ol>
                    <li>Discovery (1–2 hrs): map processes & quick-win opportunities.</li>
                    <li>Pilot (2–4 wks): deliver one automated workflow end-to-end.</li>
                    <li>Scale: roll out to more teams & integrate governance.</li>
                </ol>
            </div>
        </section>
    )
}
