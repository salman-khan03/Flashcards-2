import { useState } from 'react'
import './Flashcard.css'

const Flashcard = ({ character, onCorrectAnswer, onIncorrectAnswer, onMastered }) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const [userGuess, setUserGuess] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [imageError, setImageError] = useState(false)

  const questions = [
    {
      question: "What is this character's real name?",
      answer: character.realName,
      type: "realName"
    },
    {
      question: "What are this character's main powers?",
      answer: character.powers,
      type: "powers"
    },
    {
      question: "What was this character's first appearance?",
      answer: character.firstAppearance,
      type: "firstAppearance"
    }
  ]

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const currentQuestion = questions[currentQuestionIndex]

  const normalizeAnswer = (answer) => {
    return answer.toLowerCase().replace(/[^\w\s]/g, '').trim()
  }

  const checkAnswer = (userAnswer, correctAnswer) => {
    const normalizedUser = normalizeAnswer(userAnswer)
    const normalizedCorrect = normalizeAnswer(correctAnswer)
    
    // Check for exact match
    if (normalizedUser === normalizedCorrect) return true
    
    // Check if user answer contains the correct answer (for shorter answers)
    if (normalizedCorrect.includes(normalizedUser) && normalizedUser.length > 2) return true
    
    // Check if correct answer contains the user answer (for partial answers)
    if (normalizedUser.includes(normalizedCorrect) && normalizedCorrect.length > 2) return true
    
    // Check for word-by-word partial matching
    const userWords = normalizedUser.split(' ').filter(word => word.length > 0)
    const correctWords = normalizedCorrect.split(' ').filter(word => word.length > 0)
    
    if (userWords.length === 0 || correctWords.length === 0) return false
    
    // Count matching words (including partial matches)
    let matchingWords = 0
    userWords.forEach(userWord => {
      correctWords.forEach(correctWord => {
        // Check if words match exactly or are contained within each other
        if (userWord === correctWord || 
            userWord.includes(correctWord) || 
            correctWord.includes(userWord)) {
          matchingWords++
        }
      })
    })
    
    // Calculate match percentage
    const matchPercentage = matchingWords / Math.max(userWords.length, correctWords.length)
    
    // Consider it correct if 60% or more words match
    return matchPercentage >= 0.6
    
    // Additional checks for common variations
    // Check for common abbreviations and nicknames
    const commonVariations = {
      'peter parker': ['peter', 'parker', 'spiderman', 'spider man'],
      'tony stark': ['tony', 'stark', 'ironman', 'iron man'],
      'steve rogers': ['steve', 'rogers', 'captain america', 'cap'],
      'natasha romanoff': ['natasha', 'romanoff', 'black widow', 'widow'],
      'thor odinson': ['thor', 'odinson'],
      'bruce banner': ['bruce', 'banner', 'hulk'],
      't\'challa': ['tchalla', 'black panther', 'panther'],
      'stephen strange': ['stephen', 'strange', 'doctor strange', 'dr strange'],
      'logan': ['wolverine', 'james howlett'],
      'wade wilson': ['wade', 'wilson', 'deadpool'],
      'ororo munroe': ['ororo', 'munroe', 'storm'],
      'jean grey': ['jean', 'grey', 'phoenix'],
      'scott summers': ['scott', 'summers', 'cyclops'],
      'erik lehnsherr': ['erik', 'lehnsherr', 'magneto'],
      'eddie brock': ['eddie', 'brock', 'venom'],
      'scott lang': ['scott', 'lang', 'ant man', 'antman'],
      'carol danvers': ['carol', 'danvers', 'captain marvel'],
      'wanda maximoff': ['wanda', 'maximoff', 'scarlet witch'],
      'clint barton': ['clint', 'barton', 'hawkeye']
    }
    
    // Check if user answer matches any variation of the correct answer
    const correctKey = normalizedCorrect
    if (commonVariations[correctKey]) {
      return commonVariations[correctKey].some(variation => 
        normalizedUser.includes(variation) || variation.includes(normalizedUser)
      )
    }
    
    return false
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!userGuess.trim()) return

    const correct = checkAnswer(userGuess, currentQuestion.answer)
    setIsCorrect(correct)
    setShowFeedback(true)
    setShowAnswer(true)

    if (correct) {
      onCorrectAnswer()
    } else {
      onIncorrectAnswer()
    }

    // Hide feedback after 3 seconds
    setTimeout(() => {
      setShowFeedback(false)
      setShowAnswer(false)
      setUserGuess('')
    }, 3000)
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setUserGuess('')
      setShowFeedback(false)
      setShowAnswer(false)
    }
  }

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setUserGuess('')
      setShowFeedback(false)
      setShowAnswer(false)
    }
  }

  const flipCard = () => {
    setIsFlipped(!isFlipped)
    if (!isFlipped) {
      setUserGuess('')
      setShowFeedback(false)
      setShowAnswer(false)
    }
  }

  const handleImageError = () => {
    setImageError(true)
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
    return `https://via.placeholder.com/300x400/${color}/ffffff?text=${encodeURIComponent(characterName)}`
  }

  return (
    <div className="flashcard-container">
      <div className={`flashcard ${isFlipped ? 'flipped' : ''}`}>
        <div className="flashcard-inner">
          <div className="flashcard-front">
            <div className="character-image">
              <img 
                src={imageError ? getFallbackImage(character.name) : character.image} 
                alt={character.name} 
                onError={handleImageError}
              />
            </div>
            <div className="character-info">
              <h2>{character.name}</h2>
              <p>{character.description}</p>
            </div>
            <button className="flip-button" onClick={flipCard}>
              Flip to Question
            </button>
          </div>

          <div className="flashcard-back">
            <div className="question-section">
              <h3>Question {currentQuestionIndex + 1} of {questions.length}</h3>
              <p className="question">{currentQuestion.question}</p>
              
              <form onSubmit={handleSubmit} className="answer-form">
                <label htmlFor="answer-input" className="answer-label">
                  Enter your guess:
                </label>
                <input
                  id="answer-input"
                  type="text"
                  value={userGuess}
                  onChange={(e) => setUserGuess(e.target.value)}
                  placeholder="Type your answer here..."
                  className="answer-input"
                  disabled={showFeedback}
                />
                <button type="submit" className="submit-button" disabled={showFeedback || !userGuess.trim()}>
                  Submit Answer
                </button>
              </form>

              {showFeedback && (
                <div className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
                  {isCorrect ? (
                    <div className="feedback-content">
                      <span className="feedback-icon">✅</span>
                      <span className="feedback-text">Correct! Great job!</span>
                    </div>
                  ) : (
                    <div className="feedback-content">
                      <span className="feedback-icon">❌</span>
                      <span className="feedback-text">Incorrect. The answer is: {currentQuestion.answer}</span>
                    </div>
                  )}
                </div>
              )}

              {showAnswer && (
                <div className="answer-display">
                  <h4>Answer:</h4>
                  <p>{currentQuestion.answer}</p>
                </div>
              )}

              <div className="question-navigation">
                <button 
                  onClick={previousQuestion} 
                  disabled={currentQuestionIndex === 0}
                  className={`question-nav-button ${currentQuestionIndex === 0 ? 'disabled' : ''}`}
                >
                  ← Previous Question
                </button>
                <button 
                  onClick={nextQuestion} 
                  disabled={currentQuestionIndex === questions.length - 1}
                  className={`question-nav-button ${currentQuestionIndex === questions.length - 1 ? 'disabled' : ''}`}
                >
                  Next Question →
                </button>
              </div>
            </div>

            <div className="card-actions">
              <button className="flip-button" onClick={flipCard}>
                Back to Character
              </button>
              <button 
                className="mastered-button" 
                onClick={() => onMastered(character.id)}
              >
                Mark as Mastered ✅
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Flashcard 