import { useState, useEffect, useRef } from 'react';

interface MapboxFeature {
  id: string;
  place_name: string;
  center: [number, number];
  // Add other properties as needed
}

// Use the same token from your SkiMap component
const MAPBOX_TOKEN = 'pk.eyJ1Ijoiam9hcXVpbmdmMjEiLCJhIjoiY2x1dnZ1ZGFrMDduZTJrbWp6bHExbzNsYiJ9.ZOEuIV9R0ks2I5bYq40HZQ';

export const useMapboxGeocoding = (initialValue = '') => {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<MapboxFeature[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const searchLocation = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?` +
        `access_token=${MAPBOX_TOKEN}&` +
        'types=place,postcode,address&' +
        'limit=5&' +
        'country=us'  // Limit to US locations
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch suggestions: ${response.statusText}`);
      }

      const data = await response.json();
      setSuggestions(data.features || []);
    } catch (err) {
      console.error('Geocoding error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching suggestions');
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      searchLocation(query);
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query]);

  return { 
    query, 
    setQuery, 
    suggestions, 
    loading, 
    error 
  };
};