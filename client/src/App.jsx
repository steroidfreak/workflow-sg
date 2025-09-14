import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import Footer from './components/Footer.jsx'
import ChatAgent from './components/ChatAgent.jsx'
// import N8nTest from './pages/N8ntest.jsx'

import Home from './pages/Home.jsx'
import Services from './pages/Services.jsx'
import Demos from './pages/Demos.jsx'
import Summarize from './pages/demos/Summarize.jsx'
import WhatsAppAgent from './pages/demos/WhatsAppAgent.jsx'
import N8nChat from './pages/demos/N8nChat.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <div className="app-shell">
      <NavBar />
      <main className="container main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/demos" element={<Demos />} />
          <Route path="/demos/summarize" element={<Summarize />} />
          <Route path="/demos/whatsapp" element={<WhatsAppAgent />} />
          <Route path="/demos/n8n-chat" element={<N8nChat />} />
          <Route path="/about" element={<About />} />
          {/* <Route path="/n8n-test" element={<N8nTest />} /> */}

          <Route path="/contact" element={<Contact />} />
          {/* <Route path="/n8n-test" element={<N8nTest />} */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {/* <N8nTest /> */}
      <Footer />
      <ChatAgent />
    </div>
  )
}
