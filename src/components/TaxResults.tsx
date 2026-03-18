import type { TaxResults as TaxResultsType } from "@/types/tax";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatPercent } from "@/lib/utils";
import {
  TrendingDown,
  Receipt,
  Wallet,
  AlertCircle,
  CheckCircle2,
  Info,
  BarChart3,
} from "lucide-react";
import { CFE_EXEMPTION_THRESHOLD } from "@/lib/tax-calculator";

interface TaxResultsProps {
  results: TaxResultsType | null;
  chiffreAffaires: number;
  isFirstYear: boolean;
}

export function TaxResults({ results, chiffreAffaires, isFirstYear }: TaxResultsProps) {
  if (!results || chiffreAffaires <= 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="relative mb-6">
          <BarChart3 className="h-14 w-14 text-[hsl(var(--gold)/0.15)]" />
          <span className="absolute -bottom-1 -right-1 w-4 h-4 border-b border-r border-[hsl(var(--gold)/0.3)]" />
          <span className="absolute -top-1 -left-1 w-4 h-4 border-t border-l border-[hsl(var(--gold)/0.3)]" />
        </div>
        <p className="font-display text-xl tracking-widest text-[hsl(var(--foreground)/0.5)] uppercase">
          En attente de données
        </p>
        <p className="font-mono-chad text-xs text-[hsl(var(--muted-foreground))] mt-2 tracking-wide">
          Renseignez votre chiffre d'affaires pour démarrer
        </p>
      </div>
    );
  }

  const totalCharges =
    results.cotisationsSociales +
    results.cfpContribution +
    (results.impotRevenu ?? 0) +
    (results.tva.isSubjectToTVA ? results.tva.tvaSolde : 0);

  const chargesRate = chiffreAffaires > 0 ? (totalCharges / chiffreAffaires) * 100 : 0;
  const netRate = chiffreAffaires > 0 ? (results.revenuNet / chiffreAffaires) * 100 : 0;

  return (
    <div className="space-y-5 animate-count-in">

      {/* ── KPI GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

        {/* Charges */}
        <div className="card-red-bar relative border border-[hsl(var(--border))] bg-[hsl(var(--surface-2))] p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="h-3.5 w-3.5 text-[hsl(var(--red-hot))]" />
            <span className="font-display text-xs tracking-widest text-[hsl(var(--muted-foreground))] uppercase">
              Charges
            </span>
          </div>
          <div className="font-mono-chad text-xl font-bold text-[hsl(var(--red-hot))]">
            {formatCurrency(totalCharges)}
          </div>
          <div className="font-mono-chad text-[11px] text-[hsl(var(--muted-foreground))] mt-1">
            {chargesRate.toFixed(1)}% du CA
          </div>
        </div>

        {/* Net Revenue — FEATURED */}
        <div
          className="card-gold-bar relative border border-[hsl(var(--gold)/0.35)] p-4"
          style={{ background: "linear-gradient(160deg, hsl(42 65% 52% / 0.07) 0%, hsl(var(--surface-2)) 60%)" }}
        >
          <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[hsl(var(--gold))]" />
          <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[hsl(var(--gold))]" />
          <div className="flex items-center gap-2 mb-3">
            <Wallet className="h-3.5 w-3.5 text-[hsl(var(--gold))]" />
            <span className="font-display text-xs tracking-widest text-[hsl(var(--gold))] uppercase">
              Revenu net
            </span>
          </div>
          <div className="font-mono-chad text-xl font-bold text-[hsl(var(--gold-bright))]">
            {formatCurrency(results.revenuNet)}
          </div>
          <div className="font-mono-chad text-[11px] text-[hsl(var(--muted-foreground))] mt-1">
            {netRate.toFixed(1)}% du CA
          </div>
        </div>

        {/* Monthly */}
        <div className="card-blue-bar relative border border-[hsl(var(--border))] bg-[hsl(var(--surface-2))] p-4">
          <div className="flex items-center gap-2 mb-3">
            <Receipt className="h-3.5 w-3.5 text-[hsl(var(--blue-cool))]" />
            <span className="font-display text-xs tracking-widest text-[hsl(var(--muted-foreground))] uppercase">
              /Mois
            </span>
          </div>
          <div className="font-mono-chad text-xl font-bold text-[hsl(var(--blue-cool))]">
            {formatCurrency(chiffreAffaires / 12)}
          </div>
          <div className="font-mono-chad text-[11px] text-[hsl(var(--muted-foreground))] mt-1">
            Net/mois : {formatCurrency(results.revenuNet / 12)}
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <Tabs defaultValue="charges">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="charges">Cotisations</TabsTrigger>
          <TabsTrigger value="impot">Impôt</TabsTrigger>
          <TabsTrigger value="tva">TVA</TabsTrigger>
          <TabsTrigger value="cfe">CFE</TabsTrigger>
        </TabsList>

        {/* ── Cotisations sociales ── */}
        <TabsContent value="charges">
          <div className="border border-[hsl(var(--border))] bg-[hsl(var(--surface-2))] mt-2">
            <div className="px-4 py-3 border-b border-[hsl(var(--border))] flex items-center gap-2">
              <TrendingDown className="h-3.5 w-3.5 text-[hsl(var(--red-hot))]" />
              <span className="font-display text-sm tracking-widest uppercase text-[hsl(var(--foreground))]">
                Cotisations sociales & CFP
              </span>
            </div>
            <div className="px-4 py-4 space-y-3">
              <ChadLineItem label="Chiffre d'affaires" value={formatCurrency(chiffreAffaires)} bold accent="gold" />
              <div className="h-px bg-[hsl(var(--border))]" />
              <ChadLineItem
                label={`Cotisations sociales (${formatPercent(results.cotisationsSocialesRate)})`}
                value={`− ${formatCurrency(results.cotisationsSociales)}`}
                sub={`Taux : ${results.cotisationsSocialesRate}% ${results.cotisationsSocialesRate < 12.5 ? "— avec ACRE" : "— taux plein"}`}
                accent="red"
              />
              <ChadLineItem
                label="CFP (formation professionnelle)"
                value={`− ${formatCurrency(results.cfpContribution)}`}
                sub="Inclus dans vos cotisations Urssaf"
                accent="red"
              />
              <div className="h-px bg-[hsl(var(--border))]" />
              <ChadLineItem
                label="Total cotisations"
                value={`− ${formatCurrency(results.cotisationsSociales + results.cfpContribution)}`}
                bold
                accent="red"
              />
              <ChadInfoBox>
                Les cotisations couvrent : maladie, retraite de base et complémentaire,
                invalidité-décès, allocations familiales, CFP. Déclaration mensuelle ou
                trimestrielle sur autoentrepreneur.urssaf.fr.
              </ChadInfoBox>
            </div>
          </div>
        </TabsContent>

        {/* ── Impôt sur le revenu ── */}
        <TabsContent value="impot">
          <div className="border border-[hsl(var(--border))] bg-[hsl(var(--surface-2))] mt-2">
            <div className="px-4 py-3 border-b border-[hsl(var(--border))] flex items-center gap-2">
              <Receipt className="h-3.5 w-3.5 text-[hsl(var(--gold))]" />
              <span className="font-display text-sm tracking-widest uppercase text-[hsl(var(--foreground))]">
                Impôt sur le revenu
              </span>
            </div>
            <div className="px-4 py-4 space-y-3">
              <div className="flex items-center gap-2">
                <span
                  className="font-mono-chad text-[11px] uppercase tracking-widest px-2 py-1 border"
                  style={
                    results.impotRevenuMethod === "versement_liberatoire"
                      ? { borderColor: "hsl(var(--gold)/0.4)", color: "hsl(var(--gold))", background: "hsl(var(--gold)/0.08)" }
                      : { borderColor: "hsl(var(--border))", color: "hsl(var(--muted-foreground))" }
                  }
                >
                  {results.impotRevenuMethod === "versement_liberatoire"
                    ? "Versement libératoire"
                    : "Barème progressif (estimation)"}
                </span>
              </div>

              {results.impotRevenuMethod === "versement_liberatoire" ? (
                <>
                  <ChadLineItem label="CA soumis au versement libératoire" value={formatCurrency(chiffreAffaires)} bold accent="gold" />
                  <ChadLineItem
                    label="Versement libératoire"
                    value={`− ${formatCurrency(results.impotRevenu ?? 0)}`}
                    sub="Payé avec vos cotisations sociales"
                    accent="red"
                  />
                  <ChadInfoBox>
                    Le versement libératoire vous libère définitivement de l'impôt sur ce revenu.
                    Il est payé en même temps que vos cotisations sociales. À mentionner sur la 2042C.
                  </ChadInfoBox>
                </>
              ) : (
                <>
                  <ChadLineItem label="Chiffre d'affaires" value={formatCurrency(chiffreAffaires)} accent="gold" />
                  <ChadLineItem
                    label={`Abattement forfaitaire (${results.abattementForfaitaire}%)`}
                    value={`− ${formatCurrency(results.abattementMontant)}`}
                    sub="Représente vos charges professionnelles forfaitaires"
                    accent="red"
                  />
                  <div className="h-px bg-[hsl(var(--border))]" />
                  <ChadLineItem
                    label="Revenu imposable (avant autres revenus du foyer)"
                    value={formatCurrency(results.revenuImposable)}
                    bold
                    accent="gold"
                  />
                  <ChadLineItem
                    label="IR estimé (barème progressif, célibataire)"
                    value={`− ${formatCurrency(results.impotRevenu ?? 0)}`}
                    sub="Estimation — 1 part fiscale, sans autres revenus"
                    accent="red"
                  />
                  <ChadInfoBox type="warning">
                    Estimation pour une part fiscale sans autre revenu. L'IR réel dépend
                    de votre foyer fiscal. Consultez un comptable pour une estimation précise.
                  </ChadInfoBox>
                </>
              )}
            </div>
          </div>
        </TabsContent>

        {/* ── TVA ── */}
        <TabsContent value="tva">
          <div className="border border-[hsl(var(--border))] bg-[hsl(var(--surface-2))] mt-2">
            <div className="px-4 py-3 border-b border-[hsl(var(--border))] flex items-center gap-2">
              <Receipt className="h-3.5 w-3.5 text-[hsl(var(--blue-cool))]" />
              <span className="font-display text-sm tracking-widest uppercase text-[hsl(var(--foreground))]">
                TVA
              </span>
            </div>
            <div className="px-4 py-4 space-y-3">
              <div>
                <span
                  className="font-mono-chad text-[11px] uppercase tracking-widest px-2 py-1 border inline-block"
                  style={
                    results.tva.isSubjectToTVA
                      ? { borderColor: "hsl(var(--red-hot)/0.4)", color: "hsl(var(--red-hot))", background: "hsl(var(--red-hot)/0.07)" }
                      : { borderColor: "hsl(var(--green-neon)/0.4)", color: "hsl(var(--green-neon))", background: "hsl(var(--green-neon)/0.07)" }
                  }
                >
                  {results.tva.isSubjectToTVA ? "Assujetti à la TVA" : "Franchise en base de TVA"}
                </span>
              </div>

              <ChadInfoBox type={results.tva.isSubjectToTVA ? "warning" : "success"}>
                {results.tva.reason}
              </ChadInfoBox>

              {results.tva.isSubjectToTVA && (
                <>
                  <div className="h-px bg-[hsl(var(--border))]" />
                  <ChadLineItem
                    label="TVA collectée sur votre CA (20%)"
                    value={formatCurrency(results.tva.tvaCollectee)}
                    sub="À reverser à l'État"
                    accent="red"
                  />
                  <ChadLineItem
                    label="TVA déductible sur achats"
                    value={`+ ${formatCurrency(results.tva.tvaDeductible)}`}
                    sub="TVA sur vos achats professionnels récupérable"
                    accent="green"
                  />
                  <div className="h-px bg-[hsl(var(--border))]" />
                  <ChadLineItem
                    label="TVA nette à reverser"
                    value={formatCurrency(results.tva.tvaSolde)}
                    bold
                    accent={results.tva.tvaSolde > 0 ? "red" : "green"}
                  />
                  <ChadInfoBox>
                    TVA déclarée mensuellement (CA &gt; 15 000 €/mois) ou trimestriellement.
                    Conservez toutes vos factures d'achat pour justifier la TVA déductible.
                  </ChadInfoBox>
                </>
              )}

              {!results.tva.isSubjectToTVA && (
                <ChadInfoBox>
                  Sous la franchise en base, vous ne facturez pas de TVA. Mentionnez sur vos
                  factures : <em>"TVA non applicable, art. 293 B du CGI"</em>.
                </ChadInfoBox>
              )}
            </div>
          </div>
        </TabsContent>

        {/* ── CFE & Divers ── */}
        <TabsContent value="cfe">
          <div className="border border-[hsl(var(--border))] bg-[hsl(var(--surface-2))] mt-2">
            <div className="px-4 py-3 border-b border-[hsl(var(--border))] flex items-center gap-2">
              <Info className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />
              <span className="font-display text-sm tracking-widest uppercase text-[hsl(var(--foreground))]">
                CFE & Informations
              </span>
            </div>
            <div className="px-4 py-4 space-y-4">

              <div>
                <p className="font-display text-xs tracking-widest uppercase text-[hsl(var(--gold))] mb-2">
                  CFE — Cotisation Foncière des Entreprises
                </p>
                {isFirstYear ? (
                  <ChadInfoBox type="success">
                    Exonéré de CFE la première année d'activité (exonération automatique).
                  </ChadInfoBox>
                ) : chiffreAffaires < CFE_EXEMPTION_THRESHOLD ? (
                  <ChadInfoBox type="success">
                    Exonéré de CFE — CA ({formatCurrency(chiffreAffaires)}) inférieur au seuil ({formatCurrency(CFE_EXEMPTION_THRESHOLD)}).
                  </ChadInfoBox>
                ) : (
                  <ChadInfoBox type="warning">
                    CFE due. Montant variable selon votre commune (227 € à 7 349 €). Payable en décembre.
                  </ChadInfoBox>
                )}
              </div>

              <div className="h-px bg-[hsl(var(--border))]" />

              <div>
                <p className="font-display text-xs tracking-widest uppercase text-[hsl(var(--gold))] mb-3">
                  Récapitulatif annuel
                </p>
                <div className="space-y-2">
                  <ChadLineItem
                    label="Cotisations sociales + CFP"
                    value={`− ${formatCurrency(results.cotisationsSociales + results.cfpContribution)}`}
                    accent="red"
                  />
                  <ChadLineItem
                    label={`Impôt sur le revenu${results.impotRevenuMethod === "bareme_progressif" ? " (estimation)" : ""}`}
                    value={`− ${formatCurrency(results.impotRevenu ?? 0)}`}
                    accent="red"
                  />
                  {results.tva.isSubjectToTVA && (
                    <ChadLineItem
                      label="TVA nette"
                      value={`− ${formatCurrency(results.tva.tvaSolde)}`}
                      accent="red"
                    />
                  )}
                  <div className="h-px bg-[hsl(var(--border))]" />
                  <ChadLineItem
                    label="Revenu net estimé"
                    value={formatCurrency(results.revenuNet)}
                    bold
                    accent="gold"
                  />
                </div>
              </div>

              <div className="h-px bg-[hsl(var(--border))]" />

              <div>
                <p className="font-display text-xs tracking-widest uppercase text-[hsl(var(--gold))] mb-2">
                  Obligations déclaratives
                </p>
                <ul className="space-y-1.5">
                  {[
                    "Déclaration CA : mensuelle ou trimestrielle sur urssaf.fr",
                    "Déclaration IR : chaque année (formulaire 2042 + 2042C)",
                    "Factures : obligatoires entre professionnels, numérotées",
                    "Compte bancaire dédié : obligatoire si CA > 10 000 €/an 2 ans consécutifs",
                    "Assurance RC Pro : recommandée, obligatoire pour certains métiers",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-[hsl(var(--gold)/0.5)] mt-0.5 text-xs font-mono-chad">›</span>
                      <span className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─── Internal sub-components ────────────────────────────────────────────────

function ChadLineItem({
  label,
  value,
  sub,
  bold,
  accent = "default",
}: {
  label: string;
  value: string;
  sub?: string;
  bold?: boolean;
  accent?: "gold" | "red" | "green" | "default";
}) {
  const accentColors = {
    gold: "hsl(var(--gold-bright))",
    red: "hsl(var(--red-hot))",
    green: "hsl(var(--green-neon))",
    default: "hsl(var(--foreground))",
  };

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <span
          className={bold ? "text-sm font-semibold" : "text-sm text-[hsl(var(--foreground)/0.8)]"}
        >
          {label}
        </span>
        {sub && (
          <p className="font-mono-chad text-[10px] text-[hsl(var(--muted-foreground))] mt-0.5 tracking-wide">
            {sub}
          </p>
        )}
      </div>
      <span
        className="font-mono-chad flex-shrink-0 tabular-nums"
        style={{
          fontSize: bold ? "0.9rem" : "0.8rem",
          fontWeight: bold ? 700 : 500,
          color: accentColors[accent],
        }}
      >
        {value}
      </span>
    </div>
  );
}

function ChadInfoBox({
  children,
  type = "info",
}: {
  children: React.ReactNode;
  type?: "info" | "warning" | "success";
}) {
  const styles = {
    info: {
      border: "hsl(var(--blue-cool)/0.25)",
      bg: "hsl(var(--blue-cool)/0.05)",
      text: "hsl(var(--blue-cool)/0.9)",
      icon: <Info className="h-3 w-3 flex-shrink-0 mt-0.5" />,
    },
    warning: {
      border: "hsl(42 80% 50%/0.3)",
      bg: "hsl(42 80% 50%/0.06)",
      text: "hsl(42 80% 65%)",
      icon: <AlertCircle className="h-3 w-3 flex-shrink-0 mt-0.5" />,
    },
    success: {
      border: "hsl(var(--green-neon)/0.25)",
      bg: "hsl(var(--green-neon)/0.05)",
      text: "hsl(var(--green-neon)/0.9)",
      icon: <CheckCircle2 className="h-3 w-3 flex-shrink-0 mt-0.5" />,
    },
  };

  const s = styles[type];

  return (
    <div
      className="flex items-start gap-2 p-3 text-xs leading-relaxed"
      style={{ border: `1px solid ${s.border}`, background: s.bg, color: s.text }}
    >
      {s.icon}
      <div className="font-mono-chad tracking-wide">{children}</div>
    </div>
  );
}
