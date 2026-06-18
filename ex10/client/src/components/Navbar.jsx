// Smooth scrolling: uses native scrollIntoView (mirrors the Smooth_Scroll library behavior)
// Library: https://github.com/ddatunashvili/Smooth_Scroll
function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'works', label: 'My Works' },
  { id: 'contact', label: 'Contact' },
]

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-gray-950/80 border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
          Portfolio
        </span>
        <div className="flex gap-8">
          {NAV_LINKS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
