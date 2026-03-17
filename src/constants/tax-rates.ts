/**
 * Taux et seuils fiscaux pour les auto-entrepreneurs en France (2025)
 * Sources: urssaf.fr, impots.gouv.fr, service-public.fr
 */

export const ACTIVITY_TYPES = [
  {
    id: "bic_vente",
    label: "BIC – Vente de marchandises",
    description: "Commerce, achat-revente, hébergement (hôtels, meublés classés)",
    plafondCA: 188700,
    cotisationsSociales: 12.3,
    versementLiberatoire: 1.0,
    abattementForfaitaire: 71,
    tvaFranchise: 85000,
    tvaSeuilleMajore: 93500,
    tvaRate: 20,
    cfpRate: 0.1,
  },
  {
    id: "bic_services",
    label: "BIC – Prestations de services commerciales/artisanales",
    description: "Artisanat, services commerciaux (plombier, coiffeur, électricien…)",
    plafondCA: 77700,
    cotisationsSociales: 21.2,
    versementLiberatoire: 1.7,
    abattementForfaitaire: 50,
    tvaFranchise: 37500,
    tvaSeuilleMajore: 41250,
    tvaRate: 20,
    cfpRate: 0.2,
  },
  {
    id: "bnc_ssi",
    label: "BNC – Professions libérales (SSI)",
    description: "Consultant, formateur, développeur, graphiste, coach… affilié SSI",
    plafondCA: 77700,
    cotisationsSociales: 24.6,
    versementLiberatoire: 2.2,
    abattementForfaitaire: 34,
    tvaFranchise: 37500,
    tvaSeuilleMajore: 41250,
    tvaRate: 20,
    cfpRate: 0.2,
  },
  {
    id: "bnc_cipav",
    label: "BNC – Professions libérales (CIPAV)",
    description: "Architecte, géomètre, expert-comptable, avocat… affilié CIPAV",
    plafondCA: 77700,
    cotisationsSociales: 23.2,
    versementLiberatoire: 2.2,
    abattementForfaitaire: 34,
    tvaFranchise: 37500,
    tvaSeuilleMajore: 41250,
    tvaRate: 20,
    cfpRate: 0.2,
  },
] as const;

export type ActivityTypeId = (typeof ACTIVITY_TYPES)[number]["id"];

/** Taux TVA courants en France (2025) */
export const TVA_RATES = [
  { label: "20% – Taux normal", value: 20 },
  { label: "10% – Taux intermédiaire (restauration, travaux)", value: 10 },
  { label: "5.5% – Taux réduit (alimentation, livres)", value: 5.5 },
  { label: "2.1% – Taux super-réduit (médicaments)", value: 2.1 },
  { label: "0% – Exonéré", value: 0 },
] as const;

/** Seuil de revenu fiscal de référence pour le versement libératoire (2025) */
export const VERSEMENT_LIBERATOIRE_PLAFOND_PAR_PART = 28797;

/** Taux ACRE : réduction de 50% des cotisations sociales la 1ère année */
export const ACRE_REDUCTION = 0.5;

/** Seuil d'exonération CFE (chiffre d'affaires < 5 000 €) */
export const CFE_EXEMPTION_THRESHOLD = 5000;
