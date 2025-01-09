import React from 'react';

interface DistanceFilterProps {
  location: string;
  setLocation: (location: string) => void;
  maxDistance: number;
  setMaxDistance: (distance: number) => void;
}

export default function DistanceFilter({
  location,
  setLocation,
  maxDistance,
  setMaxDistance
}: DistanceFilterProps) {
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
}