# JourneyGenie - AI Travel Assistant

JourneyGenie is an AI-powered travel planning application that helps users create personalized itineraries for their trips. Built with React, TypeScript, and Groq AI, this app provides a conversational interface for travel planning, enriched with expert travel guide knowledge.

## Features

- **AI-Powered Chat Interface**: Converse naturally with JourneyGenie to plan your trips
- **Smart Travel Recommendations**: Get personalized suggestions based on travel guide content
- **Trip Preferences**: Set budget, dates, and activity preferences for tailored recommendations
- **Interactive Itineraries**: View and manage comprehensive day-by-day travel plans 
- **Smart Destination Info**: Access detailed information about destinations, including costs and tips
- **Visual Exploration**: See destinations and nearby attractions on interactive maps
- **PDF Export**: Download beautifully formatted itineraries for offline reference
- **Trip History**: Save and manage multiple trip conversations
- **Dark Mode**: Toggle between light and dark themes for comfortable viewing
- **Responsive Design**: Seamless experience across desktop and mobile devices

## Technologies Used

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **AI Integration**: 
  - Groq AI for natural language processing
  - LangChain for document processing and embeddings
- **UI Components**: 
  - Tailwind CSS for styling
  - shadcn/ui for consistent design system
  - Lucide React for iconography
- **Maps & Location**: Google Maps JavaScript API with Places library
- **PDF Generation**: jsPDF with AutoTable plugin
- **Routing**: React Router for navigation
- **State Management**: React Context API with custom hooks

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- NPM or Yarn
- Groq API key
- Google Maps API key
- OpenAI API key (for embeddings)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/Ja-Crispy/journey-genie.git
   cd journey-genie
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the project root with your API keys:
   ```
   VITE_GROQ_API_KEY=your_groq_api_key
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   VITE_OPENAI_API_KEY=your_openai_api_key
   ```

4. Start the development server:
   ```
   npx vite --port 4000
   ```

5. Open your browser and navigate to `http://localhost:4000`

## Usage

1. Start a new chat or select an existing conversation
2. Tell JourneyGenie about your desired destination and travel plans
3. Set your budget, travel dates, and preferences using the intuitive controls
4. Ask for specific recommendations or general travel advice
5. View your personalized itinerary with day-by-day activities
6. Explore your destination and attractions on the interactive map
7. Download your complete itinerary as a PDF for offline reference

## Project Structure

- `/src`
  - `/components` - Reusable React components
  - `/contexts` - Context providers for state management
  - `/pages` - Main application pages
  - `/utils` - Utility functions for PDF generation and API integrations
  - `/hooks` - Custom React hooks
  - `/lib` - Shared utilities and helper functions

## Security

This project implements several security measures:
- Environment variables for API key protection
- Client-side API key validation
- Regular dependency updates for security patches
- Input sanitization for user-provided content
- Secure PDF generation without external dependencies

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Groq AI](https://groq.com/) for providing the AI model API
- [shadcn/ui](https://ui.shadcn.com/) for the excellent component system
- [Google Maps Platform](https://developers.google.com/maps) for location services
- [LangChain](https://js.langchain.com/) for document processing capabilities
