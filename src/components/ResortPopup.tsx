import { Popup } from 'react-map-gl';
import { SkiResort } from '../types';

interface ResortPopupProps {
  resort: SkiResort;
  onClose: () => void;
}

export default function ResortPopup({ resort, onClose }: ResortPopupProps) {
  // Count how many difficulty levels have percentage values
const difficultyLevels = [
  { 
    value: resort.green, 
    color: 'bg-gradient-to-r from-green-500 to-green-600', 
    textColor: 'text-white' 
  },
  { 
    value: resort.blue, 
    color: 'bg-gradient-to-r from-blue-400 to-blue-500', 
    textColor: 'text-white' 
  },
  { 
    value: resort.doubleBlue, 
    color: 'bg-gradient-to-r from-blue-500 to-blue-600', 
    textColor: 'text-white' 
  },
  { 
    value: resort.black, 
    color: 'bg-gradient-to-r from-gray-800 to-black', 
    textColor: 'text-white' 
  },
  { 
    value: resort.doubleBlack, 
    color: 'bg-gradient-to-r from-black to-black', 
    textColor: 'text-yellow-400' 
  }
].filter(level => level.value && level.value !== "-");

  // Calculate equal width percentage based on actual number of difficulties present
  const equalWidth = `${100 / difficultyLevels.length}%`;

  return (
    <Popup
      latitude={Number(resort.latitude)}
      longitude={Number(resort.longitude)}
      onClose={onClose}
      closeButton={true}
      closeOnClick={true}
      offset={16}
      className="custom-popup transition-all duration-300 ease-in-out"
    >
      <div className="rounded-lg shadow-lg overflow-hidden w-80">
        {/* Top Row - Resort Name */}
        <div className="bg-blue-600 p-3">
          <h3 className="text-lg font-bold text-white text-center">{resort.name}</h3>
        </div>

        {/* Middle Row - Ticket Prices */}
        <div className="bg-white p-3 border-x border-gray-200">
          <div className="flex flex-col items-center gap-1">
            <p className="text-sm font-medium">Full Day: {resort.fullDayTicket}</p>
            {resort.halfDayTicket && resort.halfDayTicket !== "-" && (
  <p className="text-sm font-medium">Half Day: {resort.halfDayTicket}</p>
)}
          </div>
        </div>

        {/* Bottom Row - Trail Difficulties */}
        <div className="flex h-8">
          {difficultyLevels.map((level, index) => (
            <div 
              key={index}
              className={`${level.color} ${level.textColor} flex items-center justify-center text-xs font-medium`}
              style={{ width: equalWidth }}
            >
              {level.value}
            </div>
          ))}
        </div>
      </div>
    </Popup>
  );
}