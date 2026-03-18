import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle, Info } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { VERSEMENT_LIBERATOIRE_PLAFOND_PAR_PART } from "@/constants/tax-rates";

interface RevenueInputProps {
  chiffreAffaires: number;
  onChiffreAffairesChange: (value: number) => void;
  versementLiberatoireEnabled: boolean;
  onVersementLiberatoireChange: (value: boolean) => void;
  acreEnabled: boolean;
  onAcreChange: (value: boolean) => void;
  isFirstYear: boolean;
  onIsFirstYearChange: (value: boolean) => void;
  plafondCA: number;
}

export function RevenueInput({
  chiffreAffaires,
  onChiffreAffairesChange,
  versementLiberatoireEnabled,
  onVersementLiberatoireChange,
  acreEnabled,
  onAcreChange,
  isFirstYear,
  onIsFirstYearChange,
  plafondCA,
}: RevenueInputProps) {
  const percentOfPlafond = plafondCA > 0 ? (chiffreAffaires / plafondCA) * 100 : 0;
  const isOver = chiffreAffaires > plafondCA;
  const isNear = !isOver && percentOfPlafond >= 85;

  return (
    <div className="space-y-5">
      {/* ── CA Input ── */}
      <div className="space-y-2">
        <Label
          htmlFor="ca"
          className="font-display text-xs tracking-widest uppercase text-[hsl(var(--gold))]"
        >
          Chiffre d'affaires annuel (HT)
        </Label>
        <div className="relative">
          <Input
            id="ca"
            type="number"
            min={0}
            max={1000000}
            step={100}
            value={chiffreAffaires || ""}
            onChange={(e) => onChiffreAffairesChange(Number(e.target.value))}
            placeholder="Ex: 50000"
            className="pr-8 text-xl h-13 font-mono-chad tracking-wider"
            style={{ height: "3.25rem" }}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono-chad font-bold text-[hsl(var(--gold))] text-sm">
            €
          </span>
        </div>

        {/* Progress bar */}
        {chiffreAffaires > 0 && (
          <div className="space-y-1.5">
            <div className="flex justify-between font-mono-chad text-[10px] text-[hsl(var(--muted-foreground))] tracking-wide uppercase">
              <span>0 €</span>
              <span>Plafond : {formatCurrency(plafondCA)}</span>
            </div>
            <div className="h-1.5 w-full bg-[hsl(var(--border))] overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${Math.min(percentOfPlafond, 100)}%`,
                  background: isOver
                    ? "hsl(var(--red-hot))"
                    : isNear
                    ? "linear-gradient(90deg, hsl(var(--gold)), hsl(42 80% 50%))"
                    : "linear-gradient(90deg, hsl(var(--green-neon)), hsl(152 80% 50%))",
                  boxShadow: isOver
                    ? "0 0 8px hsl(var(--red-hot)/0.6)"
                    : isNear
                    ? "0 0 8px hsl(var(--gold)/0.5)"
                    : "0 0 6px hsl(var(--green-neon)/0.4)",
                }}
              />
            </div>
            {isOver && (
              <div className="flex items-start gap-2 p-2 border border-[hsl(var(--red-hot)/0.3)] bg-[hsl(var(--red-hot)/0.06)]">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-[hsl(var(--red-hot))]" />
                <span className="font-mono-chad text-[11px] text-[hsl(var(--red-hot))] tracking-wide">
                  Plafond dépassé de {formatCurrency(chiffreAffaires - plafondCA)}.
                  Sortie du régime après 2 années consécutives.
                </span>
              </div>
            )}
            {isNear && (
              <div className="flex items-start gap-2 p-2 border border-[hsl(var(--gold)/0.3)] bg-[hsl(var(--gold)/0.05)]">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-[hsl(var(--gold))]" />
                <span className="font-mono-chad text-[11px] text-[hsl(var(--gold))] tracking-wide">
                  Attention : {percentOfPlafond.toFixed(0)}% du plafond atteint.
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Options fiscales ── */}
      <div
        className="space-y-4 p-4 relative"
        style={{
          background: "hsl(var(--surface-2))",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold)/0.3)] to-transparent" />

        <p className="font-display text-xs tracking-widest uppercase text-[hsl(var(--gold))]">
          Options fiscales
        </p>

        <ChadToggle
          id="versement-liberatoire"
          label="Versement libératoire de l'impôt"
          description={`Payer l'IR directement sur votre CA (taux réduit). Éligible si revenu fiscal N-2 ≤ ${formatCurrency(VERSEMENT_LIBERATOIRE_PLAFOND_PAR_PART)} par part fiscale.`}
          checked={versementLiberatoireEnabled}
          onCheckedChange={onVersementLiberatoireChange}
          badge="Recommandé si éligible"
        />

        <div className="h-px bg-[hsl(var(--border))]" />

        <ChadToggle
          id="acre"
          label="ACRE — Exonération 1ère année"
          description="Réduction de 50% des cotisations sociales durant les 12 premiers mois. Automatique jusqu'au 31/12/2025."
          checked={acreEnabled}
          onCheckedChange={onAcreChange}
        />

        <div className="h-px bg-[hsl(var(--border))]" />

        <ChadToggle
          id="first-year"
          label="Première année d'activité"
          description="Exonération de CFE (Cotisation Foncière des Entreprises) la première année."
          checked={isFirstYear}
          onCheckedChange={onIsFirstYearChange}
        />
      </div>
    </div>
  );
}

interface ChadToggleProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
  badge?: string;
}

function ChadToggle({ id, label, description, checked, onCheckedChange, badge }: ChadToggleProps) {
  return (
    <div className="flex items-start gap-3">
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="mt-0.5 flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Label
            htmlFor={id}
            className="text-sm font-medium cursor-pointer text-[hsl(var(--foreground)/0.9)]"
          >
            {label}
          </Label>
          {badge && (
            <span
              className="font-mono-chad text-[10px] uppercase tracking-widest px-1.5 py-0.5"
              style={{
                border: "1px solid hsl(var(--green-neon)/0.4)",
                color: "hsl(var(--green-neon))",
                background: "hsl(var(--green-neon)/0.07)",
              }}
            >
              {badge}
            </span>
          )}
        </div>
        <p className="font-mono-chad text-[11px] text-[hsl(var(--muted-foreground))] mt-1 flex items-start gap-1 tracking-wide leading-relaxed">
          <Info className="h-3 w-3 flex-shrink-0 mt-0.5 text-[hsl(var(--gold)/0.4)]" />
          {description}
        </p>
      </div>
    </div>
  );
}
