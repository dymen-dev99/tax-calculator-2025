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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-3.5 w-3.5 text-[hsl(var(--gold))]" />
          <Label className="font-display text-xs tracking-widest uppercase text-[hsl(var(--gold))]">
            Achats professionnels
          </Label>
        </div>
        {purchases.length > 0 && (
          <span className="font-mono-chad text-[10px] uppercase tracking-widest px-2 py-0.5 border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]">
            {purchases.length} achat{purchases.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* TVA franchise warning */}
      {!isSubjectToTVA && (
        <div
          className="flex items-start gap-2 p-3 text-xs"
          style={{
            border: "1px solid hsl(42 80% 50%/0.3)",
            background: "hsl(42 80% 50%/0.05)",
            color: "hsl(42 80% 65%)",
          }}
        >
          <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
          <div className="font-mono-chad tracking-wide leading-relaxed">
            <strong>Franchise en base de TVA :</strong> La TVA sur vos achats n'est pas déductible.
            Saisie pour information uniquement.
          </div>
        </div>
      )}

      {/* Form */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto_auto_auto]">
        <Input
          placeholder="Description (ex: ordinateur, logiciel…)"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          onKeyDown={handleKeyDown}
          className="font-mono-chad text-sm"
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
            className="pr-6 w-full sm:w-32 font-mono-chad text-sm"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono-chad text-[hsl(var(--gold))]">€</span>
        </div>
        <Select
          value={form.tvaRate}
          onValueChange={(v) => setForm((f) => ({ ...f, tvaRate: v }))}
        >
          <SelectTrigger className="w-full sm:w-36 font-mono-chad text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TVA_RATES.map((rate) => (
              <SelectItem key={rate.value} value={String(rate.value)} className="font-mono-chad text-sm">
                {rate.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={handleAdd}
          disabled={!form.description.trim() || !form.amountHT}
          size="default"
          className="gap-1.5 font-display tracking-widest uppercase text-xs"
          style={{
            background: "hsl(var(--gold))",
            color: "hsl(0 0% 5%)",
            border: "none",
          }}
        >
          <Plus className="h-4 w-4" />
          Ajouter
        </Button>
      </div>

      {/* Table */}
      {purchases.length > 0 && (
        <div className="border border-[hsl(var(--border))] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "hsl(var(--surface-2))", borderBottom: "1px solid hsl(var(--border))" }}>
                <th className="text-left py-2 px-3 font-display text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground))]">
                  Description
                </th>
                <th className="text-right py-2 px-3 font-display text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground))]">
                  HT
                </th>
                <th className="text-right py-2 px-3 font-display text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground))]">
                  TVA
                </th>
                <th className="text-right py-2 px-3 font-display text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground))]">
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
                    style={{
                      background: idx % 2 === 0 ? "hsl(var(--card))" : "hsl(var(--surface-2))",
                      borderBottom: "1px solid hsl(var(--border))",
                    }}
                  >
                    <td className="py-2 px-3 text-sm text-[hsl(var(--foreground)/0.85)]">
                      {purchase.description}
                    </td>
                    <td className="py-2 px-3 text-right font-mono-chad text-sm tabular-nums text-[hsl(var(--foreground)/0.85)]">
                      {formatCurrency(purchase.amountHT)}
                    </td>
                    <td className="py-2 px-3 text-right font-mono-chad text-xs tabular-nums text-[hsl(var(--muted-foreground))]">
                      {formatCurrency(tvaAmount)}
                      <span className="ml-1 text-[10px]">({purchase.tvaRate}%)</span>
                    </td>
                    <td className="py-2 px-3 text-right font-mono-chad text-sm tabular-nums font-semibold text-[hsl(var(--gold))]">
                      {formatCurrency(purchase.amountHT + tvaAmount)}
                    </td>
                    <td className="py-2 px-3">
                      <button
                        onClick={() => handleRemove(purchase.id)}
                        className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--red-hot))] transition-colors"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div
            className="flex justify-end gap-6 px-3 py-2 font-mono-chad text-xs"
            style={{ background: "hsl(var(--surface-2))", borderTop: "1px solid hsl(var(--border))" }}
          >
            <span className="text-[hsl(var(--muted-foreground))]">HT : {formatCurrency(totalHT)}</span>
            <span className="text-[hsl(var(--muted-foreground))]">TVA : {formatCurrency(totalTVA)}</span>
            <span className="font-bold text-[hsl(var(--gold))]">TTC : {formatCurrency(totalTTC)}</span>
          </div>
        </div>
      )}

      {purchases.length === 0 && (
        <div
          className="text-center py-8 font-mono-chad text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-widest"
          style={{ border: "1px dashed hsl(var(--border))" }}
        >
          Aucun achat renseigné
        </div>
      )}
    </div>
  );
}
