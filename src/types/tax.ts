import type { ActivityTypeId } from "@/constants/tax-rates";

export interface Purchase {
  id: string;
  description: string;
  amountHT: number;
  tvaRate: number;
}

export interface TaxInputs {
  activityTypeId: ActivityTypeId;
  chiffreAffaires: number;
  versementLiberatoireEnabled: boolean;
  acreEnabled: boolean;
  isFirstYear: boolean;
  purchases: Purchase[];
}

export interface TVAStatus {
  isSubjectToTVA: boolean;
  reason: string;
  tvaCollectee: number;
  tvaDeductible: number;
  tvaSolde: number;
}

export interface TaxResults {
  cotisationsSociales: number;
  cotisationsSocialesRate: number;
  cfpContribution: number;
  impotRevenu: number | null;
  impotRevenuMethod: "versement_liberatoire" | "bareme_progressif";
  revenuImposable: number;
  abattementForfaitaire: number;
  abattementMontant: number;
  tva: TVAStatus;
  revenuNet: number;
  plafondCA: number;
  isOverPlafond: boolean;
  isNearPlafond: boolean;
}
