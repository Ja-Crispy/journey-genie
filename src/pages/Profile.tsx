
import React, { useState } from 'react';
import { 
  User, 
  Camera, 
  Edit, 
  Mountain, 
  Utensils, 
  Building, 
  Umbrella, 
  ChevronDown, 
  ChevronUp,
  Plus,
  X,
  Lock,
  Link
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "@/hooks/use-toast";

const Profile = () => {
  // Profile data
  const [name, setName] = useState('Alex Johnson');
  const [email] = useState('alex@example.com');
  const [isEditing, setIsEditing] = useState(false);
  const [travelTypes, setTravelTypes] = useState<string[]>(['adventure', 'culture']);
  const [budgetRange, setBudgetRange] = useState([1500]);
  const [destinations, setDestinations] = useState(['Barcelona', 'Tokyo', 'New York']);
  const [newDestination, setNewDestination] = useState('');
  
  // Past trips data
  const [pastTrips, setPastTrips] = useState([
    {
      id: 1,
      title: 'Weekend in Rome',
      date: 'Mar 10-15, 2023',
      budget: '$1,200',
      isOpen: false,
      itinerary: [
        { day: 1, activities: ['Colosseum', 'Roman Forum', 'Dinner at Trattoria'] },
        { day: 2, activities: ['Vatican Museums', 'St. Peter\'s Basilica', 'Trastevere'] },
        { day: 3, activities: ['Trevi Fountain', 'Spanish Steps', 'Villa Borghese'] }
      ]
    },
    {
      id: 2,
      title: 'Tokyo Adventure',
      date: 'Jan 5-15, 2023',
      budget: '$3,500',
      isOpen: false,
      itinerary: [
        { day: 1, activities: ['Shibuya Crossing', 'Meiji Shrine', 'Shinjuku'] },
        { day: 2, activities: ['Tokyo Skytree', 'Asakusa', 'Ueno Park'] },
        { day: 3, activities: ['Akihabara', 'Imperial Palace', 'Ginza Shopping'] }
      ]
    }
  ]);

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    });
  };
  
  const toggleTripDetails = (tripId: number) => {
    setPastTrips(pastTrips.map(trip => 
      trip.id === tripId ? { ...trip, isOpen: !trip.isOpen } : trip
    ));
  };
  
  const addDestination = () => {
    if (newDestination.trim() !== '' && !destinations.includes(newDestination.trim())) {
      setDestinations([...destinations, newDestination.trim()]);
      setNewDestination('');
    }
  };
  
  const removeDestination = (destination: string) => {
    setDestinations(destinations.filter(d => d !== destination));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addDestination();
    }
  };

  return (
    <div className="min-h-screen bg-ivory py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid gap-8">
          {/* Profile Overview */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-teal-500 p-6 text-white">
              <h1 className="text-2xl font-bold">User Profile</h1>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                {/* Profile Picture */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                    <User size={64} className="text-gray-400" />
                  </div>
                  <button 
                    className="absolute bottom-0 right-0 bg-teal-500 text-white p-2 rounded-full shadow-md hover:bg-teal-600 transition-colors"
                    aria-label="Upload profile picture"
                  >
                    <Camera size={18} />
                  </button>
                </div>
                
                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <Input 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                          className="max-w-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <Input 
                          value={email} 
                          disabled 
                          className="max-w-xs bg-gray-50"
                        />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed here</p>
                      </div>
                      <Button onClick={handleSaveProfile}>Save Profile</Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-center md:justify-start mb-2">
                        <h2 className="text-2xl font-bold mr-2">{name}</h2>
                        <button 
                          onClick={() => setIsEditing(true)} 
                          className="bg-teal-500 text-white p-1.5 rounded-full hover:bg-teal-600 transition-colors"
                          aria-label="Edit profile"
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                      <p className="text-gray-600">{email}</p>
                      <div className="mt-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setIsEditing(true)}
                        >
                          Edit Profile
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Travel Preferences */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-teal-500 p-6 text-white">
              <h2 className="text-xl font-bold">Travel Preferences</h2>
            </div>
            
            <div className="p-6 space-y-8">
              {/* Favorite Travel Types */}
              <div>
                <h3 className="text-lg font-medium mb-4">Favorite Travel Types</h3>
                <ToggleGroup 
                  type="multiple"
                  value={travelTypes}
                  onValueChange={setTravelTypes}
                  className="flex flex-wrap gap-2"
                  aria-label="Select favorite travel types"
                >
                  <ToggleGroupItem value="adventure" aria-label="Adventure travel type" className="flex items-center gap-2">
                    <Mountain size={18} />
                    <span>Adventure</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="food" aria-label="Food travel type" className="flex items-center gap-2">
                    <Utensils size={18} />
                    <span>Food & Dining</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="culture" aria-label="Culture travel type" className="flex items-center gap-2">
                    <Building size={18} />
                    <span>Culture</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="relaxation" aria-label="Relaxation travel type" className="flex items-center gap-2">
                    <Umbrella size={18} />
                    <span>Relaxation</span>
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              {/* Budget Range */}
              <div>
                <h3 className="text-lg font-medium mb-4">Budget Range</h3>
                <div className="px-2">
                  <Slider
                    defaultValue={budgetRange}
                    max={5000}
                    step={100}
                    onValueChange={setBudgetRange}
                    aria-label="Select budget range"
                  />
                  <div className="flex justify-between mt-2 text-sm text-gray-500">
                    <span>$0</span>
                    <span className="font-medium text-teal-500">${budgetRange[0]}</span>
                    <span>$5,000+</span>
                  </div>
                </div>
              </div>
              
              {/* Preferred Destinations */}
              <div>
                <h3 className="text-lg font-medium mb-4">Preferred Destinations</h3>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input 
                      value={newDestination} 
                      onChange={(e) => setNewDestination(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Add a destination"
                      className="flex-1"
                      aria-label="Enter a new preferred destination"
                    />
                    <Button onClick={addDestination} aria-label="Add destination">
                      <Plus size={16} />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {destinations.map((destination) => (
                      <div 
                        key={destination} 
                        className="bg-gray-100 px-3 py-1.5 rounded-full flex items-center gap-2 text-sm"
                      >
                        {destination}
                        <button 
                          onClick={() => removeDestination(destination)}
                          className="p-0.5 rounded-full hover:bg-gray-200"
                          aria-label={`Remove ${destination}`}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Past Trips */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-teal-500 p-6 text-white">
              <h2 className="text-xl font-bold">Past Trips & Saved Itineraries</h2>
            </div>
            
            <div className="divide-y">
              {pastTrips.map((trip) => (
                <Collapsible 
                  key={trip.id} 
                  open={trip.isOpen}
                  onOpenChange={() => toggleTripDetails(trip.id)}
                  className="p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">{trip.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                        <span>{trip.date}</span>
                        <span>Budget: {trip.budget}</span>
                      </div>
                    </div>
                    <CollapsibleTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center gap-1"
                        aria-label={trip.isOpen ? "Hide trip details" : "Show trip details"}
                      >
                        {trip.isOpen ? (
                          <>
                            <span>Hide details</span>
                            <ChevronUp size={16} />
                          </>
                        ) : (
                          <>
                            <span>Show details</span>
                            <ChevronDown size={16} />
                          </>
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  
                  <CollapsibleContent className="mt-4 space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium mb-3">Itinerary</h4>
                      <div className="space-y-3">
                        {trip.itinerary.map((day) => (
                          <div key={day.day} className="bg-white p-3 rounded border shadow-sm">
                            <h5 className="font-medium text-teal-600">Day {day.day}</h5>
                            <ul className="mt-2 space-y-1">
                              {day.activities.map((activity, idx) => (
                                <li key={idx} className="text-sm flex items-start">
                                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-coral-500 mt-1.5 mr-2"></span>
                                  {activity}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-1"
                        aria-label="Share itinerary"
                      >
                        <Link size={16} />
                        <span>Share</span>
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        className="bg-teal-500 hover:bg-teal-600"
                        aria-label="Create similar trip"
                      >
                        Create Similar Trip
                      </Button>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
              
              {pastTrips.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-gray-500">You haven't taken any trips yet.</p>
                  <Button className="mt-4">Plan Your First Trip</Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Account Management */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-teal-500 p-6 text-white">
              <h2 className="text-xl font-bold">Account Management</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="font-medium">Password & Security</h3>
                  <p className="text-sm text-gray-500">Manage your password and account security options</p>
                </div>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 md:w-auto w-full justify-center"
                  aria-label="Change password"
                >
                  <Lock size={16} />
                  <span>Change Password</span>
                </Button>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="font-medium">Linked Accounts</h3>
                  <p className="text-sm text-gray-500">Manage connections to other services</p>
                </div>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 md:w-auto w-full justify-center"
                  aria-label="Manage linked accounts"
                >
                  <Link size={16} />
                  <span>Manage Linked Accounts</span>
                </Button>
              </div>
              
              <div className="pt-6 mt-2 border-t border-red-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-red-600">Delete Account</h3>
                    <p className="text-sm text-gray-500">Permanently delete your account and all of your data</p>
                  </div>
                  <Button 
                    variant="destructive" 
                    className="md:w-auto w-full"
                    aria-label="Delete account"
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
