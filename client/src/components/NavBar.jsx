import { Link, NavLink } from 'react-router-dom'
import '../styles/NavBar.css'

export default function NavBar() {
    const active = ({ isActive }) => ({
        textDecoration: isActive ? 'underline' : 'none',
        fontWeight: isActive ? 600 : 400
    })

    return (
        <header className="navbar">
            <div className="nav-inner">
                {/* Brand */}
                <Link to="/" className="brand">Workflow.sg</Link>

                {/* Links */}
                <nav className="navlinks">
                    <NavLink to="/services" style={active}>Services</NavLink>
                    <NavLink to="/demos" style={active}>Demos</NavLink>
                    <NavLink to="/about" style={active}>About</NavLink>
                    <NavLink to="/contact" style={active}>Contact</NavLink>
                </nav>
            </div>
        </header>
    )
}
