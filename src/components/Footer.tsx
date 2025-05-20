import React, { useState, useEffect } from 'react';

const Footer: React.FC = () => {
  const [deviceInfo, setDeviceInfo] = useState('Checking...');
  const [audioInputs, setAudioInputs] = useState<MediaDeviceInfo[]>([]);
  
  useEffect(() => {
    // Get device info
    const userAgent = navigator.userAgent;
    let device = 'Unknown Device';
    
    if (/iPhone|iPad|iPod/.test(userAgent)) {
      device = 'iOS Device';
    } else if (/Android/.test(userAgent)) {
      device = 'Android Device';
    } else if (/Windows/.test(userAgent)) {
      device = 'Windows Device';
    } else if (/Mac/.test(userAgent)) {
      device = 'Mac Device';
    } else if (/Linux/.test(userAgent)) {
      device = 'Linux Device';
    }
    
    setDeviceInfo(device);
    
    // Get audio input devices
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const audioDevices = devices.filter(device => device.kind === 'audioinput');
        setAudioInputs(audioDevices);
      })
      .catch(err => console.error('Error getting audio devices:', err));
  }, []);
  
  return (
    <footer className="w-full border-t border-neon-blue/30 bg-black/70 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-xs font-mono">
                <span className="text-neon-blue">SOUNDRIZZ</span> // 
                <span className="text-neon-pink">2025</span> // 
                <span className="text-neon-yellow">BRAINROT COMMUNITY</span>
              </p>
            </div>
            
            <div className="grid grid-flow-col gap-3 text-xs font-mono">
              <div className="status-pill">{deviceInfo}</div>
              <div className="status-pill">NET:SECURE</div>
              <div className="status-pill">MEM:OPTIMAL</div>
            </div>
          </div>
          
          {audioInputs.length > 0 && (
            <div className="text-center md:text-left text-xs font-mono text-gray-400">
              <span className="text-neon-pink">MIC</span> // {
                audioInputs[0].label || 'Default Device'
              }
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;