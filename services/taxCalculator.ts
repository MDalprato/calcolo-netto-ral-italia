import { TaxInputs, TaxResults } from '../types';
import { TAX_CONFIG_2026 } from './taxConfig2026';

export const calculateTaxes = (inputs: TaxInputs): TaxResults => {
  const { ral, months } = inputs;
  const { inps, irpef, deductions, additionalTaxes } = TAX_CONFIG_2026;

  // 1. INPS
  const inpsAmount = ral * inps.employeeRate;
  const taxableIncome = ral - inpsAmount;

  // 2. IRPEF progressiva
  let irpefBase = 0;
  let previousLimit = 0;

  for (const bracket of irpef.brackets) {
    const taxablePortion = Math.min(
      Math.max(taxableIncome - previousLimit, 0),
      bracket.upTo - previousLimit
    );

    irpefBase += taxablePortion * bracket.rate;
    previousLimit = bracket.upTo;

    if (taxableIncome <= bracket.upTo) break;
  }

  // 3. Detrazioni lavoro dipendente
  const d = deductions.employee;
  let deduction = 0;

  if (taxableIncome <= d.lowIncomeLimit) {
    deduction = d.lowIncomeAmount;
  } else if (taxableIncome <= d.midIncomeLimit) {
    deduction =
      d.midBaseAmount +
      (d.midVariableAmount * (d.midIncomeLimit - taxableIncome)) / d.midRange;
  } else if (taxableIncome <= d.highIncomeLimit) {
    deduction =
      (d.midBaseAmount * (d.highIncomeLimit - taxableIncome)) / d.highRange;
  }

  const irpefNet = Math.max(0, irpefBase - deduction);

  // 4. Addizionali
  const regionalTax = taxableIncome * additionalTaxes.regionalRate;
  const municipalTax = taxableIncome * additionalTaxes.municipalRate;

  // 5. Netto
  const annualNet =
    taxableIncome - irpefNet - regionalTax - municipalTax;

  return {
    ral,
    inps: inpsAmount,
    taxableIncome,
    irpef: irpefNet,
    regionalTax,
    municipalTax,
    deductions: deduction,
    annualNet,
    monthlyNet: annualNet / months,
    taxWedge: ral - annualNet
  };
};
