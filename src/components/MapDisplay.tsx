
import React from 'react';
import { MapPin, Download } from 'lucide-react';

const MapDisplay = () => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm">
      <div className="relative h-48 bg-gray-200">
        {/* In a real app, this would be replaced with a Google Maps or Mapbox component */}
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="/lovable-uploads/503a0016-f16c-4736-af51-831bea9ce870.png" 
            alt="Map of Barcelona" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Location marker */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <MapPin size={36} className="text-coral-500 drop-shadow-md" />
            <div className="absolute inset-0 animate-ping rounded-full bg-coral-500 opacity-75" style={{ width: '10px', height: '10px', top: '8px', left: '13px' }}></div>
          </div>
        </div>
        
        {/* Location label */}
        <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-3 py-1 rounded-full shadow-sm">
          <span className="font-medium">Barcelona</span>
        </div>
      </div>
      
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-teal-100 text-teal-600">
            <MapPin size={20} />
          </div>
          <div>
            <h3 className="font-medium">Google Maps</h3>
            <p className="text-xs text-gray-500">View attractions</p>
          </div>
        </div>
        
        <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Download size={16} />
          <span>Download PDF</span>
        </button>
      </div>
    </div>
  );
};

export default MapDisplay;
