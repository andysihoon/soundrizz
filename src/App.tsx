import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import AudioVisualizer from './components/AudioVisualizer';
import useAudio from './hooks/useAudio';

interface Ripple {
  x: number;
  y: number;
  id: number;
}

function App() {
  const { volume, isListening } = useAudio();
  const isActive = isListening && volume > 10;
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = {
      x,
      y,
      id: Date.now(),
    };

    setRipples(prev => [...prev, newRipple]);
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 1000);
  }, []);

  return (
    <div 
      className="min-h-screen flex flex-col bg-cyberpunk-bg text-gray-100 relative overflow-hidden"
      onClick={handleClick}
    >
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="ripple-effect"
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
        />
      ))}
      
      <Header />
      
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto">
          <div className="grid gap-6">
            <div className="text-center mb-4">
              <h1 className={`text-3xl md:text-4xl font-bold font-mono mb-2 transition-all duration-200 ${
                isActive ? 'glitch-text scale-105' : 'opacity-75'
              }`}>
                <span className="text-neon-blue">SOUND</span>
                <span className="text-neon-pink">RIZZ</span>
              </h1>
              <p className="font-mono text-gray-400 max-w-2xl mx-auto">
                brainrot community
              </p>
            </div>
            
            <AudioVisualizer />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;