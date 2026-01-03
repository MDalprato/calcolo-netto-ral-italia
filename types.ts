
export interface TaxInputs {
  ral: number;
  months: number;
  region: string;
  isDependent: boolean;
  hasChildren: boolean;
  isMarried: boolean;
}

export interface TaxResults {
  ral: number;
  inps: number;
  taxableIncome: number;
  irpef: number;
  regionalTax: number;
  municipalTax: number;
  deductions: number;
  annualNet: number;
  monthlyNet: number;
  taxWedge: number;
}

export const REGIONS = [
  "Abruzzo", "Basilicata", "Calabria", "Campania", "Emilia-Romagna",
  "Friuli Venezia Giulia", "Lazio", "Liguria", "Lombardia", "Marche",
  "Molise", "Piemonte", "Puglia", "Sardegna", "Sicilia", "Toscana",
  "Trentino-Alto Adige", "Umbria", "Valle d'Aosta", "Veneto"
];
