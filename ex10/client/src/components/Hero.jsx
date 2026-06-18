export default function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-6 pt-16">
      <div className="text-center animate__animated animate__fadeInUp">
        <p className="text-violet-400 text-sm font-semibold tracking-widest uppercase mb-4">
          Welcome to my portfolio
        </p>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
          Hello, I'm a<br />Developer
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
          I build beautiful, fast, and accessible web experiences using modern technologies.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => document.getElementById('works')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3 bg-violet-600 hover:bg-violet-500 rounded-full font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-violet-500/25"
          >
            View My Work
          </button>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-full font-semibold transition-all hover:scale-105 active:scale-95 border border-gray-700"
          >
            Contact Me
          </button>
        </div>
      </div>
    </section>
  )
}
