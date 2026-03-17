# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Vite HMR)
npm run build      # tsc -b && vite build
npm run lint       # ESLint
npm run preview    # Preview production build
```

No test runner is configured — the project has no tests yet.

## Architecture

React 19 SPA that calculates French auto-entrepreneur (micro-entrepreneur) taxes for 2025.

**Data flow:**
```
App.tsx (TaxInputs state)
  → calculateTaxes() [src/lib/tax-calculator.ts]
  → TaxResults component [src/components/TaxResults.tsx]
```

**State shape** (`TaxInputs` in `src/types/tax.ts`):
- `activityTypeId` — one of 4 French activity categories (BIC vente, BIC services, BNC SSI, BNC CIPAV)
- `chiffreAffaires` — annual revenue
- `versementLiberatoireEnabled` — flat-rate income tax option (requires revenue ≤ €28,797/part fiscale)
- `acreEnabled` — 50% social contribution reduction for year 1
- `isFirstYear` — affects CFE exemption display
- `purchases[]` — professional purchases for TVA deduction

**Calculation order** in `tax-calculator.ts`:
1. Social contributions (`cotisationsSociales`) = CA × activity rate, halved if ACRE
2. CFP (training levy) = CA × activity CFP rate
3. Income tax: versement libératoire (CA × flat rate) OR progressive brackets applied to (CA − abattement forfaitaire)
4. TVA: compare CA to franchise thresholds; if subject → collectée − déductible from purchases
5. Net revenue = CA − all charges

**2025 progressive income tax brackets** (single taxpayer, coded in `tax-calculator.ts`):
- 0% up to €11,497 — 11% up to €29,315 — 30% up to €83,823 — 41% up to €180,294 — 45% above

**Constants** (`src/constants/tax-rates.ts`): all 2025 thresholds, rates (cotisations, versement libératoire, abattement, CFP), and TVA franchise thresholds per activity type.

**UI layout:** 2-column grid — form inputs (left), tabbed results (right). Tabs: Cotisations sociales / Impôt sur le revenu / TVA / CFE & Informations.

**Component library:** Shadcn/Radix UI primitives under `src/components/ui/` — do not modify these generated files.

**Path alias:** `@` maps to `./src` (configured in `vite.config.ts` and `tsconfig`).
