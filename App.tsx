
import React, { useState, useEffect, useMemo, useRef } from 'react';
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

const COLORS = ['#22d3ee', '#38bdf8', '#a78bfa', '#34d399', '#fbbf24'];

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
  const resultsRef = useRef<HTMLElement | null>(null);

  const performCalculation = () => {
    const res = calculateTaxes(inputs);
    setResults(res);
  };

  useEffect(() => {
    if (results && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [results]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    setInputs(prev => ({ ...prev, [name]: val }));
  };

  // const getAnalysis = async () => {
  //   if (!results) return;
  //   setLoadingAi(true);
  //   const advice = await getTaxAdvice(results, inputs);
  //   setAiAnalysis(advice);
  //   setLoadingAi(false);
  // };

  const chartData = useMemo(() => {
    if (!results) return [];
    return [
      { name: 'Netto Annuale', value: Math.round(results.annualNet) },
      { name: 'IRPEF', value: Math.round(results.irpef) },
      { name: 'INPS', value: Math.round(results.inps) },
      { name: 'Addizionali', value: Math.round(results.regionalTax + results.municipalTax) },
    ];
  }, [results]);

  const tooltipStyle = {
    backgroundColor: '#0f172a',
    color: '#e2e8f0',
    borderRadius: '12px',
    border: '1px solid #1e293b',
    boxShadow: '0 12px 24px rgba(15, 23, 42, 0.4)',
  };

  const legendStyle = {
    color: '#e2e8f0',
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12 dark:bg-slate-900 dark:text-slate-100">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 dark:bg-slate-950/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Calculator className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight dark:text-slate-100">Stipendio<span className="text-blue-600 dark:text-cyan-400">Netto</span></h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-slate-300">
            <span className="hidden sm:flex items-center gap-1"><Info size={14} /> Aggiornato 2026</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-12">
          <section className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              <span className="px-2.5 py-1 rounded-full bg-slate-200/70 text-slate-600 dark:bg-slate-800/80 dark:text-slate-300">Step 1</span>
              Inserisci i dati
            </div>

            <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6 dark:bg-slate-800/70 dark:border-slate-700">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Euro className="text-blue-600 w-5 h-5 dark:text-cyan-400" />
                Configurazione RAL
              </h2>
              
              <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-slate-200">Reddito Annuo Lordo (RAL)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        name="ral"
                        value={inputs.ral}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-lg font-semibold dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 dark:focus:ring-cyan-400"
                        placeholder="es. 30000"
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400">€</div>
                    </div>
                  </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-slate-200">Mensilità</label>
                    <select 
                      name="months"
                      value={inputs.months}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 dark:focus:ring-cyan-400"
                    >
                      <option value={12}>12 Mesi</option>
                      <option value={13}>13 Mesi</option>
                      <option value={14}>14 Mesi</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-slate-200">Regione</label>
                    <select 
                      name="region"
                      value={inputs.region}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 dark:focus:ring-cyan-400"
                    >
                      {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <button 
                onClick={performCalculation}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition-all active:scale-95 dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:shadow-cyan-900/30"
              >
                Calcola Netto <ArrowRight size={18} />
              </button>
              <p className="text-xs text-center text-slate-400 dark:text-slate-500">Dopo il calcolo scenderai automaticamente ai risultati.</p>
            </div>

            {/* Quick Summary Card */}
            {results && (
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl dark:from-cyan-500 dark:to-blue-700">
                <p className="text-blue-100 text-sm font-medium opacity-80 mb-1 uppercase tracking-wider dark:text-cyan-100">Netto Mensile Stimato</p>
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
          </section>

          <section ref={resultsRef} id="risultati" className="scroll-mt-24 space-y-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                <span className="px-2.5 py-1 rounded-full bg-slate-200/70 text-slate-600 dark:bg-slate-800/80 dark:text-slate-300">Step 2</span>
                Risultati
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Il tuo netto, in dettaglio</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
                Una volta calcolato, scorri per vedere il breakdown completo tra tasse, contributi e netto finale.
              </p>
            </div>

            {results ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Visual Breakdown */}
                  <div className="bg-white rounded-2xl border p-6 flex flex-col items-center dark:bg-slate-800/70 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-gray-900 self-start mb-6 flex items-center gap-2 dark:text-slate-100">
                      <PieChartIcon className="text-blue-600 dark:text-cyan-400" size={20} />
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
                            contentStyle={tooltipStyle}
                          />
                          <Legend verticalAlign="bottom" height={36} wrapperStyle={legendStyle}/>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Detailed Numbers */}
                  <div className="bg-white rounded-2xl border p-6 dark:bg-slate-800/70 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 dark:text-slate-100">
                      <Building2 className="text-blue-600 dark:text-cyan-400" size={20} />
                      Voci in Busta Paga
                    </h3>
                    <div className="space-y-4">
                      <DetailRow label="RAL (Lordo)" value={results.ral} isMain />
                      <DetailRow label="Contributi INPS (Dip.)" value={-results.inps} isNegative />
                      <DetailRow label="Imponibile IRPEF" value={results.taxableIncome} />
                      <DetailRow label="IRPEF Lorda" value={-(results.irpef + results.deductions)} isNegative />
                      <DetailRow label="Detrazioni Lavoro" value={results.deductions} isPositive />
                      <DetailRow label="Addizionale Reg./Com." value={-(results.regionalTax + results.municipalTax)} isNegative />
                      <div className="pt-4 border-t dark:border-slate-700">
                        <DetailRow label="NETTO ANNUALE" value={results.annualNet} isResult />
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Assistant Section */}
                {/* <div className="bg-white rounded-2xl border border-blue-100 overflow-hidden shadow-sm">
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
                </div> */}
              </>
            ) : (
              <div className="h-full flex items-center justify-center min-h-[360px] border border-dashed border-slate-200 rounded-3xl dark:border-slate-700/70">
                <div className="text-center space-y-4 px-6">
                  <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto dark:bg-slate-800">
                    <Calculator className="text-blue-600 w-8 h-8 dark:text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Aspetto i tuoi dati</h3>
                    <p className="text-gray-500 max-w-xs mx-auto dark:text-slate-400">Compila il form e premi “Calcola Netto” per vedere grafici e dettagli.</p>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer Disclaimer */}
      <footer className="max-w-7xl mx-auto px-4 text-center mt-12 text-gray-400 text-xs dark:text-slate-500">
        <p>
          Questo strumento fornisce una stima indicativa basata sulle aliquote IRPEF 2026. 
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
  <div className={`flex justify-between items-center ${isMain ? 'font-bold text-gray-900 dark:text-slate-100' : isResult ? 'font-black text-xl text-blue-600 dark:text-cyan-400' : 'text-sm text-gray-600 dark:text-slate-300'}`}>
    <span>{label}</span>
    <span className={`${isNegative ? 'text-red-500 dark:text-rose-400' : isPositive ? 'text-green-600 dark:text-emerald-400' : ''}`}>
      {value.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}
    </span>
  </div>
);

export default App;
