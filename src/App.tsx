import { useState, useMemo } from "react";
import type { TaxInputs, Purchase } from "@/types/tax";
import type { ActivityTypeId } from "@/constants/tax-rates";
import { calculateTaxes } from "@/lib/tax-calculator";
import { ActivityTypeSelector } from "@/components/ActivityTypeSelector";
import { RevenueInput } from "@/components/RevenueInput";
import { PurchasesSection } from "@/components/PurchasesSection";
import { TaxResults } from "@/components/TaxResults";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calculator, BookOpen } from "lucide-react";
import { ACTIVITY_TYPES } from "@/constants/tax-rates";

const DEFAULT_INPUTS: TaxInputs = {
  activityTypeId: "bnc_ssi",
  chiffreAffaires: 0,
  versementLiberatoireEnabled: false,
  acreEnabled: false,
  isFirstYear: false,
  purchases: [],
};

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b border-[hsl(var(--border))] bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-[hsl(var(--primary))]">
            <Calculator className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none">Calculateur Auto-Entrepreneur</h1>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
              Taux 2025 · Sources : Urssaf, impots.gouv.fr
            </p>
          </div>
          <div className="ml-auto hidden sm:flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Données mises à jour pour 2025</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Colonne gauche : saisie */}
          <div className="space-y-6">
            {/* Type d'activité */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">1. Type d'activité</CardTitle>
                <CardDescription>
                  Le type d'activité détermine vos taux de cotisations et vos plafonds.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ActivityTypeSelector
                  value={inputs.activityTypeId}
                  onChange={(v: ActivityTypeId) => update("activityTypeId", v)}
                />
              </CardContent>
            </Card>

            {/* Chiffre d'affaires & options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">2. Chiffre d'affaires & options</CardTitle>
                <CardDescription>
                  Renseignez votre CA annuel et activez les options qui vous concernent.
                </CardDescription>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>

            {/* Achats professionnels */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">3. Achats professionnels</CardTitle>
                <CardDescription>
                  Si vous êtes assujetti à la TVA, renseignez vos achats pour calculer la TVA déductible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PurchasesSection
                  purchases={inputs.purchases}
                  onPurchasesChange={(v: Purchase[]) => update("purchases", v)}
                  isSubjectToTVA={results?.tva.isSubjectToTVA ?? false}
                />
              </CardContent>
            </Card>
          </div>

          {/* Colonne droite : résultats */}
          <div className="lg:sticky lg:top-24">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Résultats du calcul
                </CardTitle>
                <CardDescription>
                  Estimations basées sur les taux 2025. Consultez un expert-comptable pour votre situation personnelle.
                </CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-4">
                <TaxResults
                  results={results}
                  chiffreAffaires={inputs.chiffreAffaires}
                  isFirstYear={inputs.isFirstYear}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer disclaimer */}
        <div className="mt-8 text-center text-xs text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
          <p>
            ⚠️ Cet outil est fourni à titre indicatif. Les calculs sont des estimations basées sur
            les taux 2025 (Urssaf, impots.gouv.fr). Pour votre situation fiscale personnelle,
            consultez un expert-comptable ou le service des impôts aux entreprises (SIE).
          </p>
        </div>
      </main>
    </div>
  );
}
