import { useEffect, useState } from 'react';
import Map, { Marker } from 'react-map-gl';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { SkiResort } from '../types';
import { MapPin, X } from 'lucide-react';
import ResortPopup from './ResortPopup';
import PriceFilter from './filters/PriceFilter';
import DifficultyFilter from './filters/DifficultyFilter';
import RegionFilter from './filters/RegionFilter';
import DistanceFilter from './filters/DistanceFilter';
import AmenitiesFilter from './filters/AmenitiesFilter';
import CityFilter from './filters/CityFilter';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoiam9hcXVpbmdmMjEiLCJhIjoiY2x1dnZ1ZGFrMDduZTJrbWp6bHExbzNsYiJ9.ZOEuIV9R0ks2I5bYq40HZQ';

type FilterType = 'price' | 'difficulty' | 'region' | 'distance' | 'amenities' | 'city' | null;

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
        return <PriceFilter priceRange={priceRange} setPriceRange={setPriceRange} />;
      case 'difficulty':
        return <DifficultyFilter selectedDifficulties={selectedDifficulties} setSelectedDifficulties={setSelectedDifficulties} />;
      case 'region':
        return (
          <RegionFilter 
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
            selectedStates={selectedStates}
            setSelectedStates={setSelectedStates}
          />
        );
      case 'distance':
        return (
          <DistanceFilter
            location={location}
            setLocation={setLocation}
            maxDistance={maxDistance}
            setMaxDistance={setMaxDistance}
          />
        );
      case 'amenities':
        return <AmenitiesFilter selectedAmenities={selectedAmenities} setSelectedAmenities={setSelectedAmenities} />;
      case 'city':
        return <CityFilter selectedCitySize={selectedCitySize} setSelectedCitySize={setSelectedCitySize} />;
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