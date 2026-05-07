import Accordion, { ChevronUp, ChevronDown } from './Accordion'
import './App.css'

const colors = [
  'bg-gray-100', 'bg-gray-200', 'bg-gray-300', 'bg-gray-400',
  'bg-gray-500', 'bg-gray-600', 'bg-gray-700', 'bg-gray-800', 'bg-gray-900',
]

const accordionItems = [
  { id: 1, title: 'Accordion title', content: 'Accordion content' },
  { id: 2, title: 'Accordion title', content: 'Accordion content' },
]

export default function App() {
  return (
    <div className="page">

      <section className="demo-section">
        <span className="section-label">colors</span>
        <div className="color-swatches">
          {colors.map((color) => (
            <div key={color} className={`swatch ${color}`} />
          ))}
        </div>
      </section>

      <section className="demo-section">
        <span className="section-label">icons</span>
        <div className="icons-row">
          <ChevronUp />
          <ChevronDown />
        </div>
      </section>

      <section className="demo-section">
        <div className="accordion-section-label">
          <span>◆</span>
          <span>accordion</span>
        </div>
        <div className="accordion-wrapper">
          <Accordion items={accordionItems} />
        </div>
      </section>

    </div>
  )
}
