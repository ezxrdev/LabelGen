import React, { useMemo } from 'react';

interface BarcodeProps {
  value: string;
  width?: string;
  height?: string;
  showValue?: boolean;
}

// Visual simulation of a barcode using flex divs to avoid heavy external dependencies
// for this specific demo interaction.
export const Barcode: React.FC<BarcodeProps> = ({ 
  value, 
  width = "100%", 
  height = "40px",
  showValue = true 
}) => {
  const bars = useMemo(() => {
    // Deterministic generation based on string char codes to make it look stable
    const generatedBars: number[] = [];
    // Start guard pattern
    generatedBars.push(1, 0, 1); 
    
    for (let i = 0; i < value.length; i++) {
      const code = value.charCodeAt(i);
      // Generate a few bars per character
      generatedBars.push((code % 2) + 1); // Width 1 or 2
      generatedBars.push(0); // Space
      generatedBars.push(((code * 3) % 3) + 1); // Width 1, 2, or 3
      generatedBars.push(0);
    }
    
    // End guard pattern
    generatedBars.push(1, 0, 1);
    return generatedBars;
  }, [value]);

  return (
    <div className="flex flex-col items-center select-none" style={{ width }}>
      <div className="flex items-end justify-between w-full overflow-hidden" style={{ height }}>
        {bars.map((b, i) => {
          if (b === 0) return <div key={i} style={{ width: '2px' }} />; // Space
          return (
            <div 
              key={i} 
              className="bg-black flex-grow" 
              style={{ 
                width: `${b * 1.5}px`, 
                height: '100%',
                marginLeft: '1px',
                marginRight: '1px'
              }} 
            />
          );
        })}
      </div>
      {showValue && (
        <div className="text-xs font-mono tracking-wider mt-0.5 text-center w-full">
          {value}
        </div>
      )}
    </div>
  );
};