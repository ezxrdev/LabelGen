import React, { useMemo } from 'react';

interface QRCodeProps {
  value?: string; // Used to seed the random generation
  size?: number;
  className?: string;
}

export const QRCode: React.FC<QRCodeProps> = ({ 
  value = "EZXR", 
  size = 80,
  className = ""
}) => {
  // Generate a deterministic grid based on the value
  const matrix = useMemo(() => {
    const gridSize = 21; // Standard QR version 1 size
    const grid = Array(gridSize * gridSize).fill(false);
    
    // Seeded random function
    let seed = 0;
    for (let i = 0; i < value.length; i++) seed += value.charCodeAt(i);
    
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    // Fill random data
    for (let i = 0; i < grid.length; i++) {
      grid[i] = random() > 0.5;
    }

    // Function to carve out safe zones for finder patterns (top-left, top-right, bottom-left)
    const clearZone = (r: number, c: number, size: number) => {
      for (let i = r; i < r + size; i++) {
        for (let j = c; j < c + size; j++) {
          if (i >= 0 && i < gridSize && j >= 0 && j < gridSize) {
            grid[i * gridSize + j] = false;
          }
        }
      }
    };

    // Clear zones for finders (7x7 + 1 separator)
    clearZone(0, 0, 8);
    clearZone(0, gridSize - 8, 8);
    clearZone(gridSize - 8, 0, 8);

    return grid;
  }, [value]);

  const FinderPattern = ({ top, left }: { top: number, left: number }) => (
    <div className="absolute bg-black flex items-center justify-center" 
         style={{ 
           top: `${top}%`, 
           left: `${left}%`, 
           width: '33%', 
           height: '33%',
           border: '4px solid black',
           boxSizing: 'border-box'
         }}>
         <div className="w-full h-full border-[2px] border-white bg-black relative">
            <div className="absolute inset-[15%] bg-black"></div>
            <div className="absolute inset-[30%] bg-white"></div>
            <div className="absolute inset-[50%] bg-black"></div>
         </div>
    </div>
  );

  return (
    <div 
      className={`bg-white relative flex flex-wrap ${className}`} 
      style={{ width: size, height: size, padding: size * 0.05 }}
    >
      {/* Finder Patterns */}
      <div className="absolute top-0 left-0 w-[35%] h-[35%] border-[4px] border-black bg-white flex items-center justify-center z-10">
        <div className="w-[60%] h-[60%] bg-black"></div>
      </div>
      <div className="absolute top-0 right-0 w-[35%] h-[35%] border-[4px] border-black bg-white flex items-center justify-center z-10">
        <div className="w-[60%] h-[60%] bg-black"></div>
      </div>
      <div className="absolute bottom-0 left-0 w-[35%] h-[35%] border-[4px] border-black bg-white flex items-center justify-center z-10">
        <div className="w-[60%] h-[60%] bg-black"></div>
      </div>

      {/* Data Grid */}
      <div className="w-full h-full grid grid-cols-[repeat(21,1fr)] grid-rows-[repeat(21,1fr)]">
        {matrix.map((filled, i) => (
          <div key={i} className={filled ? "bg-black" : "bg-transparent"} />
        ))}
      </div>
    </div>
  );
};