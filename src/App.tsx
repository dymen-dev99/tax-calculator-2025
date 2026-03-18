import { useState, useMemo, type ReactNode } from "react";
import type { TaxInputs, Purchase } from "@/types/tax";
import type { ActivityTypeId } from "@/constants/tax-rates";
import { calculateTaxes } from "@/lib/tax-calculator";
import { ActivityTypeSelector } from "@/components/ActivityTypeSelector";
import { RevenueInput } from "@/components/RevenueInput";
import { PurchasesSection } from "@/components/PurchasesSection";
import { TaxResults } from "@/components/TaxResults";
import { Calculator, Zap, Shield } from "lucide-react";
import { ACTIVITY_TYPES } from "@/constants/tax-rates";

const DEFAULT_INPUTS: TaxInputs = {
  activityTypeId: "bnc_ssi",
  chiffreAffaires: 0,
  versementLiberatoireEnabled: false,
  acreEnabled: false,
  isFirstYear: false,
  purchases: [],
};

function SectionCard({
  number,
  title,
  subtitle,
  children,
}: {
  number: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="border border-[hsl(var(--border))] bg-[hsl(var(--card))] relative">
      {/* Gold top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold)/0.5)] to-transparent" />

      {/* Header */}
      <div className="px-6 pt-5 pb-4 flex items-start gap-4 border-b border-[hsl(var(--border))]">
        <div className="flex-shrink-0">
          <div className="font-display text-4xl text-[hsl(var(--gold)/0.25)] leading-none select-none">
            {number}
          </div>
        </div>
        <div>
          <h2 className="font-display text-lg text-[hsl(var(--foreground))] leading-none tracking-widest uppercase">
            {title}
          </h2>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1.5 leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

export default function App() {
  const [inputs, setInputs] = useState<TaxInputs>(DEFAULT_INPUTS);

  const results = useMemo(() => {
    if (inputs.chiffreAffaires <= 0) return null;
    try {
      return calculateTaxes(inputs);
    } catch {
      return null;
    }
  }, [inputs]);

  const activityType = ACTIVITY_TYPES.find((a) => a.id === inputs.activityTypeId);

  function update<K extends keyof TaxInputs>(key: K, value: TaxInputs[K]) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 50% -10%, hsl(42 65% 52% / 0.06) 0%, transparent 60%), hsl(var(--background))",
      }}
    >
      {/* ── HEADER ── */}
      <header className="border-b border-[hsl(var(--border))] sticky top-0 z-20 bg-[hsl(0_0%_4%/0.95)] backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-5">
            {/* Logo */}
            <div className="relative flex-shrink-0">
              <div className="h-10 w-10 border border-[hsl(var(--gold)/0.4)] bg-[hsl(var(--gold)/0.05)] flex items-center justify-center">
                <Calculator className="h-5 w-5 text-[hsl(var(--gold))]" />
              </div>
              <span className="absolute -top-px -left-px w-3 h-3 border-t border-l border-[hsl(var(--gold))]" />
              <span className="absolute -bottom-px -right-px w-3 h-3 border-b border-r border-[hsl(var(--gold))]" />
            </div>

            {/* Title */}
            <div>
              <h1 className="font-display text-2xl sm:text-3xl text-[hsl(var(--foreground))] leading-none tracking-widest">
                CALCULATEUR AUTO-ENTREPRENEUR
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="h-px w-6 bg-[hsl(var(--gold))]" />
                <span className="font-mono-chad text-[10px] text-[hsl(var(--gold))] uppercase tracking-widest">
                  Taux 2025 · Urssaf · impots.gouv.fr
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="ml-auto hidden sm:flex items-center gap-4">
              <div className="flex items-center gap-2 border border-[hsl(var(--border))] px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--green-neon))] animate-pulse" />
                <span className="font-mono-chad text-[10px] text-[hsl(var(--muted-foreground))] uppercase tracking-widest">
                  Données 2025 actives
                </span>
              </div>
              <div className="flex items-center gap-2 border border-[hsl(var(--border))] px-3 py-1.5">
                <Shield className="h-3 w-3 text-[hsl(var(--muted-foreground))]" />
                <span className="font-mono-chad text-[10px] text-[hsl(var(--muted-foreground))] uppercase tracking-widest">
                  Données locales
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gold line */}
        <div className="h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold)/0.3)] to-transparent" />
      </header>

      {/* ── MAIN ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {/* ── LEFT: INPUTS ── */}
          <div className="space-y-4 animate-fade-in-up">
            <SectionCard
              number="01"
              title="Type d'activité"
              subtitle="Le type détermine vos taux de cotisations sociales et vos plafonds de CA."
            >
              <ActivityTypeSelector
                value={inputs.activityTypeId}
                onChange={(v: ActivityTypeId) => update("activityTypeId", v)}
              />
            </SectionCard>

            <SectionCard
              number="02"
              title="Chiffre d'affaires & options"
              subtitle="Renseignez votre CA annuel et activez les options qui vous concernent."
            >
              <RevenueInput
                chiffreAffaires={inputs.chiffreAffaires}
                onChiffreAffairesChange={(v) => update("chiffreAffaires", v)}
                versementLiberatoireEnabled={inputs.versementLiberatoireEnabled}
                onVersementLiberatoireChange={(v) => update("versementLiberatoireEnabled", v)}
                acreEnabled={inputs.acreEnabled}
                onAcreChange={(v) => update("acreEnabled", v)}
                isFirstYear={inputs.isFirstYear}
                onIsFirstYearChange={(v) => update("isFirstYear", v)}
                plafondCA={activityType?.plafondCA ?? 77700}
              />
            </SectionCard>

            <SectionCard
              number="03"
              title="Achats professionnels"
              subtitle="Si vous êtes assujetti à la TVA, renseignez vos achats pour calculer la TVA déductible."
            >
              <PurchasesSection
                purchases={inputs.purchases}
                onPurchasesChange={(v: Purchase[]) => update("purchases", v)}
                isSubjectToTVA={results?.tva.isSubjectToTVA ?? false}
              />
            </SectionCard>
          </div>

          {/* ── RIGHT: RESULTS ── */}
          <div className="lg:sticky lg:top-24">
            <div
              className="border border-[hsl(var(--border))] bg-[hsl(var(--card))] relative"
              style={{ boxShadow: "0 0 40px hsl(var(--gold) / 0.04), 0 0 80px hsl(var(--gold) / 0.02)" }}
            >
              {/* Gold top bar */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold)/0.6)] to-transparent" />

              {/* Corner brackets */}
              <span className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[hsl(var(--gold))]" />
              <span className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[hsl(var(--gold))]" />
              <span className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[hsl(var(--gold)/0.4)]" />
              <span className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[hsl(var(--gold)/0.4)]" />

              {/* Results header */}
              <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-[hsl(var(--border))]">
                <div className="flex items-center gap-3">
                  <Zap className="h-4 w-4 text-[hsl(var(--gold))]" />
                  <h2 className="font-display text-lg tracking-widest text-[hsl(var(--foreground))] uppercase">
                    Résultats du calcul
                  </h2>
                </div>
                <span className="font-mono-chad text-[10px] text-[hsl(var(--muted-foreground))] uppercase tracking-widest border border-[hsl(var(--border))] px-2 py-1">
                  Estimation 2025
                </span>
              </div>

              <div className="px-6 py-5">
                <TaxResults
                  results={results}
                  chiffreAffaires={inputs.chiffreAffaires}
                  isFirstYear={inputs.isFirstYear}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="mt-10 pt-6 border-t border-[hsl(var(--border))]">
          <p className="text-center font-mono-chad text-[11px] text-[hsl(var(--muted-foreground)/0.6)] max-w-2xl mx-auto leading-relaxed tracking-wide">
            ⚠ OUTIL FOURNI À TITRE INDICATIF — Estimations basées sur les taux 2025 (Urssaf, impots.gouv.fr).
            Consultez un expert-comptable ou le SIE pour votre situation personnelle.
          </p>
        </div>
      </main>
    </div>
  );
}
