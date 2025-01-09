import React from 'react';

const REGIONS = {
  East: ['Maine', 'Vermont', 'New Hampshire', 'New York', 'Pennsylvania'],
  West: ['California', 'Oregon', 'Washington'],
  Central: ['Michigan', 'Wisconsin', 'Minnesota'],
  Rocky: ['Colorado', 'Utah', 'Wyoming', 'Montana', 'Idaho']
} as const;

interface RegionFilterProps {
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  selectedStates: string[];
  setSelectedStates: (states: string[]) => void;
}

export default function RegionFilter({ 
  selectedRegion, 
  setSelectedRegion, 
  selectedStates, 
  setSelectedStates 
}: RegionFilterProps) {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4">Region Selection</h3>
      <select
        value={selectedRegion}
        onChange={(e) => {
          setSelectedRegion(e.target.value);
          setSelectedStates([]);
        }}
        className="w-full p-2 mb-4 border rounded"
      >
        <option value="">Select Region</option>
        {Object.keys(REGIONS).map((region) => (
          <option key={region} value={region}>{region}</option>
        ))}
      </select>
      
      {selectedRegion && (
        <div className="space-y-2">
          <h4 className="font-medium mb-2">States</h4>
          {REGIONS[selectedRegion as keyof typeof REGIONS].map((state) => (
            <label key={state} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedStates.includes(state)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedStates([...selectedStates, state]);
                  } else {
                    setSelectedStates(selectedStates.filter(s => s !== state));
                  }
                }}
                className="rounded"
              />
              <span>{state}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}