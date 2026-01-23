
import React from 'react';

interface DataReadoutProps {
  value: string;
  symbol: string;
  fraction?: string;
  formula: string;
  warnings: string[];
}

const DataReadout: React.FC<DataReadoutProps> = ({ value, symbol, fraction, formula, warnings }) => {
  return (
    <div className="space-y-4">
      <div className="bg-black/40 border border-white/5 p-4 rounded-md relative overflow-hidden">
        <div className="font-mono text-[10px] text-white/30 uppercase mb-1">Stabilized Reading</div>
        <div className="flex items-baseline space-x-2">
          <span className="text-4xl font-mono text-white tracking-tighter break-all">
            {value}
          </span>
          <span className="text-neon-cyan font-mono text-xl">{symbol}</span>
        </div>
        
        {fraction && (
          <div className="mt-2 pt-2 border-t border-white/5 flex items-center space-x-2">
            <span className="font-mono text-[10px] text-white/40 uppercase">Fractional Alignment:</span>
            <span className="font-mono text-sm text-neon-amber font-bold">{fraction}</span>
            <span className="font-mono text-[10px] text-neon-amber/60">{symbol}</span>
          </div>
        )}
      </div>

      <div className="bg-white/5 p-3 rounded border-l-2 border-white/20">
        <div className="font-mono text-[10px] text-white/30 uppercase mb-1">Calibration Vector</div>
        <div className="font-mono text-xs text-white/60 italic break-words">
          {formula}
        </div>
      </div>

      {warnings.length > 0 && (
        <div className="space-y-2">
          {warnings.map((w, i) => (
            <div key={i} className="flex items-start space-x-2 text-neon-amber border border-neon-amber/20 bg-neon-amber/5 p-2 rounded animate-pulse">
              <span className="font-bold font-mono">[!]</span>
              <span className="font-mono text-[10px] leading-tight">{w}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DataReadout;
