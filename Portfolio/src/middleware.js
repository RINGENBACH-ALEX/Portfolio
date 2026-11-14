import { defineMiddleware } from "astro:middleware";
import { MAINTENANCE, MAINTENANCE_PATH } from "./lib/maintenance.js";

// En maintenance, chaque page est remplacée par une redirection vers
// /maintenance/ : en dev c'est une vraie redirection HTTP, au build Astro
// écrit à la place du contenu une page de redirection immédiate
// (statut 307 -> délai 0). Aucune page du site n'est donc publiée.
export const onRequest = defineMiddleware((context, next) => {
	const path = context.url.pathname;
	const onMaintenancePage = path === MAINTENANCE_PATH;

	if (MAINTENANCE && !onMaintenancePage) {
		return context.redirect(MAINTENANCE_PATH, 307);
	}
	// maintenance terminée : l'ancienne page renvoie vers l'accueil
	if (!MAINTENANCE && onMaintenancePage) {
		return context.redirect("/", 307);
	}
	return next();
});
