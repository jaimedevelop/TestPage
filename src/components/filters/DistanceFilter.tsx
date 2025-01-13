import React, { useEffect, useState, useRef } from 'react';
import { useMapboxGeocoding } from '../hooks/useMapboxGeocoding';

interface DistanceFilterProps {
  location: string;
  setLocation: (location: string) => void;
  maxDistance: number;
  setMaxDistance: (distance: number) => void;
  setSelectedCoordinates: (coords: [number, number] | null) => void;
}

export default function DistanceFilter({
  location,
  setLocation,
  maxDistance,
  setMaxDistance,
  setSelectedCoordinates
}: DistanceFilterProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { query, setQuery, suggestions, loading, error } = useMapboxGeocoding(location);
  const suggestionRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionClick = (suggestion: any) => {
    setLocation(suggestion.place_name);
    setQuery(suggestion.place_name);
    setSelectedCoordinates(suggestion.center);
    setShowSuggestions(false);
  };

  return (
    <div className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">Distance Filter</h3>
      <div className="relative" ref={suggestionRef}>
        <label className="block text-sm font-medium text-gray-700">Your Location</label>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
            if (!e.target.value) {
              setSelectedCoordinates(null);
            }
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Enter city or zip code"
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        
        {/* Loading indicator */}
        {loading && (
          <div className="absolute right-2 top-9">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <p className="mt-1 text-sm text-red-600">
            {error === 'Failed to fetch suggestions' 
              ? 'Unable to find locations. Please try again.' 
              : error}
          </p>
        )}

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-gray-600"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.place_name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Maximum Distance: {maxDistance} miles
        </label>
        <input
          type="range"
          min="0"
          max="500"
          value={maxDistance}
          onChange={(e) => setMaxDistance(Number(e.target.value))}
          className="w-full mt-2"
        />
      </div>
    </div>
  );
}