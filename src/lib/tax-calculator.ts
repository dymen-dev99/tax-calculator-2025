import { ACTIVITY_TYPES, ACRE_REDUCTION, CFE_EXEMPTION_THRESHOLD } from "@/constants/tax-rates";
import type { TaxInputs, TaxResults, TVAStatus } from "@/types/tax";

/**
 * Barème progressif de l'impôt sur le revenu 2025 (part unique)
 * Source: impots.gouv.fr
 */
const BAREME_IR_2025 = [
  { tranche: 11497, taux: 0 },
  { tranche: 29315, taux: 0.11 },
  { tranche: 83823, taux: 0.3 },
  { tranche: 180294, taux: 0.41 },
  { tranche: Infinity, taux: 0.45 },
];

function calculateIR(revenuImposable: number): number {
  if (revenuImposable <= 0) return 0;

  let impot = 0;
  let borneInf = 0;

  for (const { tranche, taux } of BAREME_IR_2025) {
    if (revenuImposable <= borneInf) break;
    const imposable = Math.min(revenuImposable, tranche) - borneInf;
    impot += imposable * taux;
    borneInf = tranche;
  }

  return Math.max(0, impot);
}

function calculateTVA(inputs: TaxInputs, activityType: (typeof ACTIVITY_TYPES)[number]): TVAStatus {
  const { chiffreAffaires, purchases } = inputs;

  // Franchise en base de TVA : en dessous du seuil, pas de TVA collectée ni déductible
  if (chiffreAffaires < activityType.tvaFranchise) {
    return {
      isSubjectToTVA: false,
      reason: `CA (${chiffreAffaires.toLocaleString("fr-FR")} €) inférieur au seuil de franchise TVA (${activityType.tvaFranchise.toLocaleString("fr-FR")} €). Vous êtes dispensé de collecter et déclarer la TVA.`,
      tvaCollectee: 0,
      tvaDeductible: 0,
      tvaSolde: 0,
    };
  }

  // Au-dessus du seuil : assujetti à la TVA
  const tvaCollectee = chiffreAffaires * (activityType.tvaRate / 100);

  // TVA déductible sur les achats professionnels
  const tvaDeductible = purchases.reduce((sum, purchase) => {
    return sum + purchase.amountHT * (purchase.tvaRate / 100);
  }, 0);

  const tvaSolde = tvaCollectee - tvaDeductible;

  return {
    isSubjectToTVA: true,
    reason:
      chiffreAffaires >= activityType.tvaSeuilleMajore
        ? `CA (${chiffreAffaires.toLocaleString("fr-FR")} €) dépasse le seuil majoré TVA (${activityType.tvaSeuilleMajore.toLocaleString("fr-FR")} €). TVA obligatoire immédiatement.`
        : `CA (${chiffreAffaires.toLocaleString("fr-FR")} €) dépasse le seuil de franchise TVA (${activityType.tvaFranchise.toLocaleString("fr-FR")} €). TVA applicable.`,
    tvaCollectee,
    tvaDeductible,
    tvaSolde,
  };
}

export function calculateTaxes(inputs: TaxInputs): TaxResults {
  const { activityTypeId, chiffreAffaires, versementLiberatoireEnabled, acreEnabled } = inputs;

  const activityType = ACTIVITY_TYPES.find((a) => a.id === activityTypeId);
  if (!activityType) throw new Error(`Type d'activité inconnu : ${activityTypeId}`);

  // --- Cotisations sociales ---
  let cotisationsRate = activityType.cotisationsSociales;
  if (acreEnabled) cotisationsRate *= 1 - ACRE_REDUCTION;

  const cotisationsSociales = chiffreAffaires * (cotisationsRate / 100);

  // CFP (Contribution à la Formation Professionnelle)
  const cfpContribution = chiffreAffaires * (activityType.cfpRate / 100);

  // --- Impôt sur le revenu ---
  const abattementMontant = chiffreAffaires * (activityType.abattementForfaitaire / 100);
  const revenuImposable = Math.max(0, chiffreAffaires - abattementMontant);

  let impotRevenu: number | null = null;
  let impotRevenuMethod: TaxResults["impotRevenuMethod"] = "bareme_progressif";

  if (versementLiberatoireEnabled) {
    impotRevenu = chiffreAffaires * (activityType.versementLiberatoire / 100);
    impotRevenuMethod = "versement_liberatoire";
  } else {
    // On calcule l'IR estimatif au barème progressif (sans autres revenus du foyer)
    impotRevenu = calculateIR(revenuImposable);
    impotRevenuMethod = "bareme_progressif";
  }

  // --- TVA ---
  const tva = calculateTVA(inputs, activityType);

  // --- Revenu net estimé ---
  const totalCharges = cotisationsSociales + cfpContribution + (impotRevenu ?? 0) + (tva.isSubjectToTVA ? tva.tvaSolde : 0);
  const revenuNet = Math.max(0, chiffreAffaires - totalCharges);

  // --- Alertes de dépassement de plafond ---
  const plafondCA = activityType.plafondCA;
  const isOverPlafond = chiffreAffaires > plafondCA;
  const isNearPlafond = !isOverPlafond && chiffreAffaires > plafondCA * 0.85;

  return {
    cotisationsSociales,
    cotisationsSocialesRate: cotisationsRate,
    cfpContribution,
    impotRevenu,
    impotRevenuMethod,
    revenuImposable,
    abattementForfaitaire: activityType.abattementForfaitaire,
    abattementMontant,
    tva,
    revenuNet,
    plafondCA,
    isOverPlafond,
    isNearPlafond,
  };
}

export { CFE_EXEMPTION_THRESHOLD };
