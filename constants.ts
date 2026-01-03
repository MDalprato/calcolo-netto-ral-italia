
/**
 * IRPEF Brackets 2024 (Simplification)
 */
export const IRPEF_BRACKETS_2024 = [
  { limit: 28000, rate: 0.23 },
  { limit: 50000, rate: 0.35 },
  { limit: Infinity, rate: 0.43 }
];

export const INPS_RATE_EMPLOYEE = 0.0919;
export const REGIONAL_ADDITIONAL_AVG = 0.0161;
export const MUNICIPAL_ADDITIONAL_AVG = 0.008;

// For charting
export const BREAKDOWN_COLORS = {
  NET: '#3b82f6',
  IRPEF: '#ef4444',
  INPS: '#10b981',
  ADDIZIONALI: '#f59e0b',
  DETRAZIONI: '#8b5cf6'
};
