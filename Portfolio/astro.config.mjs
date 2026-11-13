// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// ⚠️ Domaine de production : défini une seule fois dans src/lib/seo.js
// (SITE.url). Pense à mettre à jour aussi public/robots.txt si tu le changes.
import { SITE, projetPath } from "./src/lib/seo.js";
import { allProjets } from "./src/backend.mjs";

// Projets lus une fois ici pour : rediriger les anciennes adresses et dater
// les pages projet dans le sitemap. Si PocketBase ne répond pas, le site se
// construit quand même (sans redirections ni dates).
/** @type {any[]} */
let projets = [];
try {
	projets = await allProjets();
} catch (e) {
	console.warn("astro.config — PocketBase indisponible :", /** @type {Error} */ (e).message);
}

// Anciennes adresses /projet/<id PocketBase>/ (déjà connues de Google)
// -> nouvelle adresse lisible /projet/<slug>/.
/** @type {Record<string, string>} */
const redirects = {
	// ancienne page « Compétences », renommée « Mes maîtrises »
	"/competences/": "/maitrises/",
};
for (const p of projets) {
	if (p.slug && p.slug !== p.id) redirects[`/projet/${p.id}/`] = projetPath(p);
}

// date de dernière modification de chaque page projet (champ `updated` PocketBase)
/** @type {Map<string, string>} */
const lastmod = new Map();
for (const p of projets) {
	const d = new Date(String(p.updated ?? "").replace(" ", "T"));
	if (!Number.isNaN(d.getTime())) lastmod.set(new URL(projetPath(p), SITE.url).href, d.toISOString());
}

// https://astro.build/config
export default defineConfig({
	site: SITE.url,
	// toutes les URL finissent par "/" (comme les fichiers générés et le
	// serveur Apache) : un lien sans "/" donne une 404 en dev, donc se voit.
	trailingSlash: "always",
	redirects,
	integrations: [
		sitemap({
			// pages de redirection exclues : seule la nouvelle adresse est déclarée
			filter: (page) => !Object.keys(redirects).some((old) => page === new URL(old, SITE.url).href),
			serialize(item) {
				const d = lastmod.get(item.url);
				return d ? { ...item, lastmod: d } : item;
			},
		}),
	],
	image: {
		// Images PocketBase optimisées au build (redimensionnées + webp).
		remotePatterns: [
			{ protocol: "http", hostname: "127.0.0.1" },
			{ protocol: "https", hostname: "**.alex-ringenbach.fr" },
		],
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
