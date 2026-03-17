import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
    <div className="space-y-6">
      {/* Chiffre d'affaires */}
      <div className="space-y-2">
        <Label htmlFor="ca" className="text-base font-semibold">
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
            className="pr-8 text-lg h-12"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] font-medium">
            €
          </span>
        </div>

        {/* Barre de progression du plafond */}
        {chiffreAffaires > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-[hsl(var(--muted-foreground))]">
              <span>0 €</span>
              <span>Plafond : {formatCurrency(plafondCA)}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-[hsl(var(--muted))] overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  isOver ? "bg-red-500" : isNear ? "bg-amber-500" : "bg-green-500"
                }`}
                style={{ width: `${Math.min(percentOfPlafond, 100)}%` }}
              />
            </div>
            {isOver && (
              <div className="flex items-center gap-1.5 text-sm text-red-600 font-medium">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>
                  Plafond dépassé de {formatCurrency(chiffreAffaires - plafondCA)}. Vous sortez du
                  régime micro-entrepreneur après 2 années consécutives de dépassement.
                </span>
              </div>
            )}
            {isNear && (
              <div className="flex items-center gap-1.5 text-sm text-amber-600 font-medium">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>
                  Attention : vous approchez du plafond ({percentOfPlafond.toFixed(0)}%).
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Options fiscales */}
      <div className="space-y-4 rounded-lg border border-[hsl(var(--border))] p-4">
        <p className="text-sm font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
          Options fiscales
        </p>

        <ToggleOption
          id="versement-liberatoire"
          label="Versement libératoire de l'impôt"
          description={`Payer l'IR directement sur votre CA (taux réduit). Éligible si votre revenu fiscal de référence N-2 ≤ ${formatCurrency(VERSEMENT_LIBERATOIRE_PLAFOND_PAR_PART)} par part fiscale.`}
          checked={versementLiberatoireEnabled}
          onCheckedChange={onVersementLiberatoireChange}
          badge="Recommandé si éligible"
        />

        <ToggleOption
          id="acre"
          label="ACRE (exonération 1ère année)"
          description="Réduction de 50% des cotisations sociales durant les 12 premiers mois d'activité. Automatique jusqu'au 31/12/2025."
          checked={acreEnabled}
          onCheckedChange={onAcreChange}
        />

        <ToggleOption
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

interface ToggleOptionProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
  badge?: string;
}

function ToggleOption({ id, label, description, checked, onCheckedChange, badge }: ToggleOptionProps) {
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
          <Label htmlFor={id} className="font-medium cursor-pointer">
            {label}
          </Label>
          {badge && (
            <Badge variant="success" className="text-xs">
              {badge}
            </Badge>
          )}
        </div>
        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5 flex items-start gap-1">
          <Info className="h-3 w-3 flex-shrink-0 mt-0.5" />
          {description}
        </p>
      </div>
    </div>
  );
}
