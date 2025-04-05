import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTripPlanning } from '@/contexts/TripPlanningContext';
import { Loader2, PlaneTakeoff, Hotel, Plus } from 'lucide-react';
import Groq from 'groq-sdk';
import { 
  searchFlights, 
  searchHotels, 
  FlightResult,
  HotelResult
} from '@/utils/serpapi';
import { toast } from "@/components/ui/use-toast";

// Initialize Groq client for airport code lookup
const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

const TravelSearch = () => {
  const { 
    destination: contextDestination, 
    selectedDates, 
    budget,
    itinerary,
    setItinerary,
    chatHistory,
    currentChatId
  } = useTripPlanning();
  
  const [activeTab, setActiveTab] = useState('flights');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [flights, setFlights] = useState<FlightResult[]>([]);
  const [hotels, setHotels] = useState<HotelResult[]>([]);
  const [errorMsg, setErrorMsg] = useState<{flights: string; hotels: string}>({flights: '', hotels: ''});

  const [originCity, setOriginCity] = useState<string | null>(null);
  const [originCode, setOriginCode] = useState<string | null>(null);
  const [destinationCode, setDestinationCode] = useState<string | null>(null);
  const [passengers, setPassengers] = useState(1);

  // Extract origin city and process airport codes when component mounts or when chat history changes
  useEffect(() => {
    if (contextDestination && selectedDates.length > 0) {
      if (!originCity) {
        extractOriginFromChat();
      } else if (!originCode || !destinationCode) {
        processAirportCodes();
      }
    }
  }, [contextDestination, selectedDates, chatHistory, currentChatId, originCity]);

  // Try hotel search when destination is set
  useEffect(() => {
    if (contextDestination && selectedDates.length > 1 && !isLoading && hotels.length === 0 && !errorMsg.hotels) {
      searchHotelsWithLocation(contextDestination);
    }
  }, [contextDestination, selectedDates]);

  // Trigger flight search when we have airport codes
  useEffect(() => {
    if (originCode && destinationCode && selectedDates.length > 0 && !isLoading && flights.length === 0 && !errorMsg.flights) {
      searchFlightsWithCodes(originCode, destinationCode);
    }
  }, [originCode, destinationCode, selectedDates]);

  const extractOriginFromChat = async () => {
    console.log("Extracting origin from chat...");
    if (!currentChatId || chatHistory.length === 0) {
      // Default origin if no chat history
      setOriginCity('New York');
      return;
    }
    
    const currentChat = chatHistory.find(chat => chat.id === currentChatId);
    if (!currentChat || currentChat.messages.length === 0) {
      setOriginCity('New York');
      return;
    }

    // Look for messages from the user that might contain origin information
    const userMessages = currentChat.messages.filter(m => m.sender === 'user');
    if (userMessages.length === 0) {
      setOriginCity('New York');
      return;
    }

    // Common origin indicators in chat
    const originIndicators = [
      'from ',
      'leaving from ',
      'departing from ',
      'starting from ',
      'flying from ',
      'traveling from ',
      'I live in ',
      'I am in ',
      'I\'m in ',
      'my city is ',
      'my location is '
    ];

    // Analyze messages to find potential origin city
    for (const message of userMessages) {
      const content = message.content.toLowerCase();
      
      for (const indicator of originIndicators) {
        const index = content.indexOf(indicator);
        if (index !== -1) {
          // Extract the text after the indicator
          const afterIndicator = content.substring(index + indicator.length);
          
          // Look for the end of the city name (up to a punctuation mark or "to")
          const endIndex = afterIndicator.search(/[.,;!?]|\sto\s/);
          const cityName = endIndex !== -1 
            ? afterIndicator.substring(0, endIndex).trim() 
            : afterIndicator.split(' ').slice(0, 2).join(' ').trim();
          
          if (cityName) {
            // Title case the city name
            const formattedCity = cityName
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
            
            console.log("Found origin city:", formattedCity);
            setOriginCity(formattedCity);
            return;
          }
        }
      }
    }
    
    // If no origin found in chat, use LLM to infer a reasonable origin
    try {
      setIsProcessing(true);
      const response = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `Based on these chat messages, determine a likely origin city for a trip to ${contextDestination}. If no origin city is mentioned, suggest a major city based on typical travel patterns. Only reply with the city name, no other text:\n\n${userMessages.map(m => m.content).join('\n')}`
          }
        ],
        model: "llama-3.1-8b-instant",
        max_tokens: 20,
      });

      const inferredOrigin = response.choices[0]?.message?.content?.trim() || 'New York';
      console.log("Inferred origin city:", inferredOrigin);
      setOriginCity(inferredOrigin);
    } catch (error) {
      console.error("Error inferring origin city:", error);
      setOriginCity('New York'); // Default fallback
    } finally {
      setIsProcessing(false);
    }
  };

  // Get airport codes for cities using Groq LLM
  const processAirportCodes = async () => {
    if (!originCity || !contextDestination) return;
    
    console.log("Getting airport codes for", originCity, "and", contextDestination);
    setIsProcessing(true);
    
    try {
      const prompt = `I need the 3-letter IATA airport codes for the following cities:
1. ${originCity}
2. ${contextDestination}

Please respond with ONLY a JSON object in the following format:
{
  "originCode": "XXX",
  "destinationCode": "YYY"
}
where XXX is the most common airport code for ${originCity} and YYY is the most common airport code for ${contextDestination}. 
Do not include any other text or explanation in your response.`;

      const response = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        model: "llama-3.1-8b-instant",
        temperature: 0.2,
        max_tokens: 100,
      });

      const content = response.choices[0]?.message?.content || '';
      console.log("LLM response:", content);
      
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('Failed to extract JSON response');
      }
      
      const codes = JSON.parse(jsonMatch[0]);
      console.log('Airport codes received:', codes);
      
      setOriginCode(codes.originCode);
      setDestinationCode(codes.destinationCode);
    } catch (error) {
      console.error('Error getting airport codes:', error);
      // Default to some common codes if there's an error
      const originFirstLetters = originCity.substring(0, 3).toUpperCase();
      const destFirstLetters = contextDestination.substring(0, 3).toUpperCase();
      setOriginCode(originFirstLetters);
      setDestinationCode(destFirstLetters);
      
      toast({
        title: "Could not determine exact airport codes",
        description: "Using approximate codes instead. Results may be limited.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const searchFlightsWithCodes = async (origin: string, destination: string) => {
    if (!selectedDates.length) return;
    
    setIsLoading(true);
    setErrorMsg(prev => ({ ...prev, flights: '' }));
    
    try {
      console.log(`Searching flights from ${origin} to ${destination} on ${formatDate(selectedDates[0])}`);
      
      const results = await searchFlights({
        origin,
        destination,
        departDate: selectedDates[0],
        returnDate: selectedDates.length > 1 ? selectedDates[selectedDates.length - 1] : undefined,
        passengers
      });
      
      console.log('Flight search results:', results);
      setFlights(results);
      
      if (results.length === 0) {
        setErrorMsg(prev => ({ 
          ...prev, 
          flights: "No flights found. Try different dates or search for a major city airport."
        }));
      }
    } catch (error) {
      console.error('Flight search error:', error);
      setErrorMsg(prev => ({ 
        ...prev, 
        flights: "Error searching flights. Please try again later."
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const searchHotelsWithLocation = async (location: string) => {
    if (!selectedDates.length || selectedDates.length < 2) return;
    
    setIsLoading(true);
    setErrorMsg(prev => ({ ...prev, hotels: '' }));
    
    try {
      console.log(`Searching hotels in ${location} from ${formatDate(selectedDates[0])} to ${formatDate(selectedDates[selectedDates.length - 1])}`);
      
      const results = await searchHotels({
        location,
        checkIn: selectedDates[0],
        checkOut: selectedDates[selectedDates.length - 1],
        guests: passengers
      });
      
      console.log('Hotel search results:', results);
      setHotels(results);
      
      if (results.length === 0) {
        setErrorMsg(prev => ({ 
          ...prev, 
          hotels: "No hotels found. Try adjusting your dates or search for a better-known destination."
        }));
      }
    } catch (error) {
      console.error('Hotel search error:', error);
      setErrorMsg(prev => ({ 
        ...prev, 
        hotels: "Error searching hotels. Please try again later."
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to format date
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric'
    });
  };

  // Function to add flight info to itinerary
  const addFlightToItinerary = (flight: FlightResult) => {
    const newItinerary = [...itinerary];
    
    // Check if we have any itinerary days
    if (newItinerary.length === 0) {
      // Create a new day for departure
      newItinerary.push({
        day: 1,
        activities: [`Flight from ${originCity} (${originCode}) to ${contextDestination} (${destinationCode}) with ${flight.airline}. Departure: ${flight.departureTime}, Arrival: ${flight.arrivalTime}. ${flight.price}`]
      });
      
      // If there's a return date, add a return flight to the last day
      if (selectedDates.length > 1) {
        const lastDay = selectedDates.length;
        newItinerary.push({
          day: lastDay,
          activities: [`Return flight from ${contextDestination} (${destinationCode}) to ${originCity} (${originCode}) with ${flight.airline}. Price: ${flight.price}`]
        });
      }
    } else {
      // Add to first day if already exists
      const firstDayIndex = newItinerary.findIndex(day => day.day === 1);
      if (firstDayIndex >= 0) {
        newItinerary[firstDayIndex].activities.unshift(`Flight from ${originCity} (${originCode}) to ${contextDestination} (${destinationCode}) with ${flight.airline}. Departure: ${flight.departureTime}, Arrival: ${flight.arrivalTime}. ${flight.price}`);
      } else {
        newItinerary.unshift({
          day: 1,
          activities: [`Flight from ${originCity} (${originCode}) to ${contextDestination} (${destinationCode}) with ${flight.airline}. Departure: ${flight.departureTime}, Arrival: ${flight.arrivalTime}. ${flight.price}`]
        });
      }
      
      // Add return flight if there's a return date
      if (selectedDates.length > 1) {
        const lastDay = selectedDates.length;
        const lastDayIndex = newItinerary.findIndex(day => day.day === lastDay);
        if (lastDayIndex >= 0) {
          newItinerary[lastDayIndex].activities.push(`Return flight from ${contextDestination} (${destinationCode}) to ${originCity} (${originCode}) with ${flight.airline}. Price: ${flight.price}`);
        } else {
          newItinerary.push({
            day: lastDay,
            activities: [`Return flight from ${contextDestination} (${destinationCode}) to ${originCity} (${originCode}) with ${flight.airline}. Price: ${flight.price}`]
          });
        }
      }
    }
    
    // Sort the itinerary by day
    newItinerary.sort((a, b) => a.day - b.day);
    setItinerary(newItinerary);
    toast({ 
      title: "Flight added to itinerary",
      description: `Flight details have been added to your travel plan.`
    });
  };

  // Function to add hotel to itinerary
  const addHotelToItinerary = (hotel: HotelResult) => {
    const newItinerary = [...itinerary];
    let accommodationAdded = false;
    
    // Check if we have any days in the itinerary
    if (newItinerary.length === 0) {
      // Create a day for each day of the trip
      const tripLength = selectedDates.length;
      for (let i = 1; i <= tripLength; i++) {
        newItinerary.push({
          day: i,
          activities: i === 1 ? [`Check-in at ${hotel.name}. ${hotel.price} per night. Rating: ${hotel.rating}/5`] : []
        });
      }
      
      // Add check-out activity on the last day
      if (tripLength > 1) {
        newItinerary[tripLength - 1].activities.push(`Check-out from ${hotel.name}`);
      }
      
      accommodationAdded = true;
    } else {
      // Add accommodation info to each day
      for (let i = 0; i < newItinerary.length; i++) {
        const day = newItinerary[i];
        
        // Check if this day already has accommodation
        const hasAccommodation = day.activities.some(activity => 
          activity.includes('hotel') || 
          activity.includes('Hotel') || 
          activity.includes('stay') || 
          activity.includes('Check-in') || 
          activity.includes('Check-out')
        );
        
        if (!hasAccommodation) {
          if (day.day === 1) {
            day.activities.push(`Check-in at ${hotel.name}. ${hotel.price} per night. Rating: ${hotel.rating}/5`);
            accommodationAdded = true;
          } else if (day.day === selectedDates.length) {
            day.activities.push(`Check-out from ${hotel.name}`);
          }
        }
      }
    }
    
    // If no accommodation was added (maybe due to missing days), add a note
    if (!accommodationAdded) {
      // Find the first day or create it
      let firstDay = newItinerary.find(day => day.day === 1);
      if (!firstDay) {
        firstDay = { day: 1, activities: [] };
        newItinerary.push(firstDay);
      }
      
      firstDay.activities.push(`Stay at ${hotel.name}. ${hotel.price} per night. Rating: ${hotel.rating}/5`);
    }
    
    // Sort the itinerary by day
    newItinerary.sort((a, b) => a.day - b.day);
    setItinerary(newItinerary);
    toast({ 
      title: "Hotel added to itinerary",
      description: `${hotel.name} has been added to your travel plan.`
    });
  };

  const retryFlightSearch = () => {
    if (!originCode || !destinationCode) {
      processAirportCodes();
    } else {
      searchFlightsWithCodes(originCode, destinationCode);
    }
  };

  const retryHotelSearch = () => {
    if (contextDestination) {
      searchHotelsWithLocation(contextDestination);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">Travel Options</h2>
      
      {isProcessing && (
        <div className="p-4 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
          <p className="ml-2 text-gray-600 dark:text-gray-400">Finding travel options for your trip...</p>
        </div>
      )}
      
      {!isProcessing && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Trip:</span> {originCity || 'Loading origin...'} 
            {originCode ? ` (${originCode})` : ''} → {contextDestination || 'Select destination'} 
            {destinationCode ? ` (${destinationCode})` : ''}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Dates:</span> {selectedDates.length > 0 ? 
              `${formatDate(selectedDates[0])} - ${selectedDates.length > 1 ? formatDate(selectedDates[selectedDates.length - 1]) : 'One-way'}` : 
              'No dates selected'}
          </p>
        </div>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="flights" className="flex items-center gap-2">
            <PlaneTakeoff size={16} />
            <span>Flights</span>
          </TabsTrigger>
          <TabsTrigger value="hotels" className="flex items-center gap-2">
            <Hotel size={16} />
            <span>Hotels</span>
          </TabsTrigger>
        </TabsList>

        {/* Flights tab */}
        <TabsContent value="flights" className="space-y-4">
          {isLoading && activeTab === 'flights' && (
            <div className="text-center p-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-teal-500" />
              <p className="text-gray-500 dark:text-gray-400">Searching for flights...</p>
            </div>
          )}
          
          {!isLoading && flights.length > 0 && (
            <div className="space-y-3 mt-4">
              <h3 className="font-medium dark:text-white">Available Flights</h3>
              <div className="grid grid-cols-1 gap-3">
                {flights.map((flight, index) => (
                  <Card key={index} className="dark:bg-gray-700">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium dark:text-white">{flight.airline}</p>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-300 gap-2">
                            <span>{flight.departureTime} - {flight.arrivalTime}</span>
                            <span>•</span>
                            <span>{flight.duration}</span>
                            <span>•</span>
                            <span>{flight.stops} stop{flight.stops !== 1 ? 's' : ''}</span>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <p className="text-lg font-bold text-teal-600 dark:text-teal-400">{flight.price}</p>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => addFlightToItinerary(flight)}
                              className="text-sm text-teal-500 hover:underline flex items-center dark:text-teal-400"
                            >
                              <Plus size={14} className="mr-1" /> Add to itinerary
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {!isLoading && flights.length === 0 && errorMsg.flights && (
            <div className="text-center p-6 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800">
              <p className="text-red-600 dark:text-red-400 mb-4">{errorMsg.flights}</p>
              <Button 
                onClick={retryFlightSearch}
                variant="outline" 
                className="mx-auto"
              >
                Retry Search
              </Button>
            </div>
          )}
          
          {!isLoading && flights.length === 0 && !errorMsg.flights && (
            <div className="text-center p-8 text-gray-500 dark:text-gray-400">
              {originCode && destinationCode ? 
                "Waiting for flight details to search..." :
                "Processing destination details to search for flights..."}
            </div>
          )}
        </TabsContent>

        {/* Hotels tab */}
        <TabsContent value="hotels" className="space-y-4">
          {isLoading && activeTab === 'hotels' && (
            <div className="text-center p-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-teal-500" />
              <p className="text-gray-500 dark:text-gray-400">Searching for hotels...</p>
            </div>
          )}
          
          {!isLoading && hotels.length > 0 && (
            <div className="space-y-3 mt-4">
              <h3 className="font-medium dark:text-white">Available Hotels</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {hotels.map((hotel, index) => (
                  <Card key={index} className="overflow-hidden dark:bg-gray-700">
                    <div className="flex h-32">
                      <div className="w-1/3">
                        {hotel.imageUrl && (
                          <img 
                            src={hotel.imageUrl} 
                            alt={hotel.name} 
                            className="h-full w-full object-cover"
                          />
                        )}
                        {!hotel.imageUrl && (
                          <div className="h-full w-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                            <Hotel size={32} className="text-gray-400 dark:text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="w-2/3 p-3 flex flex-col justify-between">
                        <div>
                          <p className="font-medium truncate dark:text-white">{hotel.name}</p>
                          <div className="flex items-center text-amber-500">
                            {[...Array(Math.floor(hotel.rating))].map((_, i) => (
                              <span key={i}>★</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between items-end">
                          <p className="text-lg font-bold text-teal-600 dark:text-teal-400">{hotel.price}</p>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => addHotelToItinerary(hotel)}
                              className="text-sm text-teal-500 hover:underline flex items-center dark:text-teal-400"
                            >
                              <Plus size={14} className="mr-1" /> Add
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {!isLoading && hotels.length === 0 && errorMsg.hotels && (
            <div className="text-center p-6 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800">
              <p className="text-red-600 dark:text-red-400 mb-4">{errorMsg.hotels}</p>
              <Button 
                onClick={retryHotelSearch}
                variant="outline" 
                className="mx-auto"
              >
                Retry Search
              </Button>
            </div>
          )}
          
          {!isLoading && hotels.length === 0 && !errorMsg.hotels && (
            <div className="text-center p-8 text-gray-500 dark:text-gray-400">
              {contextDestination ? 
                "Searching for hotels at your destination..." :
                "Waiting for destination details to search for hotels..."}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TravelSearch;
