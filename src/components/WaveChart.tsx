import React, { useRef, useEffect } from 'react';

interface WaveChartProps {
  data: number[];
  isActive: boolean;
}

const WaveChart: React.FC<WaveChartProps> = ({ data, isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions properly for high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);
    
    if (!isActive) {
      // Draw a flat line with some noise if inactive
      drawInactiveLine(ctx, rect.width, rect.height);
      return;
    }
    
    // Draw the waveform
    drawWaveform(ctx, data, rect.width, rect.height);
    
  }, [data, isActive]);
  
  const drawWaveform = (
    ctx: CanvasRenderingContext2D, 
    data: number[], 
    width: number, 
    height: number
  ) => {
    // Background grid
    drawGrid(ctx, width, height);
    
    const barWidth = width / data.length;
    const centerY = height / 2;
    
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#00f3ff'; // Neon blue for the primary wave
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00f3ff';
    
    // Draw mirrored waveform
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const x = i * barWidth;
      const amplitude = (data[i] / 255) * (height / 2) * 0.8; // Scale to half the canvas height
      
      if (i === 0) {
        ctx.moveTo(x, centerY - amplitude);
      } else {
        ctx.lineTo(x, centerY - amplitude);
      }
    }
    
    for (let i = data.length - 1; i >= 0; i--) {
      const x = i * barWidth;
      const amplitude = (data[i] / 255) * (height / 2) * 0.8;
      ctx.lineTo(x, centerY + amplitude);
    }
    
    ctx.closePath();
    ctx.fillStyle = 'rgba(0, 243, 255, 0.1)';
    ctx.fill();
    ctx.stroke();
    
    // Draw the top line with a different color
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ff00a0'; // Neon pink for highlights
    ctx.shadowColor = '#ff00a0';
    
    for (let i = 0; i < data.length; i++) {
      const x = i * barWidth;
      const amplitude = (data[i] / 255) * (height / 2) * 0.8;
      
      if (i === 0) {
        ctx.moveTo(x, centerY - amplitude);
      } else {
        ctx.lineTo(x, centerY - amplitude);
      }
    }
    
    ctx.stroke();
    
    // Reset shadow for better performance
    ctx.shadowBlur = 0;
  };
  
  const drawInactiveLine = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number
  ) => {
    // Background grid
    drawGrid(ctx, width, height);
    
    const centerY = height / 2;
    
    // Draw a flat line with small random noise
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255, 0, 160, 0.5)'; // Dimmed neon pink
    
    for (let i = 0; i < width; i += 5) {
      const noise = Math.random() * 2 - 1; // Tiny random noise ±1px
      ctx.lineTo(i, centerY + noise);
    }
    
    ctx.stroke();
  };
  
  const drawGrid = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number
  ) => {
    const gridSize = 20;
    
    ctx.strokeStyle = 'rgba(255, 255, 0, 0.1)'; // Very dim yellow
    ctx.lineWidth = 0.5;
    
    // Vertical grid lines
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Draw center line
    ctx.strokeStyle = 'rgba(255, 255, 0, 0.3)'; // Brighter yellow for center line
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
  };
  
  return (
    <div className="relative w-full h-48 bg-black/70 border border-neon-blue rounded-md overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
        style={{ display: 'block' }}
      />
      {!isActive && (
        <div className="absolute inset-0 flex items-center justify-center text-neon-pink font-mono text-sm uppercase opacity-70">
          Awaiting Signal Input
        </div>
      )}
    </div>
  );
};

export default WaveChart;