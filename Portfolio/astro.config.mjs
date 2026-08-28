// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// ⚠️ Domaine de production : défini une seule fois dans src/lib/seo.js
// (SITE.url). Pense à mettre à jour aussi public/robots.txt si tu le changes.
import { SITE } from "./src/lib/seo.js";

// https://astro.build/config
export default defineConfig({
	site: SITE.url,
	integrations: [sitemap()],
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
