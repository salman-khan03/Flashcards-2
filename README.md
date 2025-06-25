# Marvel Universe Flashcards

A comprehensive flashcard web application for testing your knowledge of Marvel Universe characters. Built with React and featuring a beautiful, modern UI with 3D card flip animations.

## Features

### Core Functionality
- **Interactive Flashcards**: 3D flip animation between character info and questions
- **Multiple Question Types**: Real name, powers, and first appearance questions
- **Smart Answer Validation**: Flexible matching that accounts for partial answers, case differences, and punctuation
- **Visual Feedback**: Clear indication of correct/incorrect answers with animations

### Navigation & Control
- **Sequential Navigation**: Previous/Next buttons with proper boundary handling
- **Card Counter**: Shows current position in the deck
- **Shuffle Functionality**: Randomize card order with reset option
- **No Wrap-around**: Navigation buttons are disabled at list boundaries

### Progress Tracking
- **Streak Counter**: Tracks current and longest streaks of correct answers
- **Mastered Cards**: Mark cards as mastered to remove them from the active deck
- **Mastered Cards Display**: Visual gallery of completed characters

### User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Beautiful gradients, animations, and visual effects
- **Accessibility**: Proper focus states and keyboard navigation
- **Loading States**: Smooth loading and error handling

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Marvel API Configuration (Optional)
The app currently uses demo data for immediate functionality. To use the real Marvel API:

1. Get your Marvel API keys from [Marvel Developer Portal](https://developer.marvel.com/)
2. Update the API configuration in [`src/App.jsx`](src/App.jsx):
   ```javascript
   const MARVEL_API_KEY = 'YOUR_MARVEL_API_KEY_HERE'
   const MARVEL_PRIVATE_KEY = 'YOUR_MARVEL_PRIVATE_KEY_HERE'
   ```

### 3. Run the Application
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## How to Use

### Basic Navigation
1. **View Character**: See character image, name, and description on the front of the card
2. **Flip Card**: Click "Flip to Question" to see quiz questions
3. **Answer Questions**: Type your answer and click "Submit Answer"
4. **Navigate**: Use Previous/Next buttons to move through cards

### Advanced Features
- **Shuffle Cards**: Click "Shuffle Cards" to randomize the order
- **Track Progress**: Watch your streak counter increase with correct answers
- **Mark Mastered**: Click "Mark as Mastered" to remove cards you've learned
- **View Mastered**: Scroll down to see your collection of mastered characters

### Answer Flexibility
The app accepts various answer formats:
- Exact matches: "Peter Parker" = "Peter Parker"
- Partial matches: "Peter" = "Peter Parker"
- Case insensitive: "peter parker" = "Peter Parker"
- Punctuation ignored: "Peter Parker!" = "Peter Parker"

## Technical Details

### Built With
- **React 19**: Modern React with hooks
- **Vite**: Fast build tool and development server
- **CSS3**: Advanced styling with gradients, animations, and 3D transforms
- **Marvel API**: Character data (demo mode available)

### Project Structure
```
src/
├── components/
│   ├── Flashcard.jsx      # Main flashcard component
│   ├── Flashcard.css      # Flashcard styling
│   ├── StreakCounter.jsx  # Streak tracking component
│   ├── StreakCounter.css  # Streak counter styling
│   ├── MasteredCards.jsx  # Mastered cards display
│   └── MasteredCards.css  # Mastered cards styling
├── App.jsx                # Main application component
├── App.css                # Application styling
├── index.css              # Global styles
└── main.jsx               # Application entry point
```

### Key Features Implementation
- **3D Card Flip**: CSS transforms with `transform-style: preserve-3d`
- **Smart Answer Matching**: Custom algorithm for flexible answer validation
- **State Management**: React hooks for managing application state
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
