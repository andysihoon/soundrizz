import React from 'react';
import { Mic } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full border-b border-neon-blue/30 bg-black/70 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Mic 
                className="text-neon-pink" 
                size={28}
              />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-neon-pink rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-neon-blue text-2xl font-bold font-mono tracking-wider">
                SOUND<span className="text-neon-pink">RIZZ</span>
              </h1>
              <p className="text-gray-400 text-xs">// brainrot community</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4 font-mono text-sm uppercase">
            <div className="flex items-center gap-1 text-neon-yellow">
              <div className="w-2 h-2 bg-neon-yellow animate-pulse rounded-full"></div>
              <span>System Active</span>
            </div>
            <div className="text-gray-500">
              <span className="text-neon-blue">v2.5</span> / Audio Scanner
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;