import { useState } from 'react'

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'web', label: 'Web' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'design', label: 'Design' },
]

const PROJECTS = [
  {
    id: 1, category: 'web',
    title: 'Portfolio Website',
    description: 'Modern personal portfolio built with React and Tailwind CSS featuring smooth animations.',
    gradient: 'from-violet-500 to-indigo-500',
    link: '#',
  },
  {
    id: 2, category: 'web',
    title: 'Task Manager',
    description: 'Full-stack task management app with drag-and-drop, Node.js backend and MongoDB.',
    gradient: 'from-indigo-500 to-blue-500',
    link: '#',
  },
  {
    id: 3, category: 'web',
    title: 'Chat Application',
    description: 'Real-time chat using Socket.io, Express, and JWT authentication.',
    gradient: 'from-blue-500 to-cyan-500',
    link: '#',
  },
  {
    id: 4, category: 'mobile',
    title: 'Fitness Tracker',
    description: 'Mobile app to log daily workouts, track progress, and set fitness goals.',
    gradient: 'from-green-500 to-emerald-500',
    link: '#',
  },
  {
    id: 5, category: 'mobile',
    title: 'Weather App',
    description: 'Beautiful weather forecast app with real-time location detection and 7-day outlook.',
    gradient: 'from-sky-500 to-blue-500',
    link: '#',
  },
  {
    id: 6, category: 'design',
    title: 'Brand Identity',
    description: 'Complete brand identity package — logo, color palette, and typography for a tech startup.',
    gradient: 'from-pink-500 to-rose-500',
    link: '#',
  },
  {
    id: 7, category: 'design',
    title: 'UI Design System',
    description: 'Comprehensive component library and design system built for scale and consistency.',
    gradient: 'from-orange-500 to-amber-500',
    link: '#',
  },
]

function ProjectCard({ project, index }) {
  return (
    <div
      className={`animate-fade-in-up card-stagger-${Math.min(index + 1, 7)} bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-violet-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-violet-500/10 group`}
    >
      <div className={`h-44 bg-gradient-to-br ${project.gradient} flex items-center justify-center relative overflow-hidden`}>
        <span className="text-6xl font-black text-white/10 uppercase tracking-widest select-none">
          {project.category}
        </span>
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-violet-300 transition-colors duration-200">
          {project.title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">{project.description}</p>
        <a
          href={project.link}
          className="inline-flex items-center gap-1 text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors"
        >
          View Project <span className="transition-transform group-hover:translate-x-1">→</span>
        </a>
      </div>
    </div>
  )
}

export default function Works() {
  const [activeTab, setActiveTab] = useState('all')

  const filtered = activeTab === 'all' ? PROJECTS : PROJECTS.filter(p => p.category === activeTab)

  return (
    <section id="works" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="text-violet-400 text-sm font-semibold tracking-widest uppercase text-center mb-3">
          Portfolio
        </p>
        <h2 className="text-4xl font-extrabold text-center mb-4">
          My Recent{' '}
          <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Works
          </span>
        </h2>
        <p className="text-gray-400 text-center mb-12 max-w-md mx-auto">
          A curated selection of my recent projects across different domains.
        </p>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-12 flex-wrap">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25 scale-105'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Project grid — key forces re-mount so animations replay on tab switch */}
        <div
          key={activeTab}
          className="tab-content grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
