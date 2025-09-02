export default function Footer() {
    return (
        <footer className="footer">
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <span>© {new Date().getFullYear()} Workflow.sg</span>
                <span>AI workflows for Singapore SMEs</span>
            </div>
        </footer>
    )
}
