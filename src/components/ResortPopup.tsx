import { Popup } from 'react-map-gl';
import { SkiResort } from '../types';

interface ResortPopupProps {
  resort: SkiResort;
  onClose: () => void;
}

export default function ResortPopup({ resort, onClose }: ResortPopupProps) {
  const getNumberFromPercentage = (value: string | undefined) => {
    if (!value) return 0;
    return Number(value.replace('%', ''));
  };

  return (
    <Popup
      latitude={Number(resort.latitude)}
      longitude={Number(resort.longitude)}
      onClose={onClose}
      closeButton={true}
      closeOnClick={false}
      offset={16}
      className="custom-popup" // Add this class
    >
      {/* Custom card with no background */}
      <div className="rounded-lg shadow-lg overflow-hidden w-80">
        {/* Top Row - Resort Name */}
        <div className="bg-blue-600 p-3">
          <h3 className="text-lg font-bold text-white text-center">{resort.name}</h3>
        </div>

        {/* Middle Row - Ticket Prices */}
        <div className="bg-white p-3 border-x border-gray-200">
          <div className="flex flex-col items-center gap-1">
            <p className="text-sm font-bold">Full Day: {resort.fullDayTicket}</p>
            {resort.halfDayTicket && (
              <p className="text-sm font-bold">Half Day: {resort.halfDayTicket}</p>
            )}
          </div>
        </div>

        {/* Bottom Row - Trail Difficulties */}
        <div className="flex h-8">
          {resort.green && getNumberFromPercentage(resort.green) > 0 && (
            <div 
              className="bg-green-600 text-white flex items-center justify-center text-xs font-bold"
              style={{ width: `${getNumberFromPercentage(resort.green)}%` }}
            >
              {resort.green}
            </div>
          )}
          {resort.blue && getNumberFromPercentage(resort.blue) > 0 && (
            <div 
              className="bg-blue-500 text-white flex items-center justify-center text-xs font-bold"
              style={{ width: `${getNumberFromPercentage(resort.blue)}%` }}
            >
              {resort.blue}
            </div>
          )}
          {resort.doubleBlue && getNumberFromPercentage(resort.doubleBlue) > 0 && (
            <div 
              className="bg-blue-800 text-white flex items-center justify-center text-xs font-medium"
              style={{ width: `${getNumberFromPercentage(resort.doubleBlue)}%` }}
            >
              {resort.doubleBlue}
            </div>
          )}
          {resort.black && getNumberFromPercentage(resort.black) > 0 && (
            <div 
              className="bg-black text-white flex items-center justify-center text-xs font-bold"
              style={{ width: `${getNumberFromPercentage(resort.black)}%` }}
            >
              {resort.black}
            </div>
          )}
          {resort.doubleBlack && getNumberFromPercentage(resort.doubleBlack) > 0 && (
            <div 
              className="bg-black text-yellow-400 flex items-center justify-center text-xs font-bold"
              style={{ width: `${getNumberFromPercentage(resort.doubleBlack)}%` }}
            >
              {resort.doubleBlack}
            </div>
          )}
        </div>
      </div>
    </Popup>
  );
}