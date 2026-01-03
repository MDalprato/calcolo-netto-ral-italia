// taxConfig2026.ts
export const TAX_CONFIG_2026 = {
  inps: {
    employeeRate: 0.0919
  },

  irpef: {
    brackets: [
      { upTo: 28000, rate: 0.23 },
      { upTo: 60000, rate: 0.33 },
      { upTo: Infinity, rate: 0.43 }
    ]
  },

  deductions: {
    employee: {
      lowIncomeLimit: 15000,
      midIncomeLimit: 28000,
      highIncomeLimit: 50000,

      lowIncomeAmount: 1880,
      midBaseAmount: 1910,
      midVariableAmount: 1190,
      midRange: 13000,
      highRange: 22000
    }
  },

  additionalTaxes: {
    regionalRate: 0.016,
    municipalRate: 0.008
  }
};
