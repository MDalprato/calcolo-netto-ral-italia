
import { GoogleGenAI } from "@google/genai";
import { TaxResults, TaxInputs } from "../types";

export const getTaxAdvice = async (results: TaxResults, inputs: TaxInputs): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Agisci come un esperto consulente fiscale italiano (commercialista). 
    Analizza i seguenti dati salariali e fornisci un breve riassunto (max 200 parole) in italiano.
    
    Dati:
    - RAL: ${results.ral}€
    - Mesi: ${inputs.months}
    - Stipendio Netto Mensile: ${results.monthlyNet.toFixed(2)}€
    - Tasse totali (IRPEF + Addizionali + INPS): ${results.taxWedge.toFixed(2)}€
    - Regione: ${inputs.region}
    
    Suggerisci brevemente se ci sono opportunità di ottimizzazione fiscale (es. Fondo Cometa, Welfare Aziendale, Rientro dei Cervelli se applicabile, Fringe Benefits). 
    Commenta anche se lo stipendio è sopra o sotto la media italiana per quella fascia.
    Usa un tono professionale e rassicurante.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Non è stato possibile generare un'analisi al momento.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Errore nella comunicazione con l'assistente AI.";
  }
};
