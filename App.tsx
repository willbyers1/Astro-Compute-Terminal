
import React, { useState, useEffect, useMemo } from 'react';
import { UnitCategory, UnitDefinition, HistoryItem } from './types';
import { UNITS, convert } from './engine/converter';
import HoloCard from './terminal-ui/HoloCard';
import HoloButton from './terminal-ui/HoloButton';
import HoloInput from './terminal-ui/HoloInput';
import DataReadout from './terminal-ui/DataReadout';
import Starfield from './components/Starfield';

const App: React.FC = () => {
  const [category, setCategory] = useState<UnitCategory>(UnitCategory.DISTANCE);
  const [inputValue, setInputValue] = useState<string>("1.0");
  const [fromUnit, setFromUnit] = useState<string>(UNITS[UnitCategory.DISTANCE][0].id);
  const [toUnit, setToUnit] = useState<string>(UNITS[UnitCategory.DISTANCE][UNITS[UnitCategory.DISTANCE].length - 1].id);
  const [precision, setPrecision] = useState<number>(10);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Effect to synchronize units when category changes
  useEffect(() => {
    const availableUnits = UNITS[category];
    if (availableUnits && availableUnits.length > 0) {
      setFromUnit(availableUnits[0].id);
      setToUnit(availableUnits[availableUnits.length - 1].id);
    }
  }, [category]);

  const result = useMemo(() => {
    return convert(inputValue, fromUnit, toUnit, category, precision);
  }, [inputValue, fromUnit, toUnit, category, precision]);

  const handleSaveTrajectory = () => {
    const currentUnits = UNITS[category];
    const fromUnitDef = currentUnits.find(u => u.id === fromUnit);
    const toUnitDef = currentUnits.find(u => u.id === toUnit);
    
    if (!fromUnitDef || !toUnitDef) return;

    const newItem: HistoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      category,
      fromValue: inputValue,
      fromUnit: fromUnitDef.symbol,
      toValue: result.formatted,
      toUnit: toUnitDef.symbol,
    };
    
    setHistory(prev => [newItem, ...prev].slice(0, 10));
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-start p-4 md:p-8 overflow-y-auto">
      <Starfield />
      
      {/* HUD Header */}
      <header className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center mb-12 relative z-10 border-b border-neon-cyan/20 pb-4">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <div className="w-12 h-12 border-2 border-neon-cyan flex items-center justify-center rounded-sm bg-neon-cyan/10">
            <svg className="w-8 h-8 text-neon-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <h1 className="font-mono text-2xl font-bold tracking-[0.2em] text-neon-cyan">ASTRO-COMPUTE</h1>
            <p className="font-mono text-[10px] uppercase text-white/40">Terminal Version 2.5.0-ALPHA // Sector 7G</p>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2">
          {Object.values(UnitCategory).map((cat) => (
            <HoloButton 
              key={cat} 
              active={category === cat}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </HoloButton>
          ))}
        </div>
      </header>

      {/* Main Terminal Grid */}
      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Left Side: Input Controls */}
        <div className="lg:col-span-5 space-y-6">
          <HoloCard title="Vector Configuration">
            <div className="space-y-6">
              <HoloInput 
                label="Scalar Magnitude" 
                value={inputValue} 
                onChange={setInputValue}
                placeholder="Enter value..."
                type="number"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase text-white/40 tracking-tighter">Origin Unit</label>
                  <select 
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-2 font-mono text-xs text-neon-cyan focus:outline-none focus:border-neon-cyan/60"
                  >
                    {UNITS[category].map(u => (
                      <option key={u.id} value={u.id} className="bg-deep-space">{u.name} ({u.symbol})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase text-white/40 tracking-tighter">Destination Unit</label>
                  <select 
                    value={toUnit}
                    onChange={(e) => setToUnit(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-2 font-mono text-xs text-neon-cyan focus:outline-none focus:border-neon-cyan/60"
                  >
                    {UNITS[category].map(u => (
                      <option key={u.id} value={u.id} className="bg-deep-space">{u.name} ({u.symbol})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <label className="font-mono text-[10px] uppercase text-white/40 tracking-tighter">Sensor Calibration</label>
                  <span className="font-mono text-xs text-neon-cyan">{precision} decimals</span>
                </div>
                <input 
                  type="range" 
                  min="2" 
                  max="25" 
                  value={precision} 
                  onChange={(e) => setPrecision(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-neon-cyan"
                />
              </div>

              <HoloButton 
                variant="amber" 
                className="w-full mt-4"
                onClick={handleSaveTrajectory}
              >
                Log Trajectory
              </HoloButton>
            </div>
          </HoloCard>

          <HoloCard title="Unit Data Field" variant="cyan">
            <div className="space-y-3">
              <div className="text-white/60 font-mono text-xs leading-relaxed italic border-l-2 border-neon-cyan/30 pl-3">
                {UNITS[category].find(u => u.id === fromUnit)?.description || 'Selecting Origin...'}
              </div>
              <div className="flex justify-center text-neon-cyan/20 animate-pulse">▼</div>
              <div className="text-white/60 font-mono text-xs leading-relaxed italic border-l-2 border-neon-cyan/30 pl-3">
                {UNITS[category].find(u => u.id === toUnit)?.description || 'Selecting Destination...'}
              </div>
            </div>
          </HoloCard>
        </div>

        {/* Right Side: Results and History */}
        <div className="lg:col-span-7 space-y-6">
          <HoloCard title="Real-time Telemetry" variant={result.warnings.length > 0 ? 'amber' : 'cyan'}>
            <DataReadout 
              value={result.formatted}
              symbol={UNITS[category].find(u => u.id === toUnit)?.symbol || ''}
              fraction={result.fraction}
              formula={result.formula}
              warnings={result.warnings}
            />
          </HoloCard>

          <HoloCard title="Recent Trajectories" variant="cyan">
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {history.length === 0 ? (
                <div className="text-center py-8 opacity-30 font-mono text-sm uppercase tracking-widest">
                  No log entries detected
                </div>
              ) : (
                history.map((item) => (
                  <div key={item.id} className="bg-white/5 border border-white/5 p-3 rounded flex justify-between items-center group hover:bg-white/10 transition-all">
                    <div className="flex flex-col">
                      <span className="font-mono text-[10px] text-white/30">{new Date(item.timestamp).toLocaleTimeString()}</span>
                      <span className="font-mono text-xs text-white/80">
                        {item.fromValue} {item.fromUnit} <span className="text-neon-cyan mx-1">→</span> {item.toValue} {item.toUnit}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-neon-cyan/40 uppercase bg-neon-cyan/5 px-2 py-1 rounded">
                      {item.category}
                    </div>
                  </div>
                ))
              )}
            </div>
          </HoloCard>
        </div>
      </main>

      {/* HUD Footer Decor */}
      <footer className="w-full max-w-6xl mt-12 py-4 border-t border-white/10 flex justify-between items-center relative z-10 text-[10px] font-mono uppercase tracking-[0.3em] opacity-40">
        <div>System Integrity: 100%</div>
        <div className="flex space-x-6">
          <span>Subspace Frequency: 44.1 THz</span>
          <span>Lat: 37.77 / Lon: -122.41</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
