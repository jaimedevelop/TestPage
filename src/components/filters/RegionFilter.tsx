import React from 'react';

const REGIONS = ['East', 'West', 'Central', 'Rocky'] as const;

interface RegionFilterProps {
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  selectedStates: string[];
  setSelectedStates: (states: string[]) => void;
  onRegionHover: (region: string) => void;
}

export default function RegionFilter({ 
  selectedRegion, 
  setSelectedRegion,
  selectedStates,
  setSelectedStates,
  onRegionHover
}: RegionFilterProps) {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4">Region Selection</h3>
      <div className="grid grid-cols-2 gap-4">
        {REGIONS.map((region) => (
          <button
            key={region}
            onClick={() => {
              setSelectedRegion(selectedRegion === region ? '' : region);
              setSelectedStates([]);
            }}
            onMouseEnter={() => onRegionHover(region)}
            onMouseLeave={() => onRegionHover('')}
            className={`p-4 rounded-lg transition-all duration-200 ${
              selectedRegion === region
                ? 'bg-blue-500 text-white shadow-lg scale-105'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {region}
          </button>
        ))}
      </div>
    </div>
  );
}