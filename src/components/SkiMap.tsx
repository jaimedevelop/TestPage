import { useEffect, useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { SkiResort } from '../types';
import { MapPin, X } from 'lucide-react';
import ResortPopup from './ResortPopup';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoiam9hcXVpbmdmMjEiLCJhIjoiY2x1dnZ1ZGFrMDduZTJrbWp6bHExbzNsYiJ9.ZOEuIV9R0ks2I5bYq40HZQ';

type FilterType = 'price' | 'difficulty' | 'region' | 'distance' | 'amenities' | 'city' | null;

const DIFFICULTIES = ['Green', 'Blue', 'Double Blue', 'Black', 'Double Black'];
const REGIONS = {
  East: ['Maine', 'Vermont', 'New Hampshire', 'New York', 'Pennsylvania'],
  West: ['California', 'Oregon', 'Washington'],
  Central: ['Michigan', 'Wisconsin', 'Minnesota'],
  Rocky: ['Colorado', 'Utah', 'Wyoming', 'Montana', 'Idaho']
};
const CITY_SIZES = ['Small', 'Medium', 'Large'];
const AMENITIES = ['Night Skiing', 'Terrain Park', 'Backcountry Access', 'Snow Tubing', 'Ice Skating'];

export default function SkiMap() {
  const [resorts, setResorts] = useState<SkiResort[]>([]);
  const [selectedResort, setSelectedResort] = useState<SkiResort | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);
  
  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [location, setLocation] = useState<string>('');
  const [maxDistance, setMaxDistance] = useState<number>(100);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedCitySize, setSelectedCitySize] = useState<string>('');

  useEffect(() => {
    const resortsRef = ref(database, 'resorts');
    onValue(resortsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setResorts(Object.values(data));
      }
    });
  }, []);

  const renderFilterPanel = () => {
    switch (activeFilter) {
      case 'price':
        return (
          <div className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Price Range</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Minimum Price: ${priceRange[0]}</label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Maximum Price: ${priceRange[1]}</label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        );
      
      case 'difficulty':
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Difficulty Levels</h3>
            <div className="space-y-2">
              {DIFFICULTIES.map((difficulty) => (
                <label key={difficulty} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedDifficulties.includes(difficulty)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedDifficulties([...selectedDifficulties, difficulty]);
                      } else {
                        setSelectedDifficulties(selectedDifficulties.filter(d => d !== difficulty));
                      }
                    }}
                    className="rounded"
                  />
                  <span>{difficulty}</span>
                </label>
              ))}
            </div>
          </div>
        );
      
      case 'region':
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Region Selection</h3>
            <select
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                setSelectedStates([]);
              }}
              className="w-full p-2 mb-4 border rounded"
            >
              <option value="">Select Region</option>
              {Object.keys(REGIONS).map((region) => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
            
            {selectedRegion && (
              <div className="space-y-2">
                <h4 className="font-medium mb-2">States</h4>
                {REGIONS[selectedRegion as keyof typeof REGIONS].map((state) => (
                  <label key={state} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedStates.includes(state)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStates([...selectedStates, state]);
                        } else {
                          setSelectedStates(selectedStates.filter(s => s !== state));
                        }
                      }}
                      className="rounded"
                    />
                    <span>{state}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'distance':
        return (
          <div className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Distance Filter</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Your Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter city or zip code"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Maximum Distance: {maxDistance} miles</label>
              <input
                type="range"
                min="0"
                max="500"
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        );
      
      case 'amenities':
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Amenities</h3>
            <div className="space-y-2">
              {AMENITIES.map((amenity) => (
                <label key={amenity} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAmenities([...selectedAmenities, amenity]);
                      } else {
                        setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
                      }
                    }}
                    className="rounded"
                  />
                  <span>{amenity}</span>
                </label>
              ))}
            </div>
          </div>
        );
      
      case 'city':
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">City Size</h3>
            <div className="space-y-2">
              {CITY_SIZES.map((size) => (
                <label key={size} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="citySize"
                    value={size}
                    checked={selectedCitySize === size}
                    onChange={(e) => setSelectedCitySize(e.target.value)}
                    className="rounded"
                  />
                  <span>{size}</span>
                </label>
              ))}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full h-screen">
      <div className="absolute top-4 left-0 right-0 z-10 mx-4">
        <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar max-w-full">
          <button 
            onClick={() => setActiveFilter('price')}
            className={`px-4 py-1 bg-white hover:bg-gray-100 text-gray-800 rounded-full shadow transition-colors flex items-center gap-1 shrink-0 ${activeFilter === 'price' ? 'ring-2 ring-blue-500' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M7 15h2c0 1.08 1.37 2 3 2s3-.92 3-2c0-1.1-1.04-1.5-3.24-2.03C9.64 12.44 7 11.78 7 9c0-1.79 1.47-3.31 3.5-3.82V3h3v2.18C15.53 5.69 17 7.21 17 9h-2c0-1.08-1.37-2-3-2s-3 .92-3 2c0 1.1 1.04 1.5 3.24 2.03C14.36 11.56 17 12.22 17 15c0 1.79-1.47 3.31-3.5 3.82V21h-3v-2.18C8.47 18.31 7 16.79 7 15" />
            </svg>
            Price
          </button>
          <button 
            onClick={() => setActiveFilter('difficulty')}
            className={`px-4 py-1 bg-white hover:bg-gray-100 text-gray-800 rounded-full shadow transition-colors flex items-center gap-1 ${activeFilter === 'difficulty' ? 'ring-2 ring-blue-500' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M1 21L12 2l11 19zm3.45-2h15.1L12 6zM12 18q.425 0 .713-.288T13 17t-.288-.712T12 16t-.712.288T11 17t.288.713T12 18m-1-3h2v-5h-2zm1-2.5"/>
            </svg>
            Difficulty
          </button>
          <button 
            onClick={() => setActiveFilter('region')}
            className={`px-4 py-1 bg-white hover:bg-gray-100 text-gray-800 rounded-full shadow transition-colors flex items-center gap-1 ${activeFilter === 'region' ? 'ring-2 ring-blue-500' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="m15 21l-6-2.1l-6 2.325V5.05L9 3l6 2.1l6-2.325V18.95zm-1-2.45V6.85l-4-1.4v11.7zm2 0l3-1V5.7l-3 1.15zM5 18.3l3-1.15V5.45l-3 1zM16 6.85v11.7zm-8-1.4v11.7z"/>
            </svg>
            Region
          </button>
          <button 
            onClick={() => setActiveFilter('distance')}
            className={`px-4 py-1 bg-white hover:bg-gray-100 text-gray-800 rounded-full shadow transition-colors flex items-center gap-1 ${activeFilter === 'distance' ? 'ring-2 ring-blue-500' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="m6.343 14.728l-2.828 2.829l3.535 3.535L20.485 7.657L16.95 4.121l-2.121 2.122l1.414 1.414l-1.414 1.414l-1.415-1.414l-2.121 2.121l2.121 2.122L12 13.314l-2.12-2.121l-2.122 2.12l1.415 1.415l-1.415 1.414z"/>
            </svg>
            Distance
          </button>
          <button 
            onClick={() => setActiveFilter('amenities')}
            className={`px-4 py-1 bg-white hover:bg-gray-100 text-gray-800 rounded-full shadow transition-colors flex items-center gap-1 ${activeFilter === 'amenities' ? 'ring-2 ring-blue-500' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" stroke="currentColor" d="M7.5 11.5v3M6 13h3m3-4.653c2.005 0 3.7-1.888 5.786-1.212c2.264.733 3.82 3.413 3.708 9.492c-.022 1.224-.336 2.578-1.546 3.106c-2.797 1.221-4.397-2.328-7-2.328h-1.897c-2.605 0-4.213 3.545-6.998 2.328c-1.21-.528-1.525-1.882-1.547-3.107c-.113-6.078 1.444-8.758 3.708-9.491C8.299 6.459 9.994 8.347 12 8.347m0-4.565v4.342M14.874 13h3"/>
            </svg>
            Amenities
          </button>
          <button 
            onClick={() => setActiveFilter('city')}
            className={`px-4 py-1 bg-white hover:bg-gray-100 text-gray-800 rounded-full shadow transition-colors flex items-center gap-1 ${activeFilter === 'city' ? 'ring-2 ring-blue-500' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <g fill="none">
                <path fill="currentColor" d="M3.75 18a.75.75 0 0 0-1.5 0zm-1.5-4a.75.75 0 0 0 1.5 0zM7 8.75c.964 0 1.612.002 2.095.067c.461.062.659.169.789.3l1.06-1.062c-.455-.455-1.022-.64-1.65-.725c-.606-.082-1.372-.08-2.294-.08zM11.75 12c0-.922.002-1.688-.08-2.294c-.084-.628-.27-1.195-.726-1.65l-1.06 1.06c.13.13.237.328.3.79c.064.482.066 1.13.066 2.094zM7 7.25c-.922 0-1.688-.002-2.294.08c-.628.084-1.195.27-1.65.725l1.06 1.061c.13-.13.328-.237.79-.3c.482-.064 1.13-.066 2.094-.066zM3.75 12c0-.964.002-1.612.067-2.095c.062-.461.169-.659.3-.789l-1.062-1.06c-.455.455-.64 1.022-.725 1.65c-.082.606-.08 1.372-.08 2.294zm0 10v-4h-1.5v4zm0-8v-2h-1.5v2z"/>
                <path stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="M7 22v-6c0-1.886 0-2.828.586-3.414S9.114 12 11 12h2c1.886 0 2.828 0 3.414.586c.472.471.564 1.174.582 2.414M17 22v-2.75m4-11.478c0-1.34 0-2.011-.356-2.525s-.984-.75-2.24-1.22c-2.455-.921-3.682-1.381-4.543-.785C13 3.84 13 5.15 13 7.772V12m8 10V12M4 8V6.5c0-.943 0-1.414.293-1.707S5.057 4.5 6 4.5h2c.943 0 1.414 0 1.707.293S10 5.557 10 6.5V8M7 4V2m15 20H2m8-7h.5m3.5 0h-1.5M10 18h4"/>
              </g>
            </svg>
            City
          </button>
        </div>
      </div>
      
      {/* Filter Panel */}
      <div className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-lg transform transition-transform duration-300 ease-in-out z-20 ${activeFilter ? 'translate-y-0' : 'translate-y-full'}`} style={{ height: '60vh' }}>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">
            {activeFilter ? activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1) : ''} Filter
          </h2>
          <button onClick={() => setActiveFilter(null)} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(60vh - 4rem)' }}>
          {renderFilterPanel()}
        </div>
      </div>
      
      <Map
        initialViewState={{
          longitude: -100,
          latitude: 40,
          zoom: 3.5
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        {resorts.map((resort, index) => (
          resort.latitude && resort.longitude ? (
            <Marker
              key={index}
              latitude={Number(resort.latitude)}
              longitude={Number(resort.longitude)}
              onClick={e => {
                e.originalEvent.stopPropagation();
                setSelectedResort(resort);
              }}
            >
              <MapPin className="text-blue-600 hover:text-blue-800 cursor-pointer" />
            </Marker>
          ) : null
        ))}
        
        {selectedResort && (
          <ResortPopup 
            resort={selectedResort}
            onClose={() => setSelectedResort(null)}
          />
        )}
      </Map>
    </div>
  );
}