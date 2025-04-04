
import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Lock, 
  Bell, 
  Shield, 
  Palette, 
  Menu, 
  X, 
  ChevronRight 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const Settings = () => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Form states
  const [language, setLanguage] = useState('english');
  const [currency, setCurrency] = useState('usd');
  const [darkMode, setDarkMode] = useState(false);
  
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(true);
  const [facebookConnected, setFacebookConnected] = useState(false);
  
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [tripUpdates, setTripUpdates] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  
  const [locationAccess, setLocationAccess] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSaveChanges = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully",
    });
  };
  
  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast({
        title: "Account scheduled for deletion",
        description: "Your account will be deleted within 30 days",
        variant: "destructive",
      });
    }
  };

  const categories = [
    { id: 'general', name: 'General Settings', icon: SettingsIcon },
    { id: 'account', name: 'Account & Security', icon: Lock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy & Data', icon: Shield },
    { id: 'appearance', name: 'Appearance', icon: Palette }
  ];

  return (
    <div className="min-h-screen bg-ivory">
      {/* Mobile toggle button */}
      <button 
        onClick={toggleSidebar} 
        className="fixed z-50 top-4 left-4 p-2 rounded-full bg-teal-500 text-white md:hidden"
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className="flex">
        {/* Sidebar */}
        <aside 
          className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0`}
        >
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-teal-500 flex items-center">
              <SettingsIcon className="mr-2" />
              Settings
            </h1>
          </div>

          <nav className="p-4">
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <button 
                    onClick={() => {
                      setActiveCategory(category.id);
                      if (window.innerWidth < 768) setSidebarOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-lg flex items-center transition-colors ${
                      activeCategory === category.id 
                        ? 'bg-teal-500 text-white' 
                        : 'hover:bg-gray-100'
                    }`}
                    aria-current={activeCategory === category.id ? 'page' : undefined}
                  >
                    <category.icon size={20} className="mr-3" />
                    <span>{category.name}</span>
                    <ChevronRight size={16} className="ml-auto" />
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" 
            onClick={toggleSidebar}
          />
        )}

        {/* Main content */}
        <main className="flex-1 p-6 md:p-8 md:ml-64">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-6 md:p-8">
            {/* General Settings */}
            {activeCategory === 'general' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">General Settings</h2>
                
                <div className="space-y-6">
                  <div className="grid gap-4">
                    <Label htmlFor="language">Preferred Language</Label>
                    <Select value={language} onValueChange={setLanguage} aria-label="Select language">
                      <SelectTrigger id="language" className="w-full md:w-72">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="german">German</SelectItem>
                        <SelectItem value="japanese">Japanese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-4">
                    <Label htmlFor="currency">Default Currency</Label>
                    <Select value={currency} onValueChange={setCurrency} aria-label="Select currency">
                      <SelectTrigger id="currency" className="w-full md:w-72">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD ($)</SelectItem>
                        <SelectItem value="eur">EUR (€)</SelectItem>
                        <SelectItem value="gbp">GBP (£)</SelectItem>
                        <SelectItem value="jpy">JPY (¥)</SelectItem>
                        <SelectItem value="cad">CAD ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                      <p className="text-sm text-gray-500">Enable dark theme for the application</p>
                    </div>
                    <Switch 
                      id="dark-mode"
                      checked={darkMode} 
                      onCheckedChange={setDarkMode}
                      aria-label="Toggle dark mode"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Account & Security */}
            {activeCategory === 'account' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Account & Security</h2>
                
                <div className="space-y-6">
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email"
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className="w-full md:w-72"
                      aria-label="Email address"
                    />
                  </div>
                  
                  <div className="grid gap-3">
                    <Label htmlFor="password">Change Password</Label>
                    <Input 
                      id="password"
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      placeholder="New password" 
                      className="w-full md:w-72"
                      aria-label="New password"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-500">Add an extra layer of security</p>
                    </div>
                    <Switch 
                      id="two-factor"
                      checked={twoFactorEnabled} 
                      onCheckedChange={setTwoFactorEnabled}
                      aria-label="Enable two-factor authentication"
                    />
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-4">Connected Accounts</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                            <span className="text-red-500 font-bold">G</span>
                          </div>
                          <div>
                            <p className="font-medium">Google</p>
                            <p className="text-sm text-gray-500">{googleConnected ? 'Connected' : 'Not connected'}</p>
                          </div>
                        </div>
                        <Button 
                          variant={googleConnected ? "outline" : "default"}
                          onClick={() => setGoogleConnected(!googleConnected)}
                          aria-label={googleConnected ? "Disconnect Google account" : "Connect Google account"}
                        >
                          {googleConnected ? 'Disconnect' : 'Connect'}
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <span className="text-blue-500 font-bold">F</span>
                          </div>
                          <div>
                            <p className="font-medium">Facebook</p>
                            <p className="text-sm text-gray-500">{facebookConnected ? 'Connected' : 'Not connected'}</p>
                          </div>
                        </div>
                        <Button 
                          variant={facebookConnected ? "outline" : "default"}
                          onClick={() => setFacebookConnected(!facebookConnected)}
                          aria-label={facebookConnected ? "Disconnect Facebook account" : "Connect Facebook account"}
                        >
                          {facebookConnected ? 'Disconnect' : 'Connect'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Notifications */}
            {activeCategory === 'notifications' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Notifications</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-gray-500">Receive updates via email</p>
                    </div>
                    <Switch 
                      id="email-notifications"
                      checked={emailNotifications} 
                      onCheckedChange={setEmailNotifications}
                      aria-label="Toggle email notifications"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-gray-500">Receive notifications on your device</p>
                    </div>
                    <Switch 
                      id="push-notifications"
                      checked={pushNotifications} 
                      onCheckedChange={setPushNotifications}
                      aria-label="Toggle push notifications"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="trip-updates">Trip Updates</Label>
                      <p className="text-sm text-gray-500">Get notified about changes to your trips</p>
                    </div>
                    <Switch 
                      id="trip-updates"
                      checked={tripUpdates} 
                      onCheckedChange={setTripUpdates}
                      aria-label="Toggle trip update notifications"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="budget-alerts">Budget Alerts</Label>
                      <p className="text-sm text-gray-500">Get notified when approaching budget limits</p>
                    </div>
                    <Switch 
                      id="budget-alerts"
                      checked={budgetAlerts} 
                      onCheckedChange={setBudgetAlerts}
                      aria-label="Toggle budget alert notifications"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Privacy & Data */}
            {activeCategory === 'privacy' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Privacy & Data</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="location-access">Location Access</Label>
                      <p className="text-sm text-gray-500">Allow the app to access your location</p>
                    </div>
                    <Switch 
                      id="location-access"
                      checked={locationAccess} 
                      onCheckedChange={setLocationAccess}
                      aria-label="Toggle location access"
                    />
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      variant="outline" 
                      className="w-full md:w-auto"
                      aria-label="Download your data"
                    >
                      Download My Data
                    </Button>
                    <p className="text-sm text-gray-500 mt-2">Download all your personal data in a JSON format</p>
                  </div>
                  
                  <div className="pt-6 mt-6 border-t border-red-100">
                    <h3 className="text-lg font-medium text-red-600 mb-2">Danger Zone</h3>
                    <p className="text-sm text-gray-500 mb-4">Permanently delete your account and all of your data</p>
                    <Button 
                      variant="destructive" 
                      onClick={handleDeleteAccount}
                      aria-label="Delete your account"
                    >
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Appearance */}
            {activeCategory === 'appearance' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Appearance</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="theme-toggle">Theme</Label>
                      <p className="text-sm text-gray-500">Choose between light and dark theme</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm ${!darkMode ? 'font-medium' : ''}`}>Light</span>
                      <Switch 
                        id="theme-toggle"
                        checked={darkMode} 
                        onCheckedChange={setDarkMode}
                        aria-label="Toggle between light and dark theme"
                      />
                      <span className={`text-sm ${darkMode ? 'font-medium' : ''}`}>Dark</span>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="text-lg font-medium mb-4">Color Accents</h3>
                    <div className="grid grid-cols-5 gap-4">
                      {['#2E8B8A', '#FF6F61', '#6B5B95', '#88B04B', '#F7CAC9'].map((color) => (
                        <button
                          key={color}
                          className={`w-10 h-10 rounded-full hover:ring-2 hover:ring-offset-2 ${
                            color === '#2E8B8A' ? 'ring-2 ring-teal-500 ring-offset-2' : ''
                          }`}
                          style={{ backgroundColor: color }}
                          aria-label={`Select ${color} accent color`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save button */}
            <div className="mt-8 pt-6 border-t flex justify-end">
              <Button onClick={handleSaveChanges}>
                Save Changes
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
