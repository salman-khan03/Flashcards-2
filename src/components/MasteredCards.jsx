import { useState } from 'react'
import './MasteredCards.css'

const MasteredCards = ({ masteredCards }) => {
  const [imageErrors, setImageErrors] = useState({})
  const [isExpanded, setIsExpanded] = useState(false)

  if (masteredCards.length === 0) {
    return null
  }

  const handleImageError = (characterId) => {
    setImageErrors(prev => ({ ...prev, [characterId]: true }))
  }

  const getFallbackImage = (characterName) => {
    const colorMap = {
      'Spider-Man': 'ff0000',
      'Iron Man': 'ff6600',
      'Captain America': '0000ff',
      'Black Widow': '000000',
      'Thor': '0066cc',
      'Hulk': '00ff00',
      'Black Panther': '000000',
      'Doctor Strange': '6600cc',
      'Wolverine': 'ff6600',
      'Deadpool': 'ff0000',
      'Storm': '0066cc',
      'Jean Grey': 'ff0066',
      'Cyclops': '0066cc',
      'Magneto': '6600cc',
      'Venom': '000000',
      'Ant-Man': 'ff6600',
      'Captain Marvel': 'ff0066',
      'Scarlet Witch': 'ff0066',
      'Vision': '00ccff',
      'Hawkeye': '0066cc'
    }
    
    const color = colorMap[characterName] || '666666'
    return `https://via.placeholder.com/300x400/${color}/ffffff?text=${encodeURIComponent(character.name)}`
  }

  const getMasteryEmoji = (count) => {
    if (count === 0) return '🎯'
    if (count < 5) return '🎯🎯'
    if (count < 10) return '🎯🎯🎯'
    return '🎯🎯🎯🎯'
  }

  return (
    <div className="mastered-cards">
      <div className="mastered-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>
          {getMasteryEmoji(masteredCards.length)} Mastered Characters ({masteredCards.length})
        </h3>
        <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
      </div>
      
      {isExpanded && (
        <div className="mastered-content">
          <div className="mastered-stats">
            <p>You've mastered {masteredCards.length} character{masteredCards.length !== 1 ? 's' : ''}!</p>
            <p>Keep going to master them all! 🚀</p>
          </div>
          
          <div className="mastered-grid">
            {masteredCards.map(character => (
              <div key={character.id} className="mastered-card">
                <div className="mastered-card-image">
                  <img 
                    src={imageErrors[character.id] ? getFallbackImage(character.name) : character.image} 
                    alt={character.name}
                    onError={() => handleImageError(character.id)}
                  />
                  <div className="mastered-badge">✅</div>
                </div>
                <div className="mastered-card-info">
                  <h4>{character.name}</h4>
                  <p className="real-name">{character.realName}</p>
                  <p className="powers">{character.powers}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MasteredCards 