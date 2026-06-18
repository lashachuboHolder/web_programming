import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Works from './components/Works.jsx'
import Contact from './components/Contact.jsx'
import Messages from './components/Messages.jsx'

export default function App() {
  return (
    <div className="bg-gray-950 text-white min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Works />
        <Contact />
        <Messages />
      </main>
      <footer className="text-center py-8 text-gray-600 text-sm border-t border-gray-900">
        © {new Date().getFullYear()} Portfolio. All rights reserved.
      </footer>
    </div>
  )
}
