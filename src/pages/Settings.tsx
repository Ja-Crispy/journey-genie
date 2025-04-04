
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, 
  Globe, 
  Lock, 
  Bell, 
  Shield, 
  Palette, 
  DollarSign, 
  LogOut, 
  ChevronLeft,
  Sun,
  Moon,
  Download,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SettingsSectionType = 'general' | 'account' | 'notifications' | 'privacy' | 'appearance';

const Settings = () => {
  const [activeSection, setActiveSection] = useState<SettingsSectionType>('general');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  
  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex items-center">
          <Link to="/" className="flex items-center text-teal-600 hover:text-teal-700">
            <ChevronLeft className="mr-2" size={20} />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl font-bold text-center flex-1">Settings</h1>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
      </header>
      
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar for navigation (collapsible on mobile) */}
        <aside
          className={`bg-white border-r border-gray-200 transition-all duration-300 ${
            sidebarOpen ? 'w-full md:w-64' : 'w-0 md:w-16 overflow-hidden'
          }`}
        >
          <div className="p-4 md:p-6">
            <button 
              className="md:hidden w-full flex items-center justify-between p-2 mb-4 text-gray-600 hover:text-teal-600"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <span>Menu</span>
              <ChevronRight
                className={`transition-transform duration-200 ${sidebarOpen ? 'rotate-90' : ''}`}
                size={18}
              />
            </button>
            
            <nav className="space-y-1">
              <button
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                  activeSection === 'general'
                    ? 'bg-teal-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveSection('general')}
              >
                <Globe size={18} className="mr-3" />
                <span className={`${!sidebarOpen ? 'md:hidden' : ''}`}>General Settings</span>
              </button>
              
              <button
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                  activeSection === 'account'
                    ? 'bg-teal-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveSection('account')}
              >
                <Lock size={18} className="mr-3" />
                <span className={`${!sidebarOpen ? 'md:hidden' : ''}`}>Account & Security</span>
              </button>
              
              <button
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                  activeSection === 'notifications'
                    ? 'bg-teal-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveSection('notifications')}
              >
                <Bell size={18} className="mr-3" />
                <span className={`${!sidebarOpen ? 'md:hidden' : ''}`}>Notifications</span>
              </button>
              
              <button
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                  activeSection === 'privacy'
                    ? 'bg-teal-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveSection('privacy')}
              >
                <Shield size={18} className="mr-3" />
                <span className={`${!sidebarOpen ? 'md:hidden' : ''}`}>Privacy & Data</span>
              </button>
              
              <button
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                  activeSection === 'appearance'
                    ? 'bg-teal-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveSection('appearance')}
              >
                <Palette size={18} className="mr-3" />
                <span className={`${!sidebarOpen ? 'md:hidden' : ''}`}>Appearance</span>
              </button>
              
              <div className="pt-6 mt-6 border-t border-gray-200">
                <button
                  className="w-full flex items-center p-3 rounded-lg text-coral-500 hover:bg-coral-50 transition-colors"
                >
                  <LogOut size={18} className="mr-3" />
                  <span className={`${!sidebarOpen ? 'md:hidden' : ''}`}>Sign Out</span>
                </button>
              </div>
            </nav>
          </div>
        </aside>
        
        {/* Mobile toggle for sidebar */}
        <button 
          className="hidden md:block fixed bottom-4 left-4 z-10 bg-white p-2 rounded-full shadow-lg border border-gray-200"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <ChevronRight
            className={`transition-transform duration-200 ${!sidebarOpen ? 'rotate-180' : ''}`}
            size={18}
          />
        </button>
        
        {/* Main content */}
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            {/* General Settings */}
            {activeSection === 'general' && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-6">General Settings</h2>
                
                <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Preferred Language</label>
                      <Select defaultValue="en-US">
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en-US">English (US)</SelectItem>
                          <SelectItem value="en-GB">English (UK)</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                          <SelectItem value="jp">Japanese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Default Currency</label>
                      <Select defaultValue="usd">
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usd">USD ($)</SelectItem>
                          <SelectItem value="eur">EUR (€)</SelectItem>
                          <SelectItem value="gbp">GBP (£)</SelectItem>
                          <SelectItem value="jpy">JPY (¥)</SelectItem>
                          <SelectItem value="cad">CAD ($)</SelectItem>
                          <SelectItem value="aud">AUD ($)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Distance Unit</label>
                    <div className="flex space-x-4">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="imperial"
                          name="distance"
                          defaultChecked
                          className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                        />
                        <label htmlFor="imperial" className="ml-2 text-sm text-gray-700">
                          Miles (Imperial)
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="metric"
                          name="distance"
                          className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                        />
                        <label htmlFor="metric" className="ml-2 text-sm text-gray-700">
                          Kilometers (Metric)
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Default Home Airport</label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select your home airport" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jfk">New York (JFK)</SelectItem>
                        <SelectItem value="lax">Los Angeles (LAX)</SelectItem>
                        <SelectItem value="lhr">London (LHR)</SelectItem>
                        <SelectItem value="cdg">Paris (CDG)</SelectItem>
                        <SelectItem value="hnd">Tokyo (HND)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
            
            {/* Account & Security */}
            {activeSection === 'account' && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-6">Account & Security</h2>
                
                <div className="bg-white rounded-xl shadow-sm p-6 space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Account Information</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email Address</label>
                        <div className="flex">
                          <input 
                            type="email" 
                            className="flex-1 rounded-l-md border border-gray-300 p-2 focus:ring-teal-500 focus:border-teal-500" 
                            value="user@example.com" 
                            readOnly
                          />
                          <button className="bg-teal-500 text-white rounded-r-md px-4 hover:bg-teal-600">
                            Change
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-medium">Password</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Current Password</label>
                        <input 
                          type="password" 
                          className="w-full rounded-md border border-gray-300 p-2 focus:ring-teal-500 focus:border-teal-500" 
                        />
                      </div>
                      <div></div> {/* Spacer */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">New Password</label>
                        <input 
                          type="password" 
                          className="w-full rounded-md border border-gray-300 p-2 focus:ring-teal-500 focus:border-teal-500" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Confirm New Password</label>
                        <input 
                          type="password" 
                          className="w-full rounded-md border border-gray-300 p-2 focus:ring-teal-500 focus:border-teal-500" 
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button className="bg-teal-500 hover:bg-teal-600">
                        Update Password
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-700">Add an extra layer of security to your account</p>
                        <p className="text-sm text-gray-500 mt-1">We'll send a code to your phone when you sign in</p>
                      </div>
                      <Switch id="2fa" />
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-medium">Connected Accounts</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 flex items-center justify-center rounded-full">
                            <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h4 className="text-sm font-medium">Google</h4>
                            <p className="text-xs text-gray-500">Connected</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Disconnect</Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 flex items-center justify-center rounded-full">
                            <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h4 className="text-sm font-medium">Facebook</h4>
                            <p className="text-xs text-gray-500">Not connected</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Connect</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Notifications */}
            {activeSection === 'notifications' && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-6">Notifications</h2>
                
                <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Email Notifications</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Trip Updates</p>
                          <p className="text-sm text-gray-500">Receive updates about your upcoming trips</p>
                        </div>
                        <Switch id="email-trips" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Price Alerts</p>
                          <p className="text-sm text-gray-500">Get notified when prices drop for your saved destinations</p>
                        </div>
                        <Switch id="email-price" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Marketing</p>
                          <p className="text-sm text-gray-500">Receive promotions, surveys, and updates from us</p>
                        </div>
                        <Switch id="email-marketing" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-medium">Push Notifications</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Trip Reminders</p>
                          <p className="text-sm text-gray-500">Get reminded about upcoming trips and activities</p>
                        </div>
                        <Switch id="push-trips" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Budget Alerts</p>
                          <p className="text-sm text-gray-500">Be notified when you're approaching your budget limits</p>
                        </div>
                        <Switch id="push-budget" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Chat Messages</p>
                          <p className="text-sm text-gray-500">Get notified when there are new messages in your chat</p>
                        </div>
                        <Switch id="push-chat" defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Privacy & Data */}
            {activeSection === 'privacy' && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-6">Privacy & Data</h2>
                
                <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Location Settings</h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Location Access</p>
                        <p className="text-sm text-gray-500">Allow the app to access your location for better recommendations</p>
                      </div>
                      <Switch id="location-access" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Background Location</p>
                        <p className="text-sm text-gray-500">Allow location access when the app is closed</p>
                      </div>
                      <Switch id="background-location" />
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-medium">Data Collection</h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Analytics</p>
                        <p className="text-sm text-gray-500">Help improve our app by sharing anonymous usage data</p>
                      </div>
                      <Switch id="analytics" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Personalized Ads</p>
                        <p className="text-sm text-gray-500">Allow personalized advertisements based on your activity</p>
                      </div>
                      <Switch id="personalized-ads" />
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-medium">Your Data</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <Button variant="outline" className="flex items-center">
                        <Download size={16} className="mr-2" />
                        Download My Data
                      </Button>
                      
                      <Button variant="outline" className="flex items-center text-destructive hover:text-destructive">
                        <Trash2 size={16} className="mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Appearance */}
            {activeSection === 'appearance' && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-6">Appearance</h2>
                
                <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Theme</h3>
                    
                    <div className="flex space-x-4">
                      <button
                        className={`flex flex-col items-center space-y-2 p-4 rounded-lg border-2 transition-colors ${
                          !darkMode ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setDarkMode(false)}
                      >
                        <Sun size={24} className="text-teal-500" />
                        <span className="text-sm font-medium">Light Mode</span>
                      </button>
                      
                      <button
                        className={`flex flex-col items-center space-y-2 p-4 rounded-lg border-2 transition-colors ${
                          darkMode ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setDarkMode(true)}
                      >
                        <Moon size={24} className="text-teal-500" />
                        <span className="text-sm font-medium">Dark Mode</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-medium">Font Size</h3>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">A</span>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        defaultValue="3"
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-lg">A</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-medium">Accent Color</h3>
                    
                    <div className="grid grid-cols-6 gap-2">
                      <button className="w-8 h-8 rounded-full bg-teal-500 border-2 border-white shadow-sm hover:scale-110 transition-transform"></button>
                      <button className="w-8 h-8 rounded-full bg-coral-500 border-2 border-white shadow-sm hover:scale-110 transition-transform"></button>
                      <button className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white shadow-sm hover:scale-110 transition-transform"></button>
                      <button className="w-8 h-8 rounded-full bg-purple-500 border-2 border-white shadow-sm hover:scale-110 transition-transform"></button>
                      <button className="w-8 h-8 rounded-full bg-green-500 border-2 border-white shadow-sm hover:scale-110 transition-transform"></button>
                      <button className="w-8 h-8 rounded-full bg-amber-500 border-2 border-white shadow-sm hover:scale-110 transition-transform"></button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
