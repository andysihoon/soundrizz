import React, { useEffect, useState } from 'react';
import { VolumeX, Volume2, Settings } from 'lucide-react';
import WaveChart from './WaveChart';
import SoundMeter from './SoundMeter';
import useAudio from '../hooks/useAudio';

const AudioVisualizer: React.FC = () => {
  const {
    isListening,
    volume,
    audioData,
    maxVolume,
    error,
    audioInputs,
    currentDevice,
    startListening,
    stopListening,
    resetMaxVolume
  } = useAudio();

  const [showDevices, setShowDevices] = useState(false);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening(currentDevice);
    }
  };

  const handleDeviceChange = (deviceId: string) => {
    if (isListening) {
      stopListening();
    }
    startListening(deviceId);
    setShowDevices(false);
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex flex-col gap-6">
        <div className="cyberpunk-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-mono text-neon-pink uppercase tracking-wider">
              Audio Sensor
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDevices(!showDevices)}
                className="cyberpunk-button bg-neon-yellow"
                title="Select Input Device"
              >
                <Settings size={18} />
              </button>
              <button
                onClick={toggleListening}
                className={`cyberpunk-button ${isListening ? 'bg-neon-pink' : 'bg-neon-blue'}`}
              >
                {isListening ? (
                  <>
                    <VolumeX size={18} /> Stop
                  </>
                ) : (
                  <>
                    <Volume2 size={18} /> Listen
                  </>
                )}
              </button>
            </div>
          </div>

          {showDevices && (
            <div className="mb-4 p-3 bg-black/50 border border-neon-blue rounded-md">
              <h3 className="text-sm font-mono text-neon-blue mb-2">Select Input Device:</h3>
              <div className="flex flex-col gap-2">
                {audioInputs.map((device) => (
                  <button
                    key={device.deviceId}
                    onClick={() => handleDeviceChange(device.deviceId)}
                    className={`text-left p-2 rounded text-sm font-mono transition-colors ${
                      currentDevice === device.deviceId
                        ? 'bg-neon-blue/20 text-white'
                        : 'hover:bg-gray-800/50 text-gray-400'
                    }`}
                  >
                    {device.label || 'Unnamed Device'}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {error && (
            <div className="bg-black/60 border border-red-500 text-red-400 p-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <SoundMeter 
            volume={volume} 
            maxVolume={maxVolume} 
            onResetMax={resetMaxVolume} 
            isActive={isListening}
          />
          
          <div className="mt-6">
            <h3 className="text-lg font-mono text-neon-blue mb-2 uppercase tracking-wider">
              Sound Wave
            </h3>
            <WaveChart data={audioData} isActive={isListening} />
          </div>
        </div>
        
        <div className="cyberpunk-card">
          <h3 className="text-lg font-mono text-neon-yellow mb-2 uppercase tracking-wider">
            System Status
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="status-item">
              <span className="label">Capture Status:</span>
              <span className={`value ${isListening ? 'text-green-400' : 'text-red-400'}`}>
                {isListening ? 'ACTIVE' : 'INACTIVE'}
              </span>
            </div>
            <div className="status-item">
              <span className="label">Signal Quality:</span>
              <span className="value text-neon-yellow">
                {isListening ? (volume > 50 ? 'STRONG' : volume > 10 ? 'MODERATE' : 'WEAK') : 'N/A'}
              </span>
            </div>
            <div className="status-item">
              <span className="label">Sample Rate:</span>
              <span className="value">48 kHz</span>
            </div>
            <div className="status-item">
              <span className="label">Input Device:</span>
              <span className="value text-neon-blue">
                {audioInputs.find(d => d.deviceId === currentDevice)?.label?.split('(')[0].trim() || 'Default'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioVisualizer;