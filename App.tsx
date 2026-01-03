
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calculator, 
  Euro, 
  Info, 
  ArrowRight, 
  TrendingDown, 
  PieChart as PieChartIcon,
  MessageSquare,
  Sparkles,
  ChevronDown,
  Building2
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { TaxInputs, TaxResults, REGIONS } from './types';
import { calculateTaxes } from './services/taxCalculator';
import { getTaxAdvice } from './services/geminiService';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#6366f1'];

const App: React.FC = () => {
  const [inputs, setInputs] = useState<TaxInputs>({
    ral: 30000,
    months: 13,
    region: 'Lombardia',
    isDependent: true,
    hasChildren: false,
    isMarried: false,
  });

  const [results, setResults] = useState<TaxResults | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);

  const performCalculation = () => {
    const res = calculateTaxes(inputs);
    setResults(res);
  };

  useEffect(() => {
    performCalculation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    setInputs(prev => ({ ...prev, [name]: val }));
  };

  const getAnalysis = async () => {
    if (!results) return;
    setLoadingAi(true);
    const advice = await getTaxAdvice(results, inputs);
    setAiAnalysis(advice);
    setLoadingAi(false);
  };

  const chartData = useMemo(() => {
    if (!results) return [];
    return [
      { name: 'Netto Annuale', value: Math.round(results.annualNet) },
      { name: 'IRPEF', value: Math.round(results.irpef) },
      { name: 'INPS', value: Math.round(results.inps) },
      { name: 'Addizionali', value: Math.round(results.regionalTax + results.municipalTax) },
    ];
  }, [results]);

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Calculator className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Stipendio<span className="text-blue-600">Netto</span></h1>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1"><Info size={14} /> Aggiornato 2024</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form Section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Euro className="text-blue-600 w-5 h-5" />
                Configurazione RAL
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reddito Annuo Lordo (RAL)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      name="ral"
                      value={inputs.ral}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-lg font-semibold"
                      placeholder="es. 30000"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">€</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mensilità</label>
                    <select 
                      name="months"
                      value={inputs.months}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value={12}>12 Mesi</option>
                      <option value={13}>13 Mesi</option>
                      <option value={14}>14 Mesi</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Regione</label>
                    <select 
                      name="region"
                      value={inputs.region}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <button 
                onClick={performCalculation}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                Calcola Netto <ArrowRight size={18} />
              </button>
            </div>

            {/* Quick Summary Card */}
            {results && (
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl">
                <p className="text-blue-100 text-sm font-medium opacity-80 mb-1 uppercase tracking-wider">Netto Mensile Stimato</p>
                <div className="text-4xl font-extrabold flex items-baseline gap-1">
                  {results.monthlyNet.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}
                  <span className="text-lg font-normal opacity-70">/mese</span>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-sm">
                  <span>Netto Annuale:</span>
                  <span className="font-bold">{results.annualNet.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</span>
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="lg:col-span-8 space-y-6">
            {results ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Visual Breakdown */}
                  <div className="bg-white rounded-2xl border p-6 flex flex-col items-center">
                    <h3 className="text-lg font-bold text-gray-900 self-start mb-6 flex items-center gap-2">
                      <PieChartIcon className="text-blue-600" size={20} />
                      Breakdown Tasse
                    </h3>
                    <div className="w-full h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value: number) => `€${value.toLocaleString()}`}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                          />
                          <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Detailed Numbers */}
                  <div className="bg-white rounded-2xl border p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <Building2 className="text-blue-600" size={20} />
                      Voci in Busta Paga
                    </h3>
                    <div className="space-y-4">
                      <DetailRow label="RAL (Lordo)" value={results.ral} isMain />
                      <DetailRow label="Contributi INPS (Dip.)" value={-results.inps} isNegative />
                      <DetailRow label="Imponibile IRPEF" value={results.taxableIncome} />
                      <DetailRow label="IRPEF Lorda" value={-(results.irpef + results.deductions)} isNegative />
                      <DetailRow label="Detrazioni Lavoro" value={results.deductions} isPositive />
                      <DetailRow label="Addizionale Reg./Com." value={-(results.regionalTax + results.municipalTax)} isNegative />
                      <div className="pt-4 border-t">
                        <DetailRow label="NETTO ANNUALE" value={results.annualNet} isResult />
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Assistant Section */}
                <div className="bg-white rounded-2xl border border-blue-100 overflow-hidden shadow-sm">
                  <div className="bg-blue-50/50 px-6 py-4 flex items-center justify-between border-b border-blue-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                        <Sparkles className="text-white w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 leading-none">Assistente AI</h4>
                        <p className="text-xs text-gray-500 mt-1">Analisi e ottimizzazione fiscale</p>
                      </div>
                    </div>
                    {!aiAnalysis && !loadingAi && (
                      <button 
                        onClick={getAnalysis}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                      >
                        Genera Analisi <ChevronDown size={14} />
                      </button>
                    )}
                  </div>
                  <div className="p-6">
                    {loadingAi ? (
                      <div className="flex flex-col items-center justify-center py-8 space-y-3">
                        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                        <p className="text-sm text-gray-500 animate-pulse">Analisi in corso con Gemini...</p>
                      </div>
                    ) : aiAnalysis ? (
                      <div className="prose prose-blue prose-sm max-w-none">
                        <div className="flex gap-4">
                          <div className="flex-1 bg-slate-50 p-4 rounded-xl text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {aiAnalysis}
                          </div>
                        </div>
                        <button 
                          onClick={() => setAiAnalysis('')}
                          className="mt-4 text-xs font-medium text-gray-400 hover:text-blue-600 flex items-center gap-1"
                        >
                          <TrendingDown size={12} /> Azzera analisi
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                        <div className="bg-blue-100/50 p-3 rounded-full">
                          <MessageSquare className="text-blue-600 w-6 h-6" />
                        </div>
                        <p className="text-sm text-gray-500 max-w-sm">
                          Clicca su "Genera Analisi" per ricevere consigli personalizzati sulla tua situazione fiscale e suggerimenti per aumentare il netto.
                        </p>
                        <button 
                          onClick={getAnalysis}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
                        >
                          Chiedi a Gemini
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-4">
                  <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto">
                    <Calculator className="text-blue-600 w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Inizia il Calcolo</h3>
                    <p className="text-gray-500 max-w-xs mx-auto">Inserisci la tua RAL per visualizzare il breakdown completo dello stipendio netto.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer Disclaimer */}
      <footer className="max-w-7xl mx-auto px-4 text-center mt-12 text-gray-400 text-xs">
        <p>
          Questo strumento fornisce una stima indicativa basata sulle aliquote IRPEF 2024. 
          I risultati non costituiscono consulenza finanziaria ufficiale.
        </p>
      </footer>
    </div>
  );
};

const DetailRow: React.FC<{ 
  label: string; 
  value: number; 
  isMain?: boolean; 
  isResult?: boolean; 
  isNegative?: boolean; 
  isPositive?: boolean; 
}> = ({ label, value, isMain, isResult, isNegative, isPositive }) => (
  <div className={`flex justify-between items-center ${isMain ? 'font-bold text-gray-900' : isResult ? 'font-black text-xl text-blue-600' : 'text-sm text-gray-600'}`}>
    <span>{label}</span>
    <span className={`${isNegative ? 'text-red-500' : isPositive ? 'text-green-600' : ''}`}>
      {value.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}
    </span>
  </div>
);

export default App;
