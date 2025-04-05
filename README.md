# JourneyGenie - AI-Powered Travel Companion

JourneyGenie is an intelligent travel planning application that uses AI to help users create personalized travel itineraries. With an intuitive interface and powerful features, it makes travel planning effortless and enjoyable.

## Features

- 🤖 AI-powered chat interface for natural travel planning
- 🗺️ Interactive map integration with Google Maps API
- 📅 Smart calendar for trip date selection
- 💰 Dynamic budget planning tools
- ✨ Travel preference customization
- 📋 Automated itinerary generation
- 🖼️ Popular attractions carousel
- 📱 Responsive design for all devices

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Groq AI API
- Google Maps API
- shadcn/ui components
- React Router
- Lucide Icons

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or bun package manager
- Google Maps API key
- Groq API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/journeygenie.git
   cd journeygenie
   ```

2. Install dependencies:
   ```bash
   bun install
   # or
   npm install
   ```

3. Create a `.env` file in the root directory and add your API keys:
   ```env
   VITE_GROQ_API_KEY=your_groq_api_key
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

4. Start the development server:
   ```bash
   bun dev
   # or
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) to view the app in your browser.

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/      # React context providers
├── hooks/         # Custom React hooks
├── lib/          # Utility functions
├── pages/        # Page components
└── App.tsx       # Root component
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Groq](https://groq.com/) for the AI capabilities
- [Google Maps Platform](https://developers.google.com/maps) for location services
