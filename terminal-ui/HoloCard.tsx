
import React from 'react';

interface HoloCardProps {
  children: React.ReactNode;
  title?: string;
  variant?: 'cyan' | 'amber' | 'crimson';
  className?: string;
}

const HoloCard: React.FC<HoloCardProps> = ({ children, title, variant = 'cyan', className = '' }) => {
  const borderColor = {
    cyan: 'border-neon-cyan/30',
    amber: 'border-neon-amber/30',
    crimson: 'border-neon-crimson/30',
  }[variant];

  const glowColor = {
    cyan: 'shadow-glow-cyan',
    amber: 'shadow-glow-amber',
    crimson: 'shadow-glow-crimson',
  }[variant];

  const textColor = {
    cyan: 'text-neon-cyan',
    amber: 'text-neon-amber',
    crimson: 'text-neon-crimson',
  }[variant];

  return (
    <div className={`relative group ${className}`}>
      {/* Background Glow */}
      <div className={`absolute -inset-0.5 bg-gradient-to-br from-${variant === 'cyan' ? 'neon-cyan' : variant === 'amber' ? 'neon-amber' : 'neon-crimson'} to-transparent rounded-lg blur opacity-5 group-hover:opacity-15 transition duration-500`}></div>
      
      {/* Main Container */}
      <div className={`relative bg-deep-space/80 backdrop-blur-md border ${borderColor} ${glowColor} rounded-lg p-4 overflow-hidden`}>
        {/* Hex Overlay */}
        <div className="absolute inset-0 hex-grid opacity-10 pointer-events-none"></div>
        
        {title && (
          <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
            <h3 className={`font-mono text-sm tracking-widest uppercase ${textColor}`}>{title}</h3>
            <div className="flex space-x-1">
              <div className={`w-1 h-1 rounded-full ${variant === 'cyan' ? 'bg-neon-cyan' : variant === 'amber' ? 'bg-neon-amber' : 'bg-neon-crimson'} animate-pulse`}></div>
              <div className={`w-1 h-1 rounded-full bg-white/10`}></div>
            </div>
          </div>
        )}
        
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default HoloCard;
