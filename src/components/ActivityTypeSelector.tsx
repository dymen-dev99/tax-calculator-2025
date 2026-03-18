import { ACTIVITY_TYPES, type ActivityTypeId } from "@/constants/tax-rates";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";

interface ActivityTypeSelectorProps {
  value: ActivityTypeId;
  onChange: (value: ActivityTypeId) => void;
}

export function ActivityTypeSelector({ value, onChange }: ActivityTypeSelectorProps) {
  const selected = ACTIVITY_TYPES.find((a) => a.id === value);

  return (
    <div className="space-y-4">
      <Label
        htmlFor="activity-type"
        className="font-display text-xs tracking-widest uppercase text-[hsl(var(--gold))]"
      >
        Sélectionner une catégorie
      </Label>

      <Select value={value} onValueChange={(v) => onChange(v as ActivityTypeId)}>
        <SelectTrigger id="activity-type" className="h-auto py-3 font-mono-chad text-sm">
          <SelectValue placeholder="Choisissez votre type d'activité" />
        </SelectTrigger>
        <SelectContent>
          {ACTIVITY_TYPES.map((type) => (
            <SelectItem key={type.id} value={type.id} className="py-3 cursor-pointer">
              <div>
                <div className="font-semibold text-sm">{type.label}</div>
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
          <StatBox label="Cotisations" value={`${selected.cotisationsSociales}%`} accent="red" />
          <StatBox label="Plafond CA" value={formatCurrency(selected.plafondCA)} accent="gold" />
          <StatBox label="Abattement IR" value={`${selected.abattementForfaitaire}%`} accent="blue" />
          <StatBox label="Versement lib." value={`${selected.versementLiberatoire}%`} accent="green" />
        </div>
      )}
    </div>
  );
}

function StatBox({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "gold" | "red" | "green" | "blue";
}) {
  const accentColor = {
    gold: "hsl(var(--gold))",
    red: "hsl(var(--red-hot))",
    green: "hsl(var(--green-neon))",
    blue: "hsl(var(--blue-cool))",
  }[accent];

  return (
    <div
      className="px-3 py-2.5 relative"
      style={{
        background: "hsl(var(--surface-2))",
        border: `1px solid hsl(var(--border))`,
        borderTopColor: `${accentColor}40`,
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`, opacity: 0.5 }}
      />
      <div className="font-display text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground))] mb-1">
        {label}
      </div>
      <div
        className="font-mono-chad text-sm font-bold"
        style={{ color: accentColor }}
      >
        {value}
      </div>
    </div>
  );
}

export { };
