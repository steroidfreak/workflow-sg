import { Link, NavLink } from 'react-router-dom'

export default function NavBar() {
    const active = ({ isActive }) => ({ textDecoration: isActive ? 'underline' : 'none' })
    return (
        <header className="navbar">
            <Link to="/" style={{ fontWeight: 800, letterSpacing: 0.3 }}>Workflow.sg</Link>
            <nav className="navlinks">
                <NavLink to="/services" style={active}>Services</NavLink>
                <NavLink to="/demos" style={active}>Demos</NavLink>
                <NavLink to="/assistant" style={active}>Assistant</NavLink>
                <NavLink to="/about" style={active}>About</NavLink>
                <NavLink to="/contact" style={active}>Contact</NavLink>
            </nav>
        </header>
    )
}
