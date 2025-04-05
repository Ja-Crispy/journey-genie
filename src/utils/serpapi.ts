const API_KEY = import.meta.env.VITE_SERPAPI_API_KEY;

interface HotelSearchParams {
  location: string;
  checkIn: Date;
  checkOut: Date;
  guests?: number;
}

interface FlightSearchParams {
  origin: string;
  destination: string;
  departDate: Date;
  returnDate?: Date;
  passengers?: number;
}

interface DestinationSearchParams {
  preference: string;
  budget?: number;
}

export interface HotelResult {
  name: string;
  price: string;
  rating: number;
  imageUrl: string;
  url: string;
}

export interface FlightResult {
  airline: string;
  price: string;
  duration: string;
  stops: number;
  departureTime: string;
  arrivalTime: string;
  url: string;
}

export interface DestinationRecommendation {
  name: string;
  description: string;
  imageUrl: string;
  averagePrice: string;
}

// Helper function to format date as YYYY-MM-DD
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Search for hotels using Google Hotels API via SerpAPI
 */
export const searchHotels = async (params: HotelSearchParams): Promise<HotelResult[]> => {
  try {
    const { location, checkIn, checkOut, guests = 2 } = params;
    
    // Add some basic validation
    if (!location || !checkIn || !checkOut) {
      throw new Error('Missing required parameters');
    }
    
    const requestParams = {
      engine: "google_hotels",
      q: location, // This is correct - uses city/location name as a query
      check_in_date: formatDate(checkIn),
      check_out_date: formatDate(checkOut),
      adults: guests.toString(),
      currency: "USD",
      gl: "us",
      hl: "en",
      api_key: API_KEY
    };
    
    const queryString = new URLSearchParams(requestParams as any).toString();
    console.log('Hotel search URL:', `https://serpapi.com/search?${queryString}`);
    
    const response = await fetch(`https://serpapi.com/search?${queryString}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      console.error('Hotel search API error:', data.error);
      throw new Error(data.error);
    }
    
    console.log('Hotel search response:', data);
    
    // Check for error in search metadata
    if (data.search_metadata && data.search_metadata.status !== 'Success') {
      console.error('Search status not successful:', data.search_metadata.status);
      throw new Error(data.search_metadata.status);
    }
    
    // The correct property is "properties" according to the documentation
    const properties = data.properties || [];
    
    if (!properties || properties.length === 0) {
      console.warn('No hotels found in the response for', location);
      return [];
    }
    
    return properties.slice(0, 5).map((hotel: any) => ({
      name: hotel.name || 'Unknown Hotel',
      price: hotel.price || 'Price unavailable',
      rating: hotel.rating || 0,
      imageUrl: hotel.thumbnail || '',
      url: hotel.link || '',
    }));
  } catch (error) {
    console.error('Error searching hotels:', error);
    throw error; // Re-throw to handle in the component
  }
};

/**
 * Search for flights using Google Flights API via SerpAPI
 */
export const searchFlights = async (params: FlightSearchParams): Promise<FlightResult[]> => {
  try {
    const { origin, destination, departDate, returnDate, passengers = 1 } = params;
    
    // Add some basic validation
    if (!origin || !destination || !departDate) {
      throw new Error('Missing required parameters');
    }
    
    // Always convert to uppercase for consistency
    const originCode = origin.toUpperCase();
    const destinationCode = destination.toUpperCase();
    
    // According to docs, departure_id should be an IATA code (e.g., LAX, JFK)
    // These are always 3-letter uppercase codes
    if (!originCode.match(/^[A-Z]{3}$/)) {
      console.warn('Origin should be a 3-letter IATA airport code (e.g., LAX, JFK)');
    }
    
    if (!destinationCode.match(/^[A-Z]{3}$/)) {
      console.warn('Destination should be a 3-letter IATA airport code (e.g., LAX, JFK)');
    }
    
    const requestParams: Record<string, string> = {
      engine: "google_flights",
      departure_id: originCode,
      arrival_id: destinationCode,
      outbound_date: formatDate(departDate),
      currency: "USD",
      hl: "en",
      api_key: API_KEY
    };

    if (returnDate) {
      requestParams.return_date = formatDate(returnDate);
    }

    if (passengers) {
      requestParams.adults = passengers.toString();
    }
    
    const queryString = new URLSearchParams(requestParams).toString();
    console.log('Flight search URL:', `https://serpapi.com/search?${queryString}`);
    
    const response = await fetch(`https://serpapi.com/search?${queryString}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      console.error('Flight search API error:', data.error);
      throw new Error(data.error);
    }
    
    console.log('Flight search response:', data);
    
    // Check for error in search metadata
    if (data.search_metadata && data.search_metadata.status !== 'Success') {
      console.error('Search status not successful:', data.search_metadata.status);
      throw new Error(data.search_metadata.status);
    }
    
    // The flights should be in best_flights and other_flights
    const flights = [
      ...(data.best_flights || []), 
      ...(data.other_flights || [])
    ];
    
    if (flights.length === 0) {
      console.warn('No flights found in response');
      return [];
    }
    
    return flights.slice(0, 5).map((flight: any) => {
      // Get the first flight segment for departure and arrival information
      const firstFlight = flight.flights && flight.flights.length > 0 ? flight.flights[0] : null;
      
      return {
        airline: firstFlight?.airline || flight.airline || 'Unknown Airline',
        price: flight.price ? `$${flight.price}` : 'Price unavailable',
        duration: flight.total_duration ? `${Math.floor(flight.total_duration / 60)}h ${flight.total_duration % 60}m` : 'Unknown',
        stops: (flight.flights?.length || 1) - 1,
        departureTime: firstFlight?.departure_airport?.time || '',
        arrivalTime: firstFlight?.arrival_airport?.time || '',
        url: flight.booking_token ? `https://www.google.com/flights?hl=en#flt=${flight.booking_token}` : '',
      };
    });
  } catch (error) {
    console.error('Error searching flights:', error);
    throw error; // Re-throw to handle in the component
  }
};

/**
 * Get destination recommendations based on preferences using Google Search API via SerpAPI
 */
export const getDestinationRecommendations = async (params: DestinationSearchParams): Promise<DestinationRecommendation[]> => {
  try {
    const { preference, budget } = params;
    
    // Construct a search query based on preferences and budget
    let query = `best ${preference} destinations`;
    if (budget) {
      query += ` under $${budget}`;
    }
    
    const requestParams = {
      engine: "google",
      q: query,
      tbm: "isch", // Image search to get visual results
      gl: "us",
      hl: "en",
      api_key: API_KEY,
    };
    
    const queryString = new URLSearchParams(requestParams as any).toString();
    const response = await fetch(`https://serpapi.com/search?${queryString}`);
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    // Extract image results as destination recommendations
    const destinations = (data.images_results || []).slice(0, 6).map((result: any) => ({
      name: result.title?.split('|')[0].trim() || 'Recommended Destination',
      description: result.source || '',
      imageUrl: result.thumbnail || '',
      averagePrice: budget ? `Under $${budget}` : 'Varies',
    }));
    
    return destinations;
  } catch (error) {
    console.error('Error getting destination recommendations:', error);
    return [];
  }
};
