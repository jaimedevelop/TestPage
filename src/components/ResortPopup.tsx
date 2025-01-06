import { Popup } from 'react-map-gl';
import { SkiResort } from '../types';

interface ResortPopupProps {
  resort: SkiResort;
  onClose: () => void;
}

export default function ResortPopup({ resort, onClose }: ResortPopupProps) {
  return (
    <Popup
      latitude={Number(resort.latitude)}
      longitude={Number(resort.longitude)}
      onClose={onClose}
      closeButton={true}
      closeOnClick={false}
      className="bg-white rounded-lg shadow-lg"
    >
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2">{resort.name}</h3>
        <p className="text-sm text-gray-600">{resort.state}</p>
        <div className="mt-2">
          <p className="text-sm">Full Day: {resort.fullDayTicket}</p>
          <div className="mt-2">
            <p className="text-xs font-semibold">Trail Difficulty:</p>
            <div className="flex gap-2 mt-1">
              <span className="text-green-600">Green: {resort.green}</span>
              <span className="text-blue-600">Blue: {resort.blue}</span>
              <span className="text-black">Black: {resort.black}</span>
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
}