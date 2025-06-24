import './StreakCounter.css'

const StreakCounter = ({ currentStreak, longestStreak }) => {
  const getStreakEmoji = (streak) => {
    if (streak === 0) return '🔥'
    if (streak < 5) return '🔥'
    if (streak < 10) return '🔥🔥'
    if (streak < 20) return '🔥🔥🔥'
    return '🔥🔥🔥🔥'
  }

  const getStreakMessage = (streak) => {
    if (streak === 0) return 'Start your streak!'
    if (streak < 5) return 'Keep it up!'
    if (streak < 10) return 'Great job!'
    if (streak < 20) return 'Amazing streak!'
    return 'Incredible! You\'re on fire!'
  }

  return (
    <div className="streak-counter">
      <div className="streak-header">
        <h3>🔥 Streak Tracker</h3>
      </div>
      <div className="streak-content">
        <div className="streak-item current-streak">
          <span className="streak-label">Current Streak:</span>
          <span className="streak-value current">
            {currentStreak} {getStreakEmoji(currentStreak)}
          </span>
          <span className="streak-message">{getStreakMessage(currentStreak)}</span>
        </div>
        <div className="streak-item longest-streak">
          <span className="streak-label">Longest Streak:</span>
          <span className="streak-value longest">
            {longestStreak} {getStreakEmoji(longestStreak)}
          </span>
          {longestStreak > 0 && (
            <span className="streak-message">Your best run!</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default StreakCounter 