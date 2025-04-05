import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronRight, Eye, EyeOff, Facebook, Mail, Lock, Twitter, Instagram } from 'lucide-react';
import Footer from '@/components/Footer';
import '../App.css'; // Explicitly import the CSS file

const Chat = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  const handleGuestAccess = () => {
    navigate('/');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 bg-cover bg-center z-0 hero-background"></div>
        
        {/* Content */}
        <div className="container mx-auto px-4 py-12 z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Column - Tagline */}
          <div className="w-full lg:w-1/2 text-white space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              JourneyGenie
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-lg">
              Your AI-powered compass to extraordinary adventures. Let magic guide your travels.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg" 
                className="bg-teal-500 hover:bg-teal-600 text-white transition-all duration-300 transform hover:scale-105"
                onClick={() => setActiveTab("signup")}
              >
                Get Started <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="lg" 
                className="text-white hover:bg-white/20 border border-white/30"
                onClick={handleGuestAccess}
              >
                Explore as Guest
              </Button>
            </div>
          </div>
          
          {/* Right Column - Login/Signup Card */}
          <div className="w-full lg:w-5/12 animate-fade-in">
            <Card className="w-full bg-white/95 backdrop-blur-sm shadow-xl rounded-xl">
              <CardContent className="p-0">
                <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="w-full rounded-t-xl grid grid-cols-2">
                    <TabsTrigger value="login" className="rounded-tl-xl py-4">Login</TabsTrigger>
                    <TabsTrigger value="signup" className="rounded-tr-xl py-4">Sign Up</TabsTrigger>
                  </TabsList>
                  
                  {/* Login Tab */}
                  <TabsContent value="login" className="px-6 py-8 space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder="your.email@example.com" 
                            className="pl-10 border-teal-500 focus:ring-teal-500"
                          />
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="password">Password</Label>
                          <a href="#" className="text-xs text-teal-600 hover:underline">
                            Forgot Password?
                          </a>
                        </div>
                        <div className="relative">
                          <Input 
                            id="password" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            className="pl-10 border-teal-500 focus:ring-teal-500"
                          />
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <Button className="w-full bg-coral-500 hover:bg-coral-600 text-white">
                      Login
                    </Button>
                    
                    <div className="relative flex items-center justify-center">
                      <div className="border-t border-gray-300 absolute w-full"></div>
                      <span className="bg-white px-2 text-xs text-gray-500 relative">OR CONTINUE WITH</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                        Google
                      </Button>
                      <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                        <Facebook className="w-5 h-5 mr-2 text-blue-600" />
                        Facebook
                      </Button>
                    </div>
                    
                    <div className="text-center text-sm text-gray-500">
                      Don't have an account?{" "}
                      <button 
                        onClick={() => setActiveTab("signup")}
                        className="text-teal-600 hover:underline"
                      >
                        Sign up!
                      </button>
                    </div>
                  </TabsContent>
                  
                  {/* Sign Up Tab */}
                  <TabsContent value="signup" className="px-6 py-8 space-y-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstname">First Name</Label>
                          <Input id="firstname" placeholder="John" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastname">Last Name</Label>
                          <Input id="lastname" placeholder="Doe" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <div className="relative">
                          <Input 
                            id="signup-email" 
                            type="email" 
                            placeholder="your.email@example.com" 
                            className="pl-10 border-teal-500 focus:ring-teal-500"
                          />
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <div className="relative">
                          <Input 
                            id="signup-password" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            className="pl-10 border-teal-500 focus:ring-teal-500"
                          />
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <Button className="w-full bg-coral-500 hover:bg-coral-600 text-white">
                      Create Account
                    </Button>
                    
                    <div className="relative flex items-center justify-center">
                      <div className="border-t border-gray-300 absolute w-full"></div>
                      <span className="bg-white px-2 text-xs text-gray-500 relative">OR SIGN UP WITH</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                        Google
                      </Button>
                      <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                        <Facebook className="w-5 h-5 mr-2 text-blue-600" />
                        Facebook
                      </Button>
                    </div>
                    
                    <div className="text-center text-sm text-gray-500">
                      Already have an account?{" "}
                      <button 
                        onClick={() => setActiveTab("login")}
                        className="text-teal-600 hover:underline"
                      >
                        Login
                      </button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Chat;