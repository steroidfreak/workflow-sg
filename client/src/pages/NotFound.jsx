import { Link } from 'react-router-dom'
export default function NotFound() {
    return (
        <section className="card">
            <h2>Page not found</h2>
            <p>Let’s get you back to the <Link to="/">home page</Link>.</p>
        </section>
    )
}
