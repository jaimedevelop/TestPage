import { useEffect, useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { SkiResort } from '../types';
import { MapPin } from 'lucide-react';

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
        <Popup
          latitude={Number(selectedResort.latitude)}
          longitude={Number(selectedResort.longitude)}
          onClose={() => setSelectedResort(null)}
          closeButton={true}
          closeOnClick={false}
          className="bg-white rounded-lg shadow-lg"
        >
          <div className="p-4">
            <h3 className="text-lg font-bold mb-2">{selectedResort.name}</h3>
            <p className="text-sm text-gray-600">{selectedResort.state}</p>
            <div className="mt-2">
              <p className="text-sm">Full Day: {selectedResort.fullDayTicket}</p>
              <div className="mt-2">
                <p className="text-xs font-semibold">Trail Difficulty:</p>
                <div className="flex gap-2 mt-1">
                  <span className="text-green-600">Green: {selectedResort.green}</span>
                  <span className="text-blue-600">Blue: {selectedResort.blue}</span>
                  <span className="text-black">Black: {selectedResort.black}</span>
                </div>
              </div>
            </div>
          </div>
        </Popup>
      )}
    </Map>
  );
}