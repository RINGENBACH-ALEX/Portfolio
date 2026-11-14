/* ------------------------------------------------------------------ */
/*  Mode maintenance — interrupteur unique.                            */
/*  true  : TOUTES les pages (et tout lien interne) renvoient vers     */
/*          /maintenance/.                                             */
/*  false : site normal ; /maintenance/ renvoie vers l'accueil.        */
/*  Relancer `npm run build` puis redéployer après chaque changement.  */
/* ------------------------------------------------------------------ */

export const MAINTENANCE = true;

export const MAINTENANCE_PATH = "/maintenance/";
