import { useState } from "react";
import type { Purchase } from "@/types/tax";
import { TVA_RATES } from "@/constants/tax-rates";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, ShoppingCart, Info } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface PurchasesSectionProps {
  purchases: Purchase[];
  onPurchasesChange: (purchases: Purchase[]) => void;
  isSubjectToTVA: boolean;
}

const EMPTY_FORM = { description: "", amountHT: "", tvaRate: "20" };

export function PurchasesSection({ purchases, onPurchasesChange, isSubjectToTVA }: PurchasesSectionProps) {
  const [form, setForm] = useState(EMPTY_FORM);

  const totalHT = purchases.reduce((s, p) => s + p.amountHT, 0);
  const totalTVA = purchases.reduce((s, p) => s + p.amountHT * (p.tvaRate / 100), 0);
  const totalTTC = totalHT + totalTVA;

  function handleAdd() {
    if (!form.description.trim() || !form.amountHT) return;
    const purchase: Purchase = {
      id: crypto.randomUUID(),
      description: form.description.trim(),
      amountHT: Number(form.amountHT),
      tvaRate: Number(form.tvaRate),
    };
    onPurchasesChange([...purchases, purchase]);
    setForm(EMPTY_FORM);
  }

  function handleRemove(id: string) {
    onPurchasesChange(purchases.filter((p) => p.id !== id));
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleAdd();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          <Label className="text-base font-semibold">Achats professionnels</Label>
        </div>
        {purchases.length > 0 && (
          <Badge variant="secondary">{purchases.length} achat{purchases.length > 1 ? "s" : ""}</Badge>
        )}
      </div>

      {!isSubjectToTVA && (
        <div className="flex items-start gap-2 rounded-md bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
          <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Franchise en base de TVA :</strong> Vous n'êtes pas assujetti à la TVA.
            La TVA sur vos achats n'est pas déductible. Renseignez vos achats pour information uniquement.
          </div>
        </div>
      )}

      {/* Formulaire d'ajout */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto_auto_auto]">
        <Input
          placeholder="Description de l'achat (ex: ordinateur, logiciel…)"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          onKeyDown={handleKeyDown}
        />
        <div className="relative">
          <Input
            type="number"
            min={0}
            step={0.01}
            placeholder="Montant HT"
            value={form.amountHT}
            onChange={(e) => setForm((f) => ({ ...f, amountHT: e.target.value }))}
            onKeyDown={handleKeyDown}
            className="pr-6 w-full sm:w-32"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[hsl(var(--muted-foreground))]">
            €
          </span>
        </div>
        <Select
          value={form.tvaRate}
          onValueChange={(v) => setForm((f) => ({ ...f, tvaRate: v }))}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TVA_RATES.map((rate) => (
              <SelectItem key={rate.value} value={String(rate.value)}>
                {rate.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={handleAdd}
          disabled={!form.description.trim() || !form.amountHT}
          size="default"
          className="gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Ajouter
        </Button>
      </div>

      {/* Liste des achats */}
      {purchases.length > 0 && (
        <div className="rounded-lg border border-[hsl(var(--border))] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[hsl(var(--muted))]">
              <tr>
                <th className="text-left py-2 px-3 font-medium text-[hsl(var(--muted-foreground))]">
                  Description
                </th>
                <th className="text-right py-2 px-3 font-medium text-[hsl(var(--muted-foreground))]">
                  Montant HT
                </th>
                <th className="text-right py-2 px-3 font-medium text-[hsl(var(--muted-foreground))]">
                  TVA
                </th>
                <th className="text-right py-2 px-3 font-medium text-[hsl(var(--muted-foreground))]">
                  TTC
                </th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase, idx) => {
                const tvaAmount = purchase.amountHT * (purchase.tvaRate / 100);
                return (
                  <tr
                    key={purchase.id}
                    className={idx % 2 === 0 ? "bg-white" : "bg-[hsl(var(--muted))]/30"}
                  >
                    <td className="py-2 px-3">{purchase.description}</td>
                    <td className="py-2 px-3 text-right tabular-nums">
                      {formatCurrency(purchase.amountHT)}
                    </td>
                    <td className="py-2 px-3 text-right tabular-nums text-[hsl(var(--muted-foreground))]">
                      {formatCurrency(tvaAmount)}
                      <span className="text-xs ml-1">({purchase.tvaRate}%)</span>
                    </td>
                    <td className="py-2 px-3 text-right tabular-nums font-medium">
                      {formatCurrency(purchase.amountHT + tvaAmount)}
                    </td>
                    <td className="py-2 px-3">
                      <button
                        onClick={() => handleRemove(purchase.id)}
                        className="text-[hsl(var(--muted-foreground))] hover:text-red-500 transition-colors"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <Separator />

          <div className="flex justify-end gap-6 px-3 py-2 text-sm font-semibold bg-[hsl(var(--muted))]/50">
            <span>Total HT : {formatCurrency(totalHT)}</span>
            <span className="text-[hsl(var(--muted-foreground))]">
              TVA : {formatCurrency(totalTVA)}
            </span>
            <span>Total TTC : {formatCurrency(totalTTC)}</span>
          </div>
        </div>
      )}

      {purchases.length === 0 && (
        <div className="text-center py-6 text-[hsl(var(--muted-foreground))] text-sm border border-dashed border-[hsl(var(--border))] rounded-lg">
          Aucun achat renseigné. Ajoutez vos dépenses professionnelles pour calculer la TVA déductible.
        </div>
      )}
    </div>
  );
}
