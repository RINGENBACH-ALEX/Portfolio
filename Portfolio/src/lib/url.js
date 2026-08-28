/** Nom d'hôte d'une URL, sans "www." — chaîne vide si l'URL est absente ou invalide. */
export function hostname(url) {
	try {
		return url ? new URL(url).hostname.replace(/^www\./, "") : "";
	} catch {
		return "";
	}
}
