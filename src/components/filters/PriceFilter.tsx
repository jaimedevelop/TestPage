import React from 'react';

interface PriceFilterProps {
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
}

export default function PriceFilter({ priceRange, setPriceRange }: PriceFilterProps) {
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
}