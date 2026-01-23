
import React from 'react';

interface HoloInputProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  placeholder?: string;
  type?: string;
}

const HoloInput: React.FC<HoloInputProps> = ({ value, onChange, label, placeholder, type = "text" }) => {
  return (
    <div className="flex flex-col space-y-1">
      {label && <label className="font-mono text-[10px] uppercase text-white/40 tracking-tighter">{label}</label>}
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 font-mono text-neon-cyan focus:outline-none focus:border-neon-cyan/60 focus:bg-white/10 transition-all shadow-inner"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1 h-3 bg-neon-cyan/20 rounded-full"></div>
      </div>
    </div>
  );
};

export default HoloInput;
