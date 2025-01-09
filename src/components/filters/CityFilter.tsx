import React from 'react';

const CITY_SIZES = ['Small', 'Medium', 'Large'];

interface CityFilterProps {
  selectedCitySize: string;
  setSelectedCitySize: (size: string) => void;
}

export default function CityFilter({
  selectedCitySize,
  setSelectedCitySize
}: CityFilterProps) {
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
}