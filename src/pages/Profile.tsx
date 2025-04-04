
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  Camera, 
  Pencil, 
  Mountain, 
  Utensils, 
  Landmark, 
  Coffee, 
  MapPin,
  Calendar,
  DollarSign,
  ChevronDown,
  UserCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

type TravelPreference = 'adventure' | 'food' | 'culture' | 'relaxation';

const Profile = () => {
  const [preferences, setPreferences] = useState<Record<TravelPreference, boolean>>({
    adventure: true,
    food: true,
    culture: false,
    relaxation: false
  });
  
  const [budget, setBudget] = useState(2000);
  const [expandedTrip, setExpandedTrip] = useState<string | null>('trip-1');
  
  const togglePreference = (pref: TravelPreference) => {
    setPreferences({
      ...preferences,
      [pref]: !preferences[pref]
    });
  };
  
  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex items-center">
          <Link to="/" className="flex items-center text-teal-600 hover:text-teal-700">
            <ChevronLeft className="mr-2" size={20} />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl font-bold text-center flex-1">My Profile</h1>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
      </header>
      
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Overview */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <Avatar className="w-28 h-28 border-4 border-teal-100">
                  <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80" />
                  <AvatarFallback>
                    <UserCircle className="h-full w-full text-gray-400" />
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 bg-teal-500 text-white p-2 rounded-full shadow-md hover:bg-teal-600 transition-colors">
                  <Camera size={16} />
                  <span className="sr-only">Upload profile picture</span>
                </button>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Alex Thompson</h2>
                    <p className="text-gray-500">alex.thompson@example.com</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="mt-2 md:mt-0 flex items-center"
                  >
                    <Pencil size={14} className="mr-1" />
                    Edit Profile
                  </Button>
                </div>
                <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
                  <div className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm">
                    Joined May 2024
                  </div>
                  <div className="bg-coral-100 text-coral-700 px-3 py-1 rounded-full text-sm">
                    12 Trips Completed
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Travel Preferences */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Travel Preferences</h3>
              <Button variant="outline" size="sm" className="flex items-center">
                <Pencil size={14} className="mr-1" />
                Edit
              </Button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium mb-3">Travel Types</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    className={`flex flex-col items-center p-4 rounded-lg border-2 ${
                      preferences.adventure
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                    onClick={() => togglePreference('adventure')}
                  >
                    <Mountain size={24} className={preferences.adventure ? 'text-teal-500' : ''} />
                    <span className="mt-2 text-sm font-medium">Adventure</span>
                  </button>
                  
                  <button
                    className={`flex flex-col items-center p-4 rounded-lg border-2 ${
                      preferences.food
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                    onClick={() => togglePreference('food')}
                  >
                    <Utensils size={24} className={preferences.food ? 'text-teal-500' : ''} />
                    <span className="mt-2 text-sm font-medium">Food</span>
                  </button>
                  
                  <button
                    className={`flex flex-col items-center p-4 rounded-lg border-2 ${
                      preferences.culture
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                    onClick={() => togglePreference('culture')}
                  >
                    <Landmark size={24} className={preferences.culture ? 'text-teal-500' : ''} />
                    <span className="mt-2 text-sm font-medium">Culture</span>
                  </button>
                  
                  <button
                    className={`flex flex-col items-center p-4 rounded-lg border-2 ${
                      preferences.relaxation
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                    onClick={() => togglePreference('relaxation')}
                  >
                    <Coffee size={24} className={preferences.relaxation ? 'text-teal-500' : ''} />
                    <span className="mt-2 text-sm font-medium">Relaxation</span>
                  </button>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-medium mb-3">Budget Range</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">$0</span>
                    <span className="text-sm font-medium">${budget}</span>
                    <span className="text-sm text-gray-500">$5,000</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="5000"
                    step="100"
                    value={budget}
                    onChange={(e) => setBudget(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-500"
                  />
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-medium mb-3">Preferred Destinations</h4>
                <div className="space-y-2">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <MapPin size={18} className="text-teal-500 mr-2" />
                    <span className="flex-1">Paris, France</span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Pencil size={16} />
                    </button>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <MapPin size={18} className="text-teal-500 mr-2" />
                    <span className="flex-1">Kyoto, Japan</span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Pencil size={16} />
                    </button>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <MapPin size={18} className="text-teal-500 mr-2" />
                    <span className="flex-1">Santorini, Greece</span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Pencil size={16} />
                    </button>
                  </div>
                  <Button variant="ghost" className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 w-full justify-start">
                    + Add Destination
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Past Trips */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">Past Trips & Saved Itineraries</h3>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  className="flex items-center justify-between w-full p-4 text-left bg-teal-500 text-white"
                  onClick={() => setExpandedTrip(expandedTrip === 'trip-1' ? null : 'trip-1')}
                >
                  <div className="flex items-center">
                    <MapPin size={18} className="mr-2" />
                    <span className="font-medium">Barcelona Getaway</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm mr-2">June 19-22, 2024</span>
                    <ChevronDown
                      size={18}
                      className={`transform transition-transform ${
                        expandedTrip === 'trip-1' ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>
                
                {expandedTrip === 'trip-1' && (
                  <div className="p-4 space-y-4 animate-fade-in">
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center text-sm">
                        <Calendar size={16} className="text-teal-600 mr-1" />
                        <span>3 days</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <DollarSign size={16} className="text-coral-600 mr-1" />
                        <span>$850 total</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700">Highlights</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center text-sm">
                          <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center mr-2">
                            <span className="text-teal-700 text-xs">1</span>
                          </div>
                          <span>Sagrada Familia Tour</span>
                        </li>
                        <li className="flex items-center text-sm">
                          <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center mr-2">
                            <span className="text-teal-700 text-xs">2</span>
                          </div>
                          <span>La Boqueria Market</span>
                        </li>
                        <li className="flex items-center text-sm">
                          <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center mr-2">
                            <span className="text-teal-700 text-xs">3</span>
                          </div>
                          <span>Park Güell</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button variant="outline" size="sm" className="flex-1">View Full Itinerary</Button>
                      <Button variant="outline" size="sm" className="flex-1">Re-plan Trip</Button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  className="flex items-center justify-between w-full p-4 text-left bg-teal-500 text-white"
                  onClick={() => setExpandedTrip(expandedTrip === 'trip-2' ? null : 'trip-2')}
                >
                  <div className="flex items-center">
                    <MapPin size={18} className="mr-2" />
                    <span className="font-medium">Tokyo Adventure</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm mr-2">March 5-12, 2024</span>
                    <ChevronDown
                      size={18}
                      className={`transform transition-transform ${
                        expandedTrip === 'trip-2' ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>
                
                {expandedTrip === 'trip-2' && (
                  <div className="p-4 space-y-4 animate-fade-in">
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center text-sm">
                        <Calendar size={16} className="text-teal-600 mr-1" />
                        <span>7 days</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <DollarSign size={16} className="text-coral-600 mr-1" />
                        <span>$2,200 total</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700">Highlights</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center text-sm">
                          <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center mr-2">
                            <span className="text-teal-700 text-xs">1</span>
                          </div>
                          <span>Shibuya Crossing</span>
                        </li>
                        <li className="flex items-center text-sm">
                          <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center mr-2">
                            <span className="text-teal-700 text-xs">2</span>
                          </div>
                          <span>Meiji Shrine</span>
                        </li>
                        <li className="flex items-center text-sm">
                          <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center mr-2">
                            <span className="text-teal-700 text-xs">3</span>
                          </div>
                          <span>Tokyo Skytree</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button variant="outline" size="sm" className="flex-1">View Full Itinerary</Button>
                      <Button variant="outline" size="sm" className="flex-1">Re-plan Trip</Button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  className="flex items-center justify-between w-full p-4 text-left bg-coral-500 text-white"
                  onClick={() => setExpandedTrip(expandedTrip === 'trip-3' ? null : 'trip-3')}
                >
                  <div className="flex items-center">
                    <MapPin size={18} className="mr-2" />
                    <span className="font-medium">New York City (Upcoming)</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm mr-2">August 10-15, 2024</span>
                    <ChevronDown
                      size={18}
                      className={`transform transition-transform ${
                        expandedTrip === 'trip-3' ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>
                
                {expandedTrip === 'trip-3' && (
                  <div className="p-4 space-y-4 animate-fade-in">
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center text-sm">
                        <Calendar size={16} className="text-teal-600 mr-1" />
                        <span>5 days</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <DollarSign size={16} className="text-coral-600 mr-1" />
                        <span>$1,800 budget</span>
                      </div>
                    </div>
                    
                    <div className="py-3 px-4 bg-coral-50 border border-coral-100 rounded-lg text-coral-700 text-sm">
                      This is an upcoming trip. Your itinerary is ready to view.
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button variant="outline" size="sm" className="flex-1">View Itinerary</Button>
                      <Button variant="outline" size="sm" className="flex-1">Modify Plans</Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Account Management */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-bold mb-4">Account Management</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link to="/settings">
                  <Button variant="outline" className="w-full justify-center">
                    Change Password
                  </Button>
                </Link>
                
                <Link to="/settings">
                  <Button variant="outline" className="w-full justify-center">
                    Manage Linked Accounts
                  </Button>
                </Link>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
                  Delete Account
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  This will permanently delete your account and all associated data. This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
