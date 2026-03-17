import { ACTIVITY_TYPES, type ActivityTypeId } from "@/constants/tax-rates";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface ActivityTypeSelectorProps {
  value: ActivityTypeId;
  onChange: (value: ActivityTypeId) => void;
}

export function ActivityTypeSelector({ value, onChange }: ActivityTypeSelectorProps) {
  const selected = ACTIVITY_TYPES.find((a) => a.id === value);

  return (
    <div className="space-y-3">
      <Label htmlFor="activity-type" className="text-base font-semibold">
        Type d'activité
      </Label>
      <Select value={value} onValueChange={(v) => onChange(v as ActivityTypeId)}>
        <SelectTrigger id="activity-type" className="h-auto py-3">
          <SelectValue placeholder="Choisissez votre type d'activité" />
        </SelectTrigger>
        <SelectContent>
          {ACTIVITY_TYPES.map((type) => (
            <SelectItem key={type.id} value={type.id} className="py-3">
              <div>
                <div className="font-medium">{type.label}</div>
                <div className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                  {type.description}
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selected && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <InfoBadge label="Cotisations sociales" value={`${selected.cotisationsSociales}%`} />
          <InfoBadge label="Plafond CA" value={formatCurrency(selected.plafondCA)} />
          <InfoBadge label="Abattement IR" value={`${selected.abattementForfaitaire}%`} />
          <InfoBadge label="Versement lib." value={`${selected.versementLiberatoire}%`} />
        </div>
      )}
    </div>
  );
}

function InfoBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-[hsl(var(--muted))] px-3 py-2 text-center">
      <div className="text-xs text-[hsl(var(--muted-foreground))]">{label}</div>
      <div className="text-sm font-semibold mt-0.5">{value}</div>
    </div>
  );
}

export { Badge };
