import React from 'react';

interface SoundMeterProps {
  volume: number;
  maxVolume: number;
  isActive: boolean;
  onResetMax: () => void;
}

const SoundMeter: React.FC<SoundMeterProps> = ({ volume, maxVolume, isActive, onResetMax }) => {
  // Get volume level text
  const getVolumeText = (vol: number): string => {
    if (vol < 10) return 'Ambient';
    if (vol < 30) return 'Low';
    if (vol < 60) return 'Moderate';
    if (vol < 80) return 'High';
    return 'Extreme';
  };
  
  // Get color based on volume
  const getVolumeColor = (vol: number): string => {
    if (vol < 30) return 'text-neon-blue';
    if (vol < 60) return 'text-neon-yellow';
    if (vol < 80) return 'text-orange-400';
    return 'text-neon-pink';
  };
  
  // Format volume as DB value (this is a simplified approximation)
  const formatDB = (vol: number): number => {
    if (vol === 0) return -60;
    // Approximate dB conversion (simplified)
    return Math.round((20 * Math.log10(vol / 100) + 60) - 20);
  };
  
  const segments = 20; // Number of segments in the meter
  const activeSegments = Math.floor((volume / 100) * segments);
  
  return (
    <div className="cyberpunk-meter">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-mono uppercase text-md tracking-wider mb-2">
            Sound Level Monitor
          </h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm mb-4">
            <div className="flex justify-between font-mono">
              <span className="text-gray-400">Current:</span>
              <span className={`${getVolumeColor(volume)} font-bold`}>
                {formatDB(volume)} dB
              </span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-gray-400">Level:</span>
              <span className={`${getVolumeColor(volume)}`}>
                {getVolumeText(volume)}
              </span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-gray-400">Peak:</span>
              <span className={`${getVolumeColor(maxVolume)} font-bold`}>
                {formatDB(maxVolume)} dB
              </span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-gray-400">Status:</span>
              <span className={isActive ? 'text-green-400' : 'text-red-400'}>
                {isActive ? 'MONITORING' : 'INACTIVE'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="hidden sm:flex flex-col items-center mr-4">
          <div className="flex flex-col-reverse h-24 w-8 bg-black/50 border border-gray-700 rounded-md overflow-hidden">
            {Array.from({ length: segments }).map((_, i) => {
              // Define segment colors based on position
              let bgColor = 'bg-neon-blue';
              if (i >= segments * 0.8) bgColor = 'bg-neon-pink';
              else if (i >= segments * 0.6) bgColor = 'bg-orange-400';
              else if (i >= segments * 0.4) bgColor = 'bg-neon-yellow';
              
              const isActive = i < activeSegments;
              
              return (
                <div 
                  key={i}
                  className={`h-full border-t border-black/20 ${isActive ? bgColor : 'bg-gray-800'} transition-all duration-100`}
                  style={{ 
                    opacity: isActive ? 1 : 0.2,
                    boxShadow: isActive ? `0 0 5px ${bgColor}` : 'none'
                  }}
                />
              );
            })}
          </div>
          <button 
            onClick={onResetMax}
            className="text-xs text-neon-blue hover:text-neon-pink mt-2 font-mono uppercase"
          >
            Reset Max
          </button>
        </div>
      </div>
      
      <div className="w-full h-8 bg-black/50 border border-gray-700 rounded-md overflow-hidden mb-1">
        <div 
          className="h-full transition-all duration-100"
          style={{ 
            width: `${volume}%`, 
            background: `linear-gradient(90deg, #00f3ff ${volume < 40 ? '100%' : '40%'}, #ffff00 ${volume < 70 ? '100%' : '70%'}, #ff00a0 100%)`,
            boxShadow: '0 0 10px rgba(0, 243, 255, 0.7)' 
          }}
        />
      </div>
      
      <div className="relative w-full h-4">
        {/* Volume level markers */}
        <div className="absolute left-0 top-0 w-full flex justify-between px-1 font-mono text-xs text-gray-500">
          <span>-60</span>
          <span>-50</span>
          <span>-40</span>
          <span>-30</span>
          <span>-20</span>
          <span>-10</span>
          <span>0</span>
        </div>
        
        {/* Max volume marker */}
        {maxVolume > 0 && (
          <div 
            className="absolute top-0 h-3 w-0.5 bg-neon-pink"
            style={{ left: `${maxVolume}%`, boxShadow: '0 0 4px #ff00a0' }}
          />
        )}
      </div>
    </div>
  );
};

export default SoundMeter;