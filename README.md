# Calcolo Netto RAL Italia

App React + Vite per stimare il netto annuale e mensile partendo dalla RAL, con grafici e configurazioni fiscali aggiornabili.

## Requisiti
- Node.js 20+

## Avvio rapido
1. Installa dipendenze:
   `npm install`
2. Crea il file `.env.local` con la tua chiave:
   `GEMINI_API_KEY=...`
3. Avvia in locale:
   `npm run dev`

## Build e preview
- Build produzione: `npm run build`
- Preview produzione: `npm run preview`

## Deploy su GitHub Pages
Il workflow in `.github/workflows/deploy.yml` pubblica automaticamente su GitHub Pages a ogni push su `main`.

Passi consigliati:
1. Aggiungi il secret `GEMINI_API_KEY` in GitHub (Settings -> Secrets and variables -> Actions).
2. Imposta Pages su "GitHub Actions" (Settings -> Pages).
3. Se il repo e` una project page, imposta `base` in `vite.config.ts` con `/<nome-repo>/` per i path corretti.

## Struttura
- `App.tsx`: UI principale
- `services/`: logica di calcolo e integrazione servizi
- `vite.config.ts`: configurazione Vite e variabili di build
