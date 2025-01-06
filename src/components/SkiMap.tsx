import { useEffect, useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { SkiResort } from '../types';
import { MapPin } from 'lucide-react';
import ResortPopup from './ResortPopup';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoiam9hcXVpbmdmMjEiLCJhIjoiY2x1dnZ1ZGFrMDduZTJrbWp6bHExbzNsYiJ9.ZOEuIV9R0ks2I5bYq40HZQ';

export default function SkiMap() {
  const [resorts, setResorts] = useState<SkiResort[]>([]);
  const [selectedResort, setSelectedResort] = useState<SkiResort | null>(null);

  useEffect(() => {
    const resortsRef = ref(database, 'resorts');
    onValue(resortsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setResorts(Object.values(data));
      }
    });
  }, []);

  return (
    <Map
      initialViewState={{
        longitude: -100,
        latitude: 40,
        zoom: 3.5
      }}
      style={{ width: '100%', height: '100vh' }}
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
  );
}