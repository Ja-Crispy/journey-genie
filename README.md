# JourneyGenie - AI Travel Assistant

JourneyGenie is an AI-powered travel planning application that helps users create personalized itineraries for their trips. Built with React, TypeScript, and Groq AI, this app provides a conversational interface for travel planning.

## Features

- **AI-Powered Chat Interface**: Converse with JourneyGenie to create travel plans
- **Trip Preferences**: Set budget, dates, and activity preferences
- **Interactive Itineraries**: View and manage day-by-day travel plans 
- **Download Itineraries**: Export your travel plans as PDF files
- **Location Maps**: See destinations and attractions on interactive maps
- **Chat History**: Save and manage multiple trip conversations
- **Dark Mode**: Toggle between light and dark themes

## Technologies Used

- React 18 with TypeScript
- Vite for building and development
- Groq AI for natural language processing
- Google Maps API for location services
- jsPDF for PDF generation
- Tailwind CSS and shadcn/ui for styling
- React Router for navigation
- Lucide React for icons

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- NPM or Yarn
- Groq API key
- Google Maps API key

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
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:4000`

## Usage

1. Start a new chat or select an existing conversation
2. Tell JourneyGenie about your travel plans
3. Set your budget, travel dates, and preferences
4. Ask for recommendations or specific itinerary details
5. View your generated itinerary and attractions on the map
6. Download your itinerary as a PDF for offline reference

## Project Structure

- `/src/components` - React components
- `/src/contexts` - Context providers for state management
- `/src/pages` - Page components for routing
- `/src/utils` - Utility functions
- `/src/hooks` - Custom React hooks

## Known Issues and Limitations

- The voice input functionality is currently simulated
- Map functionality requires a valid Google Maps API key with Places API enabled
- PDF generation requires proper configuration of jsPDF and jspdf-autotable

## Security

This project addresses known security vulnerabilities:
- esbuild is maintained at version 0.25.0 or higher to prevent unauthorized access to the development server
- Regular dependency updates are performed to mitigate security risks

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Groq AI](https://groq.com/) for providing the AI model API
- [shadcn/ui](https://ui.shadcn.com/) for component design system
- [Google Maps Platform](https://developers.google.com/maps) for location services
