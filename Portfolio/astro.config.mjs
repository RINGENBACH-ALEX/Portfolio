// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
	image: {
		// Images PocketBase optimisées au build (redimensionnées + webp).
		// ⚠️ ajouter ici le domaine PocketBase de prod le moment venu.
		remotePatterns: [
			{ protocol: "http", hostname: "127.0.0.1" },
			{ protocol: "https", hostname: "**.alex-ringenbach.fr" },
		],
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
