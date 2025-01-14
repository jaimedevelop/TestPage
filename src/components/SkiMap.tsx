import { useEffect, useState, useMemo, useRef } from 'react';
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
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import statesData from '../data/states.geojson?url';
import * as turf from '@turf/turf'; 

const MAPBOX_TOKEN = 'pk.eyJ1Ijoiam9hcXVpbmdmMjEiLCJhIjoiY2x1dnZ1ZGFrMDduZTJrbWp6bHExbzNsYiJ9.ZOEuIV9R0ks2I5bYq40HZQ';

type FilterType = 'price' | 'difficulty' | 'region' | 'distance' | 'amenities' | 'city' | null;

const REGION_COLORS = {
  East: '#4264fb',
  West: '#D7961F',
  Rocky: '#fb4242',
  Central: '#003E1F'
};

// Region boundaries and view settings
const REGION_COORDINATES = {
  East: { 
    center: [-78.5, 42],
    zoom: 4,
    bounds: {
      north: 47.5,
      south: 35,
      east: -67,
      west: -85
    }
  },
  West: { 
    center: [-120, 43],
    zoom: 4,
    bounds: {
      north: 49,
      south: 32,
      east: -110,
      west: -125
    }
  },
  Rocky: { 
    center: [-109, 43],
    zoom: 4,
    bounds: {
      north: 49,
      south: 31,
      east: -103,
      west: -115
    }
  },
  Central: { 
    center: [-92, 42],
    zoom: 4,
    bounds: {
      north: 49,
      south: 29,
      east: -85,
      west: -103
    }
  }
};

export default function SkiMap() {
  const [resorts, setResorts] = useState<SkiResort[]>([]);
  const [selectedResort, setSelectedResort] = useState<SkiResort | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string>('');
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [selectedLocationCoords, setSelectedLocationCoords] = useState<[number, number] | null>(null);

  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [location, setLocation] = useState<string>('');
  const [maxDistance, setMaxDistance] = useState<number>(100);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedCitySize, setSelectedCitySize] = useState<string>('');

  const updateDistanceCircle = () => {
    if (!mapRef.current || !selectedLocationCoords) return;
    const map = mapRef.current;

    // Remove existing layers if they exist
    if (map.getLayer('distance-fill')) map.removeLayer('distance-fill');
    if (map.getSource('distance-source')) map.removeSource('distance-source');

    // Create a circle using turf.js
    const center = selectedLocationCoords;
    const radius = maxDistance * 1.609; // Convert miles to kilometers
    const options = {
      steps: 64,
      units: 'kilometers'
    };
    const circle = turf.circle(center, radius, options);

    // Add the circle source
    map.addSource('distance-source', {
      type: 'geojson',
      data: circle
    });

    // Add the masked circle layer
    map.addLayer({
      id: 'distance-fill',
      type: 'fill',
      source: 'distance-source',
      paint: {
        'fill-color': '#4264fb',
        'fill-opacity': 0.2
      },
      filter: ['==', '$type', 'Polygon']
    }, 'region-states-outline'); // Place below state outlines
  };

  const handleMapLoad = async (event: { target: mapboxgl.Map }) => {
    const map = event.target;
    mapRef.current = map;

    try {
      if (!map.getSource('states')) {
        const response = await fetch(statesData);
        const geoJsonData = await response.json();

        map.addSource('states', {
          type: 'geojson',
          data: geoJsonData
        });

        // Add a layer for the US mask
        map.addLayer({
          id: 'us-mask',
          type: 'fill',
          source: 'states',
          layout: {},
          paint: {
            'fill-color': '#000',
            'fill-opacity': 0
          }
        });

        // Existing region-states-fill layer
        map.addLayer({
          id: 'region-states-fill',
          type: 'fill',
          source: 'states',
          layout: {},
          paint: {
            'fill-color': [
              'match',
              ['get', 'REGION'],
              'East', REGION_COLORS.East,
              'West', REGION_COLORS.West,
              'Rocky', REGION_COLORS.Rocky,
              'Central', REGION_COLORS.Central,
              '#000000'
            ],
            'fill-opacity': [
              'case',
              ['==', ['get', 'REGION'], ''],
              0,
              0.2
            ]
          }
        });

        // Existing region-states-outline layer
        map.addLayer({
          id: 'region-states-outline',
          type: 'line',
          source: 'states',
          layout: {},
          paint: {
            'line-color': [
              'match',
              ['get', 'REGION'],
              'East', REGION_COLORS.East,
              'West', REGION_COLORS.West,
              'Rocky', REGION_COLORS.Rocky,
              'Central', REGION_COLORS.Central,
              '#000000'
            ],
            'line-width': [
              'case',
              ['==', ['get', 'REGION'], ''],
              0,
              1
            ]
          }
        });
      }
    } catch (error) {
      console.error('Error loading GeoJSON:', error);
    }
  };

  // Helper function to determine if a filter is active
  const isFilterActive = (filterType: FilterType): boolean => {
    switch (filterType) {
      case 'price':
        return priceRange[0] > 0 || priceRange[1] < 200;
      case 'difficulty':
        return selectedDifficulties.length > 0;
      case 'region':
        return selectedRegion !== '';
      case 'distance':
        return location !== '' && selectedLocationCoords !== null;
      case 'amenities':
        return selectedAmenities.length > 0;
      case 'city':
        return selectedCitySize !== '';
      default:
        return false;
    }
  };

  // Helper function to get filter pill class names
  const getFilterPillClasses = (filterType: FilterType): string => {
    const baseClasses = "px-4 py-1 text-gray-800 rounded-full shadow transition-colors flex items-center gap-1 mt-1 ml-1";
    const isActive = isFilterActive(filterType);
    const isSelected = activeFilter === filterType;
    
    if (isActive && isSelected) {
      return `${baseClasses} bg-blue-500 ring-2 ring-blue-500 text-white`;
    } else if (isActive) {
      return `${baseClasses} bg-blue-500 hover:bg-blue-100 text-white`;
    } else if (isSelected) {
      return `${baseClasses} bg-white ring-2 ring-blue-500 hover:bg-gray-100`;
    } else {
      return `${baseClasses} bg-white hover:bg-gray-100`;
    }
  };

  useEffect(() => {
    const resortsRef = ref(database, 'resorts');
    onValue(resortsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setResorts(Object.values(data));
      }
    });
  }, []);

  useEffect(() => {
    updateDistanceCircle();
  }, [selectedLocationCoords, maxDistance]);
  
  useEffect(() => {
    return () => {
      const map = mapRef.current;
      if (map) {
        if (map.getLayer('distance-fill')) map.removeLayer('distance-fill');
        if (map.getSource('distance-source')) map.removeSource('distance-source');
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    
    if (activeFilter === 'region') {
      if (selectedRegion && REGION_COORDINATES[selectedRegion as keyof typeof REGION_COORDINATES]) {
        // If a specific region is selected, fly to that region
        const regionCoords = REGION_COORDINATES[selectedRegion as keyof typeof REGION_COORDINATES];
        mapRef.current.flyTo({
          center: regionCoords.center,
          zoom: regionCoords.zoom,
          duration: 1500,
          padding: { top: 50, bottom: 50, left: 50, right: 50 }
        });
      } else {
        // If no region is selected, show the entire US
        mapRef.current.flyTo({
          center: [-98.5795, 23.8283],
          zoom: 2,
          duration: 1500
        });
      }
    }
  }, [activeFilter, selectedRegion]);

  // Cleanup map layers on unmount
  useEffect(() => {
    return () => {
      const map = mapRef.current;
      if (map) {
        if (map.getLayer('region-states-outline')) map.removeLayer('region-states-outline');
        if (map.getLayer('region-states-fill')) map.removeLayer('region-states-fill');
        if (map.getSource('states')) map.removeSource('states');
      }
    };
  }, []);

  // Filter resorts based on all active filters
  const filteredResorts = useMemo(() => {
    return resorts.filter(resort => {
      // Region Filter
      if (selectedRegion && resort.region !== selectedRegion) {
        return false;
      }

      // Price Filter
      const fullDayPrice = parseFloat(resort.fullDayTicket.replace(/[^0-9.]/g, ''));
      if (isNaN(fullDayPrice) || fullDayPrice < priceRange[0] || fullDayPrice > priceRange[1]) {
        return false;
      }

      // Difficulty Filter
      if (selectedDifficulties.length > 0) {
        const difficultyMap: { [key: string]: string } = {
          'Green': resort.green,
          'Blue': resort.blue,
          'Double Blue': resort.doubleBlue,
          'Black': resort.black,
          'Double Black': resort.doubleBlack
        };
        
        const hasSelectedDifficulty = selectedDifficulties.some(difficulty => {
          const percentage = parseFloat(difficultyMap[difficulty].replace('%', ''));
          return !isNaN(percentage) && percentage >= 30;
        });
        
        if (!hasSelectedDifficulty) {
          return false;
        }
      }

      // Amenities Filter
      if (selectedAmenities.length > 0) {
        const amenityMap: { [key: string]: boolean | null } = {
          'Night Skiing': resort.nightSkiing,
          'Terrain Park': resort.terrainPark === 'Yes',
          'Backcountry Access': resort.backcountry,
          'Snow Tubing': resort.snowTubing,
          'Ice Skating': resort.iceSkating
        };

        const hasAllSelectedAmenities = selectedAmenities.every(
          amenity => amenityMap[amenity]
        );

        if (!hasAllSelectedAmenities) {
          return false;
        }
      }

      return true;
    });
  }, [resorts, priceRange, selectedDifficulties, selectedRegion, selectedAmenities]);

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
            onRegionHover={setHoveredRegion}
          />
        );
      case 'distance':
        return (
          <DistanceFilter
            location={location}
            setLocation={setLocation}
            maxDistance={maxDistance}
            setMaxDistance={setMaxDistance}
            setSelectedCoordinates={setSelectedLocationCoords}
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

  const handleMapClick = (event: mapboxgl.MapLayerMouseEvent) => {
    // Prevent closing if clicking on a marker
    if (event.originalEvent.target instanceof HTMLElement && 
        event.originalEvent.target.closest('.mapboxgl-marker')) {
      return;
    }
    
    setActiveFilter(null);
    setHoveredRegion('');
  };

  return (
    <div className="relative w-full h-screen">
      {/* Filter buttons */}
      <div className="absolute top-4 left-0 right-0 z-10 mx-4">
        <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar max-w-full">
          <button 
            onClick={() => setActiveFilter('price')}
            className={getFilterPillClasses('price')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M7 15h2c0 1.08 1.37 2 3 2s3-.92 3-2c0-1.1-1.04-1.5-3.24-2.03C9.64 12.44 7 11.78 7 9c0-1.79 1.47-3.31 3.5-3.82V3h3v2.18C15.53 5.69 17 7.21 17 9h-2c0-1.08-1.37-2-3-2s-3 .92-3 2c0 1.1 1.04 1.5 3.24 2.03C14.36 11.56 17 12.22 17 15c0 1.79-1.47 3.31-3.5 3.82V21h-3v-2.18C8.47 18.31 7 16.79 7 15" />
            </svg>
            Price
          </button>
          <button 
            onClick={() => setActiveFilter('difficulty')}
            className={getFilterPillClasses('difficulty')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M1 21L12 2l11 19zm3.45-2h15.1L12 6zM12 18q.425 0 .713-.288T13 17t-.288-.712T12 16t-.712.288T11 17t.288.713T12 18m-1-3h2v-5h-2zm1-2.5"/>
            </svg>
            Difficulty
          </button>
          <button 
            onClick={() => setActiveFilter('region')}
            className={getFilterPillClasses('region')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="m15 21l-6-2.1l-6 2.325V5.05L9 3l6 2.1l6-2.325V18.95zm-1-2.45V6.85l-4-1.4v11.7zm2 0l3-1V5.7l-3 1.15zM5 18.3l3-1.15V5.45l-3 1zM16 6.85v11.7zm-8-1.4v11.7z"/>
            </svg>
            Region
          </button>
          <button 
            onClick={() => setActiveFilter('distance')}
            className={getFilterPillClasses('distance')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="m6.343 14.728l-2.828 2.829l3.535 3.535L20.485 7.657L16.95 4.121l-2.121 2.122l1.414 1.414l-1.414 1.414l-1.415-1.414l-2.121 2.121l2.121 2.122L12 13.314l-2.12-2.121l-2.122 2.12l1.415 1.415l-1.415 1.414z"/>
            </svg>
            Distance
          </button>
          <button 
            onClick={() => setActiveFilter('amenities')}
            className={getFilterPillClasses('amenities')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" stroke="currentColor" d="M7.5 11.5v3M6 13h3m3-4.653c2.005 0 3.7-1.888 5.786-1.212c2.264.733 3.82 3.413 3.708 9.492c-.022 1.224-.336 2.578-1.546 3.106c-2.797 1.221-4.397-2.328-7-2.328h-1.897c-2.605 0-4.213 3.545-6.998 2.328c-1.21-.528-1.525-1.882-1.547-3.107c-.113-6.078 1.444-8.758 3.708-9.491C8.299 6.459 9.994 8.347 12 8.347m0-4.565v4.342M14.874 13h3"/>
            </svg>
            Amenities
          </button>
          <button 
            onClick={() => setActiveFilter('city')}
            className={getFilterPillClasses('city')}
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
      <div className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-lg transform transition-transform duration-300 ease-in-out z-20 ${activeFilter ? 'translate-y-0' : 'translate-y-full'}`} style={{ height: '50vh' }}>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">
            {activeFilter ? activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1) : ''} Filter
          </h2>
          <button onClick={() => {
            setActiveFilter(null);
            setHoveredRegion('');
          }} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(50vh - 4rem)' }}>
          {renderFilterPanel()}
        </div>
      </div>
      
      <Map
        initialViewState={{
          longitude: -100,
          latitude: 40,
          zoom: 3,
        }}
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        reuseMaps
        onClick={handleMapClick}
        onLoad={handleMapLoad}
      >
        {/* Resort markers */}
        {filteredResorts.map((resort, index) => (
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

        {/* Selected location marker */}
        {selectedLocationCoords && (
          <Marker
            latitude={selectedLocationCoords[1]}
            longitude={selectedLocationCoords[0]}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <g fill="#f00" fillRule="evenodd" clipRule="evenodd">
                <path d="M16.272 10.272a4 4 0 1 1-8 0a4 4 0 0 1 8 0m-2 0a2 2 0 1 1-4 0a2 2 0 0 1 4 0" />
                <path d="M5.794 16.518a9 9 0 1 1 12.724-.312l-6.206 6.518zm11.276-1.691l-4.827 5.07l-5.07-4.827a7 7 0 1 1 9.897-.243" />
              </g>
            </svg>
          </Marker>
        )}
        
        {/* Resort popup */}
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