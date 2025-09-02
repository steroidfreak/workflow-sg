export default function Loader({ text = 'Loading...' }) {
    return <div className="card" role="status" aria-live="polite">{text}</div>
}
