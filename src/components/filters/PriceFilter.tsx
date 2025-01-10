import React from 'react';

interface PriceFilterProps {
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
}

export default function PriceFilter({ priceRange, setPriceRange }: PriceFilterProps) {
  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    const [min, max] = priceRange;
    
    if (e.target.name === 'min') {
      setPriceRange([Math.min(value, max - 10), max]);
    } else {
      setPriceRange([min, Math.max(value, min + 10)]);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">Price Range</h3>
      <div className="relative pt-6">
        <div className="relative">
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="absolute h-2 bg-blue-500 rounded-full"
              style={{
                left: `${(priceRange[0] / 315) * 100}%`,
                right: `${100 - (priceRange[1] / 315) * 100}%`
              }}
            />
          </div>
          <input
            type="range"
            name="min"
            min="0"
            max="315"
            value={priceRange[0]}
            onChange={handleRangeChange}
            className="absolute top-0 h-2 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-500 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer"
          />
          <input
            type="range"
            name="max"
            min="0"
            max="315"
            value={priceRange[1]}
            onChange={handleRangeChange}
            className="absolute top-0 h-2 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-500 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer"
          />
        </div>
        <div className="flex justify-between mt-4">
          <span className="font-medium">${priceRange[0]}</span>
          <span className="font-medium">${priceRange[1]}</span>
        </div>
      </div>
    </div>
  );
}