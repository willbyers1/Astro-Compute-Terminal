
import React from 'react';

interface HoloButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  variant?: 'cyan' | 'amber' | 'crimson';
  className?: string;
}

const HoloButton: React.FC<HoloButtonProps> = ({ children, onClick, active, variant = 'cyan', className = '' }) => {
  const styles = {
    cyan: active ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan shadow-glow-cyan' : 'border-neon-cyan/40 text-neon-cyan/80 hover:bg-neon-cyan/10 hover:border-neon-cyan hover:text-neon-cyan',
    amber: active ? 'bg-neon-amber/20 border-neon-amber text-neon-amber shadow-glow-amber' : 'border-neon-amber/40 text-neon-amber/80 hover:bg-neon-amber/10 hover:border-neon-amber hover:text-neon-amber',
    crimson: active ? 'bg-neon-crimson/20 border-neon-crimson text-neon-crimson shadow-glow-crimson' : 'border-neon-crimson/40 text-neon-crimson/80 hover:bg-neon-crimson/10 hover:border-neon-crimson hover:text-neon-crimson',
  }[variant];

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 border font-mono text-xs uppercase tracking-widest transition-all duration-300 rounded ${styles} ${className}`}
    >
      {children}
    </button>
  );
};

export default HoloButton;
