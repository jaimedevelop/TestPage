import React from 'react';

const DIFFICULTIES = ['Green', 'Blue', 'Double Blue', 'Black', 'Double Black'];

interface DifficultyFilterProps {
  selectedDifficulties: string[];
  setSelectedDifficulties: (difficulties: string[]) => void;
}

export default function DifficultyFilter({ selectedDifficulties, setSelectedDifficulties }: DifficultyFilterProps) {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4">Difficulty Levels</h3>
      <div className="space-y-2">
        {DIFFICULTIES.map((difficulty) => (
          <label key={difficulty} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedDifficulties.includes(difficulty)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedDifficulties([...selectedDifficulties, difficulty]);
                } else {
                  setSelectedDifficulties(selectedDifficulties.filter(d => d !== difficulty));
                }
              }}
              className="rounded"
            />
            <span>{difficulty}</span>
          </label>
        ))}
      </div>
    </div>
  );
}