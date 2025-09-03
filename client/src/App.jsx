import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import Footer from './components/Footer.jsx'
import ChatAgent from './components/ChatAgent.jsx'

import Home from './pages/Home.jsx'
import Services from './pages/Services.jsx'
import Demos from './pages/Demos.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <div className="app-shell">
      <NavBar />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/demos" element={<Demos />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <ChatAgent />
      </div>
    )
  }
