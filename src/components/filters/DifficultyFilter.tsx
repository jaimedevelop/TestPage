import React from 'react';

interface DifficultyFilterProps {
  selectedDifficulties: string[];
  setSelectedDifficulties: (difficulties: string[]) => void;
}

export default function DifficultyFilter({
  selectedDifficulties,
  setSelectedDifficulties,
}: DifficultyFilterProps) {
  const toggleDifficulty = (difficulty: string) => {
    if (selectedDifficulties.includes(difficulty)) {
      setSelectedDifficulties(selectedDifficulties.filter((d) => d !== difficulty));
    } else {
      setSelectedDifficulties([...selectedDifficulties, difficulty]);
    }
  };

  const difficulties = [
    {
      name: 'Green',
      label: 'Beginner',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	<path fill="currentColor" d="M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22" />
</svg>,
      bgColor: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      activeColor: 'active:bg-green-500',
      selectedColor: 'bg-green-500',
      textColor: 'text-white',
    },
    {
      name: 'Blue',
      label: 'Amateur',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	<path fill="currentColor" d="M3 21V3h18v18z" />
</svg>,
      bgColor: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      activeColor: 'active:bg-blue-500',
      selectedColor: 'bg-blue-500',
      textColor: 'text-white',
    },
    {
      name: 'Double Blue',
      label: 'Intermediate',
      icon:<div className="flex gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	<path fill="currentColor" d="M3 21V3h18v18z" />
</svg><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	<path fill="currentColor" d="M3 21V3h18v18z" />
</svg></div> ,
      bgColor: 'bg-blue-700',
      hoverColor: 'hover:bg-blue-800',
      activeColor: 'active:bg-blue-700',
      selectedColor: 'bg-blue-700',
      textColor: 'text-white',
    },
    {
      name: 'Black',
      label: 'Advanced',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	<g fill="none" fillRule="evenodd">
		<path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
		<path fill="currentColor" d="M10.823 2.393a1.5 1.5 0 0 1 2.355 0l6.603 8.368a2 2 0 0 1 0 2.478l-6.603 8.368a1.5 1.5 0 0 1-2.356 0L4.22 13.24a2 2 0 0 1 0-2.478l6.603-8.368Z" />
	</g>
</svg>,
      bgColor: 'bg-black',
      hoverColor: 'hover:bg-gray-900',
      activeColor: 'active:bg-black',
      selectedColor: 'bg-black',
      textColor: 'text-white',
    },
    {
      name: 'Double Black',
      label: 'Expert',
      icon: <div className="flex"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	<g fill="none" fillRule="evenodd">
		<path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
		<path fill="currentColor" d="M10.823 2.393a1.5 1.5 0 0 1 2.355 0l6.603 8.368a2 2 0 0 1 0 2.478l-6.603 8.368a1.5 1.5 0 0 1-2.356 0L4.22 13.24a2 2 0 0 1 0-2.478l6.603-8.368Z" />
	</g>
</svg><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	<g fill="none" fillRule="evenodd">
		<path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
		<path fill="currentColor" d="M10.823 2.393a1.5 1.5 0 0 1 2.355 0l6.603 8.368a2 2 0 0 1 0 2.478l-6.603 8.368a1.5 1.5 0 0 1-2.356 0L4.22 13.24a2 2 0 0 1 0-2.478l6.603-8.368Z" />
	</g>
</svg></div>,
      bgColor: 'bg-black',
      hoverColor: 'hover:bg-gray-900',
      activeColor: 'active:bg-black',
      selectedColor: 'bg-black',
      textColor: 'text-yellow-400',
    },
  ];

  const CheckIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-green-400"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4">Difficulty Levels</h3>
      <div className="space-y-2">
        {difficulties.map((difficulty) => (
          <button
            key={difficulty.name}
            onClick={() => toggleDifficulty(difficulty.name)}
            className={`w-full p-3 rounded-lg transition-colors duration-200 flex items-center justify-between ${
              difficulty.bgColor
            } ${
              selectedDifficulties.includes(difficulty.name)
                ? difficulty.selectedColor
                : `${difficulty.hoverColor} ${difficulty.activeColor}`
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className={`font-mono text-lg ${difficulty.textColor}`}>
                {difficulty.icon}
              </span>
              <span className={difficulty.textColor}>{difficulty.label}</span>
            </div>
            {selectedDifficulties.includes(difficulty.name) && (
              <div className="mr-2">
                <CheckIcon />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}