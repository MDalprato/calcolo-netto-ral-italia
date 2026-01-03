
import { TaxInputs, TaxResults } from '../types';

/**
 * Simplified Italian Tax Calculator (2024 Brackets)
 * Warning: Real tax laws are complex. This serves as an accurate estimation tool.
 */
export const calculateTaxes = (inputs: TaxInputs): TaxResults => {
  const { ral, months, region } = inputs;

  // 1. Social Security (INPS) - Usually 9.19% for the employee
  const inpsRate = 0.0919;
  const inps = ral * inpsRate;
  const taxableIncome = ral - inps;

  // 2. IRPEF (2024 Simplified Brackets: 23%, 35%, 43%)
  let irpefBase = 0;
  if (taxableIncome <= 28000) {
    irpefBase = taxableIncome * 0.23;
  } else if (taxableIncome <= 50000) {
    irpefBase = (28000 * 0.23) + (taxableIncome - 28000) * 0.35;
  } else {
    irpefBase = (28000 * 0.23) + (22000 * 0.35) + (taxableIncome - 50000) * 0.43;
  }

  // 3. Deductions (Detrazioni da lavoro dipendente - 2024)
  let deductions = 0;
  if (taxableIncome <= 15000) {
    deductions = 1880;
  } else if (taxableIncome <= 28000) {
    deductions = 1910 + 1190 * (28000 - taxableIncome) / 13000;
  } else if (taxableIncome <= 50000) {
    deductions = 1910 * (50000 - taxableIncome) / 22000;
  } else {
    deductions = 0;
  }

  // Cap IRPEF at 0
  const irpef = Math.max(0, irpefBase - deductions);

  // 4. Regional and Municipal Additions (Averages)
  const regionalRate = 0.016; // Average Italian region
  const municipalRate = 0.008; // Average Italian municipality
  
  const regionalTax = taxableIncome * regionalRate;
  const municipalTax = taxableIncome * municipalRate;

  // 5. Net Calculation
  const annualNet = taxableIncome - irpef - regionalTax - municipalTax;
  const monthlyNet = annualNet / months;

  return {
    ral,
    inps,
    taxableIncome,
    irpef,
    regionalTax,
    municipalTax,
    deductions,
    annualNet,
    monthlyNet,
    taxWedge: ral - annualNet
  };
};
