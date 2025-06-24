import { useState, useEffect } from 'react'
import './App.css'
import Flashcard from './components/Flashcard'
import StreakCounter from './components/StreakCounter'
import MasteredCards from './components/MasteredCards'

function App() {
  const [characters, setCharacters] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [shuffledCharacters, setShuffledCharacters] = useState([])
  const [isShuffled, setIsShuffled] = useState(false)
  const [currentStreak, setCurrentStreak] = useState(0)
  const [longestStreak, setLongestStreak] = useState(0)
  const [masteredCards, setMasteredCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Marvel API configuration
  const MARVEL_API_KEY = 'e9b6338e71e52d9032761ac13fa683c1'
  const MARVEL_BASE_URL = 'https://gateway.marvel.com/v1/public'

  // Helper function to format Marvel image URLs
  const formatMarvelImageUrl = (path, extension) => {
    if (!path || !extension) return null
    
    // Check if it's the "image not available" placeholder
    if (path.includes('image_not_available')) {
      return null
    }
    
    // Convert HTTP to HTTPS and add proper sizing
    const securePath = path.replace('http://', 'https://')
    // Use standard_xlarge for better quality while maintaining performance
    return `${securePath}/standard_xlarge.${extension}`
  }

  // Helper function to get real names
  const getRealName = (characterName) => {
    const realNameMap = {
      'Spider-Man': 'Peter Parker',
      'Iron Man': 'Tony Stark',
      'Captain America': 'Steve Rogers',
      'Black Widow': 'Natasha Romanoff',
      'Thor': 'Thor Odinson',
      'Hulk': 'Bruce Banner',
      'Black Panther': 'T\'Challa',
      'Doctor Strange': 'Stephen Strange',
      'Wolverine': 'Logan / James Howlett',
      'Deadpool': 'Wade Wilson',
      'Storm': 'Ororo Munroe',
      'Jean Grey': 'Jean Grey',
      'Cyclops': 'Scott Summers',
      'Magneto': 'Erik Lehnsherr',
      'Venom': 'Eddie Brock',
      'Ant-Man': 'Scott Lang',
      'Captain Marvel': 'Carol Danvers',
      'Scarlet Witch': 'Wanda Maximoff',
      'Vision': 'Vision',
      'Hawkeye': 'Clint Barton'
    }
    
    return realNameMap[characterName] || characterName
  }

  useEffect(() => {
    fetchMarvelCharacters()
  }, [])

  const fetchMarvelCharacters = async () => {
    try {
      setLoading(true)
      
      // Create a timestamp and hash for Marvel API authentication
      const timestamp = Date.now()
      const hash = await generateMarvelHash(timestamp)
      
      // Fetch popular Marvel characters with authentication
      const response = await fetch(
        `${MARVEL_BASE_URL}/characters?apikey=${MARVEL_API_KEY}&ts=${timestamp}&hash=${hash}&limit=100&orderBy=name&hasDigitalComics=true`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch Marvel characters')
      }
      
      const data = await response.json()
      
      if (data.code !== 200) {
        throw new Error(data.status || 'API Error')
      }
      
      // Process and filter characters - focus on popular ones with good data
      const popularCharacterNames = [
        'Spider-Man', 'Iron Man', 'Captain America', 'Black Widow', 'Thor', 
        'Hulk', 'Black Panther', 'Doctor Strange', 'Wolverine', 'Deadpool',
        'Storm', 'Jean Grey', 'Cyclops', 'Magneto', 'Venom', 'Ant-Man',
        'Captain Marvel', 'Scarlet Witch', 'Vision', 'Hawkeye'
      ]
      
      const processedCharacters = data.data.results
        .filter(character => {
          // Check if character has valid image
          const hasValidImage = character.thumbnail && 
            character.thumbnail.path && 
            !character.thumbnail.path.includes('image_not_available')
          
          // Check if character has description
          const hasDescription = character.description && 
            character.description.trim() !== ''
          
          // Check if it's a popular character
          const isPopularCharacter = popularCharacterNames.some(name => 
            character.name.toLowerCase().includes(name.toLowerCase()) ||
            name.toLowerCase().includes(character.name.toLowerCase())
          )
          
          return hasValidImage && hasDescription && isPopularCharacter
        })
        .slice(0, 20) // Get up to 20 characters
        .map((character) => {
          const imageUrl = formatMarvelImageUrl(character.thumbnail.path, character.thumbnail.extension)
          
          return {
            id: character.id,
            name: character.name,
            description: character.description,
            image: imageUrl || getDefaultImage(character.name), // Fallback to default if no valid image
            realName: getRealName(character.name),
            powers: getCharacterPowers(character.name),
            firstAppearance: getFirstAppearance(character.name)
          }
        })
      
      if (processedCharacters.length === 0) {
        // Fallback to demo data if API fails or returns no results
        console.warn('No valid characters found from API, using demo data')
        setCharacters(getDemoCharacters())
        setShuffledCharacters([...getDemoCharacters()])
      } else {
        console.log(`Successfully loaded ${processedCharacters.length} characters from Marvel API`)
        setCharacters(processedCharacters)
        setShuffledCharacters([...processedCharacters])
      }
      
      setLoading(false)
    } catch (err) {
      console.error('Error fetching Marvel characters:', err)
      // Fallback to demo data
      setCharacters(getDemoCharacters())
      setShuffledCharacters([...getDemoCharacters()])
      setLoading(false)
    }
  }

  // Helper function to generate Marvel API hash (if needed for authentication)
  const generateMarvelHash = async (timestamp) => {
    // For public API key only, return empty string
    // If you have a private key, you would use: md5(timestamp + privateKey + publicKey)
    return ''
  }

  // Helper function to get default character images as fallback
  const getDefaultImage = (characterName) => {
    const imageMap = {
      'Spider-Man': 'https://i.imgur.com/YzTyqjN.jpg',
      'Iron Man': 'https://i.imgur.com/8tMVQs8.jpg',
      'Captain America': 'https://i.imgur.com/9FnGHjR.jpg',
      'Black Widow': 'https://i.imgur.com/2SvuHJZ.jpg',
      'Thor': 'https://i.imgur.com/LFjr9JJ.jpg',
      'Hulk': 'https://i.imgur.com/6KH8M8V.jpg',
      'Black Panther': 'https://i.imgur.com/3VuBKvL.jpg',
      'Doctor Strange': 'https://i.imgur.com/5GkNnwk.jpg'
    }
    
    return imageMap[characterName] || `https://via.placeholder.com/400x600/1976d2/ffffff?text=${encodeURIComponent(characterName)}`
  }

  // Helper function to get character powers (since Marvel API doesn't provide this directly)
  const getCharacterPowers = (characterName) => {
    const powerMap = {
      'Spider-Man': 'Spider-sense, wall-crawling, super strength, web-slinging',
      'Iron Man': 'Powered armor, genius intellect, wealth, repulsor beams',
      'Captain America': 'Peak human strength, shield mastery, leadership, tactical genius',
      'Black Widow': 'Espionage, martial arts, tactical genius, advanced weaponry',
      'Thor': 'Lightning control, superhuman strength, Mjolnir, weather manipulation',
      'Hulk': 'Superhuman strength, regeneration, gamma radiation, rage transformation',
      'Black Panther': 'Enhanced strength, vibranium suit, Wakandan tech, martial arts',
      'Doctor Strange': 'Mystic arts, reality manipulation, time stone, dimensional travel',
      'Wolverine': 'Healing factor, adamantium skeleton, enhanced senses, claws',
      'Deadpool': 'Healing factor, immortality, fourth wall breaking, combat skills',
      'Storm': 'Weather control, flight, lightning manipulation, wind control',
      'Jean Grey': 'Telepathy, telekinesis, Phoenix Force, psychic abilities',
      'Cyclops': 'Optic blasts, tactical leadership, enhanced vision',
      'Magneto': 'Magnetic control, flight, force fields, metal manipulation',
      'Venom': 'Symbiote powers, shapeshifting, super strength, web-slinging',
      'Ant-Man': 'Size manipulation, insect communication, tactical genius',
      'Captain Marvel': 'Superhuman strength, energy projection, flight, cosmic awareness',
      'Scarlet Witch': 'Reality manipulation, chaos magic, probability alteration',
      'Vision': 'Density control, phasing, solar beam, android physiology',
      'Hawkeye': 'Master archer, tactical genius, hand-to-hand combat, trick arrows'
    }
    
    return powerMap[characterName] || 'Various superhuman abilities and powers'
  }

  // Helper function to get first appearance (since Marvel API doesn't provide this directly)
  const getFirstAppearance = (characterName) => {
    const appearanceMap = {
      'Spider-Man': 'Amazing Fantasy #15 (1962)',
      'Iron Man': 'Tales of Suspense #39 (1963)',
      'Captain America': 'Captain America Comics #1 (1941)',
      'Black Widow': 'Tales of Suspense #52 (1964)',
      'Thor': 'Journey into Mystery #83 (1962)',
      'Hulk': 'The Incredible Hulk #1 (1962)',
      'Black Panther': 'Fantastic Four #52 (1966)',
      'Doctor Strange': 'Strange Tales #110 (1963)',
      'Wolverine': 'The Incredible Hulk #180 (1974)',
      'Deadpool': 'New Mutants #98 (1991)',
      'Storm': 'Giant-Size X-Men #1 (1975)',
      'Jean Grey': 'X-Men #1 (1963)',
      'Cyclops': 'X-Men #1 (1963)',
      'Magneto': 'X-Men #1 (1963)',
      'Venom': 'Amazing Spider-Man #300 (1988)',
      'Ant-Man': 'Tales to Astonish #27 (1962)',
      'Captain Marvel': 'Marvel Super-Heroes #13 (1968)',
      'Scarlet Witch': 'X-Men #4 (1964)',
      'Vision': 'Avengers #57 (1968)',
      'Hawkeye': 'Tales of Suspense #57 (1964)'
    }
    
    return appearanceMap[characterName] || 'Various Marvel Comics'
  }

  // Demo characters as fallback
  const getDemoCharacters = () => [
    {
      id: 1,
      name: 'Spider-Man',
      description: 'Peter Parker, a young photographer who gained spider-like abilities after being bitten by a radioactive spider.',
      image: 'https://via.placeholder.com/300x400/ff0000/ffffff?text=Spider-Man',
      realName: 'Peter Parker',
      powers: 'Spider-sense, wall-crawling, super strength',
      firstAppearance: 'Amazing Fantasy #15 (1962)'
    },
    {
      id: 2,
      name: 'Iron Man',
      description: 'Tony Stark, a genius inventor and billionaire industrialist who created a powered suit of armor to save his life.',
      image: 'https://via.placeholder.com/300x400/ff6600/ffffff?text=Iron+Man',
      realName: 'Tony Stark',
      powers: 'Powered armor, genius intellect, wealth',
      firstAppearance: 'Tales of Suspense #39 (1963)'
    },
    {
      id: 3,
      name: 'Captain America',
      description: 'Steve Rogers, a frail young man enhanced to the peak of human perfection by an experimental serum.',
      image: 'https://via.placeholder.com/300x400/0000ff/ffffff?text=Captain+America',
      realName: 'Steve Rogers',
      powers: 'Peak human strength, shield mastery, leadership',
      firstAppearance: 'Captain America Comics #1 (1941)'
    },
    {
      id: 4,
      name: 'Black Widow',
      description: 'Natasha Romanoff, a highly trained spy and assassin with exceptional combat skills.',
      image: 'https://via.placeholder.com/300x400/000000/ffffff?text=Black+Widow',
      realName: 'Natasha Romanoff',
      powers: 'Espionage, martial arts, tactical genius',
      firstAppearance: 'Tales of Suspense #52 (1964)'
    },
    {
      id: 5,
      name: 'Thor',
      description: 'The God of Thunder, wielding the mighty hammer Mjolnir and commanding the power of lightning.',
      image: 'https://via.placeholder.com/300x400/0066cc/ffffff?text=Thor',
      realName: 'Thor Odinson',
      powers: 'Lightning control, superhuman strength, Mjolnir',
      firstAppearance: 'Journey into Mystery #83 (1962)'
    },
    {
      id: 6,
      name: 'Hulk',
      description: 'Bruce Banner transforms into the incredible Hulk when exposed to gamma radiation.',
      image: 'https://via.placeholder.com/300x400/00ff00/000000?text=Hulk',
      realName: 'Bruce Banner',
      powers: 'Superhuman strength, regeneration, gamma radiation',
      firstAppearance: 'The Incredible Hulk #1 (1962)'
    },
    {
      id: 7,
      name: 'Black Panther',
      description: 'T\'Challa, king of Wakanda, enhanced by the heart-shaped herb and advanced technology.',
      image: 'https://via.placeholder.com/300x400/000000/ffffff?text=Black+Panther',
      realName: 'T\'Challa',
      powers: 'Enhanced strength, vibranium suit, Wakandan tech',
      firstAppearance: 'Fantastic Four #52 (1966)'
    },
    {
      id: 8,
      name: 'Doctor Strange',
      description: 'Stephen Strange, a former neurosurgeon who became the Sorcerer Supreme.',
      image: 'https://via.placeholder.com/300x400/6600cc/ffffff?text=Doctor+Strange',
      realName: 'Stephen Strange',
      powers: 'Mystic arts, reality manipulation, time stone',
      firstAppearance: 'Strange Tales #110 (1963)'
    }
  ]

  const getCurrentCharacters = () => {
    return isShuffled ? shuffledCharacters : characters
  }

  const getCurrentCharacter = () => {
    const currentChars = getCurrentCharacters()
    return currentChars[currentIndex]
  }

  const nextCard = () => {
    const currentChars = getCurrentCharacters()
    if (currentIndex < currentChars.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const previousCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const shuffleCards = () => {
    const currentChars = getCurrentCharacters()
    // Use Fisher-Yates shuffle algorithm for better randomization
    const shuffled = [...currentChars]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    setShuffledCharacters(shuffled)
    setIsShuffled(true)
    setCurrentIndex(0)
  }

  const resetOrder = () => {
    setIsShuffled(false)
    setCurrentIndex(0)
  }

  const markAsMastered = (characterId) => {
    const character = characters.find(char => char.id === characterId)
    if (character) {
      setMasteredCards(prev => [...prev, character])
      
      // Remove from current character lists
      setCharacters(prev => prev.filter(char => char.id !== characterId))
      setShuffledCharacters(prev => prev.filter(char => char.id !== characterId))
      
      // Adjust current index if necessary
      const currentChars = getCurrentCharacters()
      if (currentIndex >= currentChars.length - 1 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1)
      }
    }
  }

  const handleCorrectAnswer = () => {
    const newStreak = currentStreak + 1
    setCurrentStreak(newStreak)
    if (newStreak > longestStreak) {
      setLongestStreak(newStreak)
    }
  }

  const handleIncorrectAnswer = () => {
    setCurrentStreak(0)
  }

  if (loading) {
    return <div className="loading">Loading Marvel characters from the API...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  const currentChars = getCurrentCharacters()
  const currentChar = getCurrentCharacter()

  return (
    <div className="app">
      <header className="app-header">
        <h1>Marvel Universe Flashcards</h1>
        <p>Test your knowledge of Marvel characters from the official Marvel API!</p>
      </header>

      <div className="app-container">
        <div className="controls">
          <StreakCounter 
            currentStreak={currentStreak} 
            longestStreak={longestStreak} 
          />
          
          <div className="navigation-controls">
            <button 
              onClick={previousCard} 
              disabled={currentIndex === 0}
              className={`nav-button ${currentIndex === 0 ? 'disabled' : ''}`}
            >
              ← Previous Card
            </button>
            
            <span className="card-counter">
              {currentIndex + 1} / {currentChars.length}
            </span>
            
            <button 
              onClick={nextCard} 
              disabled={currentIndex === currentChars.length - 1}
              className={`nav-button ${currentIndex === currentChars.length - 1 ? 'disabled' : ''}`}
            >
              Next Card →
            </button>
          </div>

          <div className="shuffle-controls">
            <button 
              onClick={shuffleCards} 
              className={`shuffle-button ${isShuffled ? 'shuffled' : ''}`}
              disabled={currentChars.length === 0}
            >
              🔀 {isShuffled ? 'Shuffle Again' : 'Shuffle Cards'}
            </button>
            {isShuffled && (
              <button onClick={resetOrder} className="reset-button">
                ↺ Reset to Original Order
              </button>
            )}
            {isShuffled && (
              <span className="shuffle-indicator">
                🎲 Cards are shuffled
              </span>
            )}
          </div>
        </div>

        {currentChar ? (
          <Flashcard 
            character={currentChar}
            onCorrectAnswer={handleCorrectAnswer}
            onIncorrectAnswer={handleIncorrectAnswer}
            onMastered={markAsMastered}
          />
        ) : (
          <div className="no-cards">
            <h2>No more cards!</h2>
            <p>You've mastered all the available cards.</p>
          </div>
        )}

        <MasteredCards masteredCards={masteredCards} />
      </div>
    </div>
  )
}

export default App
