import { useEffect, useState } from 'react'
import Chat from './Chat'
import './App.css'

const PERSON_IMAGES = {
  'elon-musk': '/images/elon.jpg',
  'wangchuan': '/images/wangchuan.jpg'
}

function App() {
  const [stars, setStars] = useState([])
  const [persons, setPersons] = useState([])
  const [selectedPerson, setSelectedPerson] = useState('elon-musk')
  const [selectedPersonInfo, setSelectedPersonInfo] = useState(null)

  useEffect(() => {
    const starCount = 100
    const newStars = Array.from({ length: starCount }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 5,
      minOpacity: Math.random() * 0.3 + 0.1
    }))
    setStars(newStars)

    fetch('/api/persons')
      .then(res => res.json())
      .then(data => {
        setPersons(data)
        if (data.length > 0) {
          setSelectedPerson(data[0].id)
          setSelectedPersonInfo(data[0])
        }
      })
      .catch(console.error)
  }, [])

  const handlePersonSelect = (person) => {
    setSelectedPerson(person.id)
    setSelectedPersonInfo(person)
  }

  const personImage = PERSON_IMAGES[selectedPerson] || PERSON_IMAGES['elon-musk']

  return (
    <div className="app">
      {/* Animated starfield background */}
      <div className="starfield">
        {stars.map(star => (
          <div
            key={star.id}
            className="star"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              '--duration': `${star.duration}s`,
              '--delay': `${star.delay}s`,
              '--min-opacity': star.minOpacity
            }}
          />
        ))}
      </div>

      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon">🚀</div>
            <div className="logo-text">
              <span className="logo-title">AI CHAT</span>
              <span className="logo-subtitle">Multiple Characters</span>
            </div>
          </div>
        </div>

        <div className="sidebar-divider" />

        <div className="character-section">
          <div className="section-label">选择对话人物</div>
          <div className="person-list">
            {persons.map(person => (
              <div
                key={person.id}
                className={`person-item ${selectedPerson === person.id ? 'active' : ''}`}
                onClick={() => handlePersonSelect(person)}
              >
                <div className="person-avatar-wrapper">
                  <div className="person-avatar">
                    <img src={PERSON_IMAGES[person.id] || '/images/elon.jpg'} alt={person.name} />
                  </div>
                </div>
                <div className="person-info">
                  <span className="person-name">{person.name}</span>
                </div>
                {selectedPerson === person.id && <div className="active-indicator">✓</div>}
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-info">
            <p>选择一个 AI 人物角色，开始对话。</p>
            <span className="tech-tag">⚡ 多种角色 · 独特视角</span>
          </div>
        </div>
      </aside>

      <main className="chat-container">
        <Chat personId={selectedPerson} personImage={personImage} personName={selectedPersonInfo?.name || 'Elon Musk'} />
      </main>
    </div>
  )
}

export default App