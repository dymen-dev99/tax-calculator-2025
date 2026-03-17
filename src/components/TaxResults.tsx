import type { TaxResults as TaxResultsType } from "@/types/tax";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatPercent } from "@/lib/utils";
import {
  TrendingDown,
  Receipt,
  Wallet,
  AlertCircle,
  CheckCircle2,
  Info,
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
      <div className="flex flex-col items-center justify-center py-16 text-center text-[hsl(var(--muted-foreground))]">
        <Receipt className="h-12 w-12 mb-3 opacity-30" />
        <p className="text-lg font-medium">Renseignez votre chiffre d'affaires</p>
        <p className="text-sm">Les résultats s'afficheront automatiquement.</p>
      </div>
    );
  }

  const totalCharges =
    results.cotisationsSociales +
    results.cfpContribution +
    (results.impotRevenu ?? 0) +
    (results.tva.isSubjectToTVA ? results.tva.tvaSolde : 0);

  const chargesRate = chiffreAffaires > 0 ? (totalCharges / chiffreAffaires) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Résumé visuel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <SummaryCard
          title="Charges totales"
          value={formatCurrency(totalCharges)}
          sub={`${chargesRate.toFixed(1)}% du CA`}
          icon={<TrendingDown className="h-5 w-5 text-red-500" />}
          colorClass="border-red-100 bg-red-50"
        />
        <SummaryCard
          title="Revenu net estimé"
          value={formatCurrency(results.revenuNet)}
          sub={`${((results.revenuNet / chiffreAffaires) * 100).toFixed(1)}% du CA`}
          icon={<Wallet className="h-5 w-5 text-green-600" />}
          colorClass="border-green-100 bg-green-50"
        />
        <SummaryCard
          title="CA mensuel moyen"
          value={formatCurrency(chiffreAffaires / 12)}
          sub={`Net/mois : ${formatCurrency(results.revenuNet / 12)}`}
          icon={<Receipt className="h-5 w-5 text-blue-600" />}
          colorClass="border-blue-100 bg-blue-50"
        />
      </div>

      {/* Détails par onglets */}
      <Tabs defaultValue="charges">
        <TabsList className="w-full">
          <TabsTrigger value="charges" className="flex-1">
            Cotisations sociales
          </TabsTrigger>
          <TabsTrigger value="impot" className="flex-1">
            Impôt sur le revenu
          </TabsTrigger>
          <TabsTrigger value="tva" className="flex-1">
            TVA
          </TabsTrigger>
          <TabsTrigger value="cfe" className="flex-1">
            CFE & Divers
          </TabsTrigger>
        </TabsList>

        {/* Cotisations sociales */}
        <TabsContent value="charges">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Cotisations sociales & CFP
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <LineItem
                label="Chiffre d'affaires"
                value={formatCurrency(chiffreAffaires)}
                bold
              />
              <Separator />
              <LineItem
                label={`Cotisations sociales (${formatPercent(results.cotisationsSocialesRate)})`}
                value={`- ${formatCurrency(results.cotisationsSociales)}`}
                sub={`Taux appliqué : ${results.cotisationsSocialesRate}% (${results.cotisationsSocialesRate < 12.5 ? "avec ACRE" : "taux plein"})`}
                negative
              />
              <LineItem
                label="CFP (formation professionnelle)"
                value={`- ${formatCurrency(results.cfpContribution)}`}
                negative
                sub="Inclus dans les cotisations affichées sur votre déclaration Urssaf"
              />
              <Separator />
              <LineItem
                label="Total cotisations"
                value={`- ${formatCurrency(results.cotisationsSociales + results.cfpContribution)}`}
                bold
                negative
              />
              <InfoBox>
                Les cotisations sociales couvrent : assurance maladie, retraite de base et
                complémentaire, invalidité-décès, allocations familiales, et la formation
                professionnelle (CFP). Elles sont déclarées et payées mensuellement ou
                trimestriellement sur autoentrepreneur.urssaf.fr.
              </InfoBox>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Impôt sur le revenu */}
        <TabsContent value="impot">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Impôt sur le revenu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant={results.impotRevenuMethod === "versement_liberatoire" ? "default" : "secondary"}>
                  {results.impotRevenuMethod === "versement_liberatoire"
                    ? "Versement libératoire"
                    : "Barème progressif (estimation)"}
                </Badge>
              </div>

              {results.impotRevenuMethod === "versement_liberatoire" ? (
                <>
                  <LineItem label="CA soumis au versement libératoire" value={formatCurrency(chiffreAffaires)} bold />
                  <LineItem
                    label={`Versement libératoire`}
                    value={`- ${formatCurrency(results.impotRevenu ?? 0)}`}
                    sub={`Payé directement avec vos cotisations sociales`}
                    negative
                  />
                  <InfoBox>
                    Le versement libératoire vous libère définitivement de l'impôt sur ce revenu.
                    Il est payé en même temps que vos cotisations sociales. Pas de déclaration
                    annuelle d'IR sur ces revenus (seulement à mentionner sur la 2042C).
                  </InfoBox>
                </>
              ) : (
                <>
                  <LineItem label="Chiffre d'affaires" value={formatCurrency(chiffreAffaires)} />
                  <LineItem
                    label={`Abattement forfaitaire (${results.abattementForfaitaire}%)`}
                    value={`- ${formatCurrency(results.abattementMontant)}`}
                    sub="Représente vos charges professionnelles forfaitaires"
                    negative
                  />
                  <Separator />
                  <LineItem
                    label="Revenu imposable (avant autres revenus du foyer)"
                    value={formatCurrency(results.revenuImposable)}
                    bold
                  />
                  <LineItem
                    label="IR estimé (barème progressif, célibataire)"
                    value={`- ${formatCurrency(results.impotRevenu ?? 0)}`}
                    negative
                    sub="Estimation basée sur une part fiscale, hors autres revenus"
                  />
                  <InfoBox type="warning">
                    Cette estimation est calculée pour une part fiscale sans autre revenu.
                    L'IR réel dépend de la situation de votre foyer fiscal (nombre de parts,
                    autres revenus). Consultez un comptable pour une estimation précise.
                  </InfoBox>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TVA */}
        <TabsContent value="tva">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                TVA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                {results.tva.isSubjectToTVA ? (
                  <Badge variant="warning">Assujetti à la TVA</Badge>
                ) : (
                  <Badge variant="success">Franchise en base de TVA</Badge>
                )}
              </div>

              <InfoBox type={results.tva.isSubjectToTVA ? "warning" : "success"}>
                {results.tva.reason}
              </InfoBox>

              {results.tva.isSubjectToTVA && (
                <>
                  <Separator />
                  <LineItem
                    label="TVA collectée sur votre CA (20%)"
                    value={formatCurrency(results.tva.tvaCollectee)}
                    sub="À reverser à l'État"
                    negative
                  />
                  <LineItem
                    label="TVA déductible sur achats"
                    value={`+ ${formatCurrency(results.tva.tvaDeductible)}`}
                    sub="TVA sur vos achats professionnels récupérable"
                  />
                  <Separator />
                  <LineItem
                    label="TVA nette à reverser"
                    value={formatCurrency(results.tva.tvaSolde)}
                    bold
                    negative={results.tva.tvaSolde > 0}
                  />
                  <InfoBox>
                    La TVA est déclarée et reversée mensuellement (si CA &gt; 15 000 €/mois) ou
                    trimestriellement. Conservez toutes vos factures d'achat pour justifier la TVA
                    déductible.
                  </InfoBox>
                </>
              )}

              {!results.tva.isSubjectToTVA && (
                <InfoBox>
                  Sous la franchise en base, vous ne facturez pas de TVA à vos clients et ne
                  pouvez pas récupérer la TVA sur vos achats. Vous devez mentionner sur vos
                  factures : <em>"TVA non applicable, art. 293 B du CGI"</em>.
                </InfoBox>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* CFE & Divers */}
        <TabsContent value="cfe">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Info className="h-4 w-4" />
                CFE & informations complémentaires
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium text-sm mb-1">CFE – Cotisation Foncière des Entreprises</p>
                {isFirstYear ? (
                  <StatusInfo
                    type="success"
                    message="Exonéré de CFE la première année d'activité (exonération automatique)."
                  />
                ) : chiffreAffaires < CFE_EXEMPTION_THRESHOLD ? (
                  <StatusInfo
                    type="success"
                    message={`Exonéré de CFE car votre CA (${formatCurrency(chiffreAffaires)}) est inférieur à ${formatCurrency(CFE_EXEMPTION_THRESHOLD)}.`}
                  />
                ) : (
                  <StatusInfo
                    type="warning"
                    message="CFE due. Le montant dépend de votre commune et de votre surface professionnelle. Minimum forfaitaire entre 227 € et 7 349 € selon la commune. Payable chaque année en décembre."
                  />
                )}
              </div>

              <Separator />

              <div>
                <p className="font-medium text-sm mb-2">Récapitulatif des charges annuelles</p>
                <div className="space-y-1.5 text-sm">
                  <LineItem
                    label="Cotisations sociales + CFP"
                    value={`- ${formatCurrency(results.cotisationsSociales + results.cfpContribution)}`}
                    negative
                  />
                  <LineItem
                    label="Impôt sur le revenu"
                    value={`- ${formatCurrency(results.impotRevenu ?? 0)}`}
                    negative
                    sub={results.impotRevenuMethod === "bareme_progressif" ? "(estimation)" : ""}
                  />
                  {results.tva.isSubjectToTVA && (
                    <LineItem
                      label="TVA nette"
                      value={`- ${formatCurrency(results.tva.tvaSolde)}`}
                      negative
                    />
                  )}
                  <Separator />
                  <LineItem
                    label="Revenu net estimé"
                    value={formatCurrency(results.revenuNet)}
                    bold
                  />
                </div>
              </div>

              <Separator />

              <div>
                <p className="font-medium text-sm mb-2">Obligations déclaratives</p>
                <ul className="text-sm text-[hsl(var(--muted-foreground))] space-y-1">
                  <li>• Déclaration CA : mensuelle ou trimestrielle sur urssaf.fr</li>
                  <li>• Déclaration IR : chaque année (formulaire 2042 + 2042C)</li>
                  <li>• Factures : obligatoires entre professionnels, numérotées</li>
                  <li>• Compte bancaire dédié : obligatoire si CA &gt; 10 000 €/an 2 ans consécutifs</li>
                  <li>• Assurance RC Pro : recommandée, obligatoire pour certains métiers</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─── Sous-composants internes ───────────────────────────────────────────────

function SummaryCard({
  title,
  value,
  sub,
  icon,
  colorClass,
}: {
  title: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  colorClass: string;
}) {
  return (
    <div className={`rounded-lg border p-4 ${colorClass}`}>
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
          {title}
        </span>
      </div>
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{sub}</div>
    </div>
  );
}

function LineItem({
  label,
  value,
  sub,
  bold,
  negative,
}: {
  label: string;
  value: string;
  sub?: string;
  bold?: boolean;
  negative?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <span className={bold ? "font-semibold" : "text-sm"}>{label}</span>
        {sub && <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{sub}</p>}
      </div>
      <span
        className={`tabular-nums flex-shrink-0 ${bold ? "font-bold text-base" : "text-sm"} ${
          negative ? "text-red-600" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function InfoBox({ children, type = "info" }: { children: React.ReactNode; type?: "info" | "warning" | "success" }) {
  const styles = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    success: "bg-green-50 border-green-200 text-green-800",
  };
  const icons = {
    info: <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />,
    warning: <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />,
    success: <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />,
  };

  return (
    <div className={`flex items-start gap-2 rounded-md border p-3 text-xs ${styles[type]}`}>
      {icons[type]}
      <div>{children}</div>
    </div>
  );
}

function StatusInfo({ message, type }: { message: string; type: "success" | "warning" }) {
  return (
    <InfoBox type={type}>
      {message}
    </InfoBox>
  );
}
