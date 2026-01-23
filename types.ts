
export enum UnitCategory {
  DISTANCE = 'DISTANCE',
  MASS = 'MASS',
  VELOCITY = 'VELOCITY',
  ENERGY = 'ENERGY',
}

export interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  factor: string; // Base multiplier relative to SI base unit
  description: string;
}

export interface ConversionResult {
  value: string;
  formatted: string;
  fraction?: string; // e.g., "3/4"
  formula: string;
  warnings: string[];
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  category: UnitCategory;
  fromValue: string;
  fromUnit: string;
  toValue: string;
  toUnit: string;
}
