import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Libraries } from '@react-google-maps/api';
import { useTripPlanning } from '@/contexts/TripPlanningContext';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const libraries: Libraries = ['places'];

interface PlaceImage {
  url: string;
  name: string;
}

interface Location {
  lat: number;
  lng: number;
}

const MapDisplay = () => {
  const { destination } = useTripPlanning();
  const [location, setLocation] = useState<Location>({ lat: 0, lng: 0 });
  const [popularPlaces, setPopularPlaces] = useState<PlaceImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries
  });

  useEffect(() => {
    if (!destination) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: destination }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const { lat, lng } = results[0].geometry.location;
        setLocation({ lat: lat(), lng: lng() });
        fetchPopularPlaces(lat(), lng());
      }
    });
  }, [destination]);

  const fetchPopularPlaces = async (lat: number, lng: number) => {
    try {
      setIsLoading(true);
      
      const map = new google.maps.Map(document.createElement('div'));
      const service = new google.maps.places.PlacesService(map);

      const request = {
        location: { lat, lng },
        type: 'tourist_attraction',
        rankBy: google.maps.places.RankBy.DISTANCE,
        keyword: 'tourist attraction'
      };

      const searchNearby = () => {
        return new Promise((resolve, reject) => {
          service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
              resolve(results);
            } else {
              reject(new Error(`Places search failed with status: ${status}`));
            }
          });
        });
      };

      const results = await searchNearby();
      const placeImages = (results as google.maps.places.PlaceResult[])
        .filter(place => place.photos && place.photos.length > 0)
        .slice(0, 5)
        .map(place => ({
          url: place.photos![0].getUrl({
            maxWidth: 400,
            maxHeight: 400
          }),
          name: place.name || 'Tourist Attraction'
        }));

      setPopularPlaces(placeImages);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching popular places:', error);
      setIsLoading(false);
    }
  };

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '0.75rem'
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Location & Attractions</h2>
        <div className="animate-pulse">
          <div className="bg-gray-200 rounded-xl h-[400px] mb-4"></div>
          <div className="bg-gray-200 rounded-xl h-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Location & Attractions</h2>
      
      {destination ? (
        <>
          <div className="mb-4">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={location}
              zoom={13}
            >
              <Marker position={location} />
            </GoogleMap>
          </div>

          {popularPlaces.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Popular Attractions</h3>
              <Carousel className="w-full">
                <CarouselContent>
                  {popularPlaces.map((place, index) => (
                    <CarouselItem key={index} className="basis-1/2 md:basis-1/3">
                      <div className="relative aspect-square overflow-hidden rounded-lg">
                        <img
                          src={place.url}
                          alt={place.name}
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
                          {place.name}
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <div className="mb-3">🗺️</div>
          <p>Start chatting to see your destination on the map!</p>
        </div>
      )}
    </div>
  );
};

export default MapDisplay;
