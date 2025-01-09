import React from 'react';

const AMENITIES = ['Night Skiing', 'Terrain Park', 'Backcountry Access', 'Snow Tubing', 'Ice Skating'];

interface AmenitiesFilterProps {
  selectedAmenities: string[];
  setSelectedAmenities: (amenities: string[]) => void;
}

export default function AmenitiesFilter({
  selectedAmenities,
  setSelectedAmenities
}: AmenitiesFilterProps) {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4">Amenities</h3>
      <div className="space-y-2">
        {AMENITIES.map((amenity) => (
          <label key={amenity} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedAmenities.includes(amenity)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedAmenities([...selectedAmenities, amenity]);
                } else {
                  setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
                }
              }}
              className="rounded"
            />
            <span>{amenity}</span>
          </label>
        ))}
      </div>
    </div>
  );
}