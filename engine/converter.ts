
import { UNIVERSAL_CONSTANTS } from './universalConstants';
import { UnitCategory, UnitDefinition, ConversionResult } from '../types';

// Access Decimal from window since we're using CDN
declare const Decimal: any;

export const UNITS: Record<UnitCategory, UnitDefinition[]> = {
  [UnitCategory.DISTANCE]: [
    { id: 'm', name: 'Meters', symbol: 'm', factor: '1', description: 'SI base unit of length.' },
    { id: 'mm', name: 'Millimeters', symbol: 'mm', factor: '0.001', description: 'One thousandth of a meter.' },
    { id: 'km', name: 'Kilometers', symbol: 'km', factor: '1000', description: 'Standard metric distance.' },
    { id: 'pl', name: 'Planck Length', symbol: 'ℓ_P', factor: UNIVERSAL_CONSTANTS.PLANCK_LENGTH, description: 'The scale at which classical physics breaks down.' },
    { id: 'au', name: 'Astronomical Unit', symbol: 'AU', factor: UNIVERSAL_CONSTANTS.AU, description: 'Mean distance between Earth and Sun.' },
    { id: 'ly', name: 'Light Year', symbol: 'ly', factor: UNIVERSAL_CONSTANTS.LY, description: 'Distance light travels in a vacuum in one year.' },
    { id: 'pc', name: 'Parsec', symbol: 'pc', factor: UNIVERSAL_CONSTANTS.PC, description: 'Distance at which one AU subtends an angle of one arcsecond.' },
    { id: 'mpc', name: 'Megaparsec', symbol: 'Mpc', factor: new Decimal(UNIVERSAL_CONSTANTS.PC).mul(1e6).toString(), description: 'One million parsecs.' },
  ],
  [UnitCategory.MASS]: [
    { id: 'kg', name: 'Kilograms', symbol: 'kg', factor: '1', description: 'SI base unit of mass.' },
    { id: 'g', name: 'Grams', symbol: 'g', factor: '0.001', description: 'One thousandth of a kilogram.' },
    { id: 'me', name: 'Electron Mass', symbol: 'mₑ', factor: UNIVERSAL_CONSTANTS.M_ELECTRON, description: 'Rest mass of an electron.' },
    { id: 't', name: 'Tonnes', symbol: 't', factor: '1000', description: 'Metric ton.' },
    { id: 'me_earth', name: 'Earth Mass', symbol: 'M⊕', factor: UNIVERSAL_CONSTANTS.M_EARTH, description: 'Mass of the planet Earth.' },
    { id: 'mj', name: 'Jupiter Mass', symbol: 'Mⱼ', factor: UNIVERSAL_CONSTANTS.M_JUPITER, description: 'Mass of the planet Jupiter.' },
    { id: 'ms', name: 'Solar Mass', symbol: 'M⊙', factor: UNIVERSAL_CONSTANTS.M_SOLAR, description: 'Mass of the Sun.' },
  ],
  [UnitCategory.VELOCITY]: [
    { id: 'ms', name: 'Meters/Sec', symbol: 'm/s', factor: '1', description: 'Standard velocity.' },
    { id: 'kmh', name: 'Kilometers/Hour', symbol: 'km/h', factor: '0.2777777778', description: 'Common terrestrial velocity unit.' },
    { id: 'kms', name: 'Kilometers/Sec', symbol: 'km/s', factor: '1000', description: 'Planetary escape velocity scales.' },
    { id: 'c', name: 'Light Speed', symbol: 'c', factor: UNIVERSAL_CONSTANTS.C, description: 'Cosmic speed limit.' },
    { id: 'w1', name: 'Warp Factor 1', symbol: 'W1', factor: UNIVERSAL_CONSTANTS.C, description: 'Equivalent to c.' },
    { id: 'w3', name: 'Warp Factor 3', symbol: 'W3', factor: new Decimal(UNIVERSAL_CONSTANTS.C).mul(Math.pow(3, 3)).toString(), description: 'Theoretical faster-than-light travel.' },
    { id: 'w9', name: 'Warp Factor 9', symbol: 'W9', factor: new Decimal(UNIVERSAL_CONSTANTS.C).mul(Math.pow(9, 3)).toString(), description: 'High-energy warp transit.' },
  ],
  [UnitCategory.ENERGY]: [
    { id: 'j', name: 'Joules', symbol: 'J', factor: '1', description: 'SI unit of energy.' },
    { id: 'ev', name: 'Electronvolts', symbol: 'eV', factor: '1.60218e-19', description: 'Energy gained by an electron.' },
    { id: 'mev', name: 'Megaelectronvolts', symbol: 'MeV', factor: '1.60218e-13', description: 'Nuclear energy scales.' },
    { id: 'pe', name: 'Planck Energy', symbol: 'E_p', factor: '1.956e9', description: 'Energy scale of quantum gravity.' },
    { id: 'foe', name: 'Supernova (Bethe)', symbol: 'foe', factor: '1e44', description: 'Approximate energy of a supernova.' },
  ]
};

/**
 * Detects if a decimal value can be represented as a clean fraction a/b for b up to 64.
 */
function toSimpleFraction(d: any): string | undefined {
  if (d.isInteger() || d.isZero()) return undefined;
  
  // Only check for reasonably small denominators
  for (let den = 2; den <= 64; den++) {
    const num = d.mul(den);
    // Use a small epsilon for floating point issues
    if (num.sub(num.round()).abs().lt(1e-12)) {
      const numerator = num.round().toString();
      // Only return if it's a "clean" numerator
      return `${numerator}/${den}`;
    }
  }
  return undefined;
}

export const convert = (
  value: string,
  fromId: string,
  toId: string,
  category: UnitCategory,
  precision: number = 10
): ConversionResult => {
  try {
    if (!value || isNaN(Number(value))) {
      return { value: '0', formatted: '0', formula: 'Invalid Input', warnings: [] };
    }

    const categoryUnits = UNITS[category];
    const fromUnit = categoryUnits.find(u => u.id === fromId);
    const toUnit = categoryUnits.find(u => u.id === toId);

    // Guard against category mismatch during state transitions
    if (!fromUnit || !toUnit) {
      return { value: '0', formatted: '---', formula: 'Recalibrating Vectors...', warnings: [] };
    }

    const dValue = new Decimal(value);
    const dFromFactor = new Decimal(fromUnit.factor);
    const dToFactor = new Decimal(toUnit.factor);

    // Convert to base, then to target
    const baseValue = dValue.mul(dFromFactor);
    const resultValue = baseValue.div(dToFactor);

    const warnings: string[] = [];
    const fraction = toSimpleFraction(resultValue);

    // Logic Checks
    if (category === UnitCategory.VELOCITY) {
      const velocityInC = baseValue.div(UNIVERSAL_CONSTANTS.C);
      if (velocityInC.gt(0.99) && velocityInC.lte(1.0)) {
        warnings.push("RELATIVISTIC EFFECTS CRITICAL: Time dilation significant.");
      } else if (velocityInC.gt(1.0) && !toUnit.id.startsWith('w')) {
        warnings.push("CAUTION: Physical limit 'c' exceeded without subspace field.");
      }
    }

    return {
      value: resultValue.toString(),
      formatted: resultValue.toSignificantDigits(precision).toString(),
      fraction,
      formula: `(${value} ${fromUnit.symbol} × ${fromUnit.factor}) / ${toUnit.factor}`,
      warnings
    };
  } catch (error) {
    console.error("Critical computation failure:", error);
    return { 
      value: '0', 
      formatted: 'ERR', 
      formula: 'CORE_ENGINE_FAILURE', 
      warnings: ["SYSTEM ERROR: Terminal recalibration required."] 
    };
  }
};
