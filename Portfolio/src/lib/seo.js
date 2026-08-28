/* ------------------------------------------------------------------ */
/*  Identité du site — source unique pour le SEO / les données        */
/*  structurées / l'Open Graph.                                        */
/* ------------------------------------------------------------------ */

export const SITE = {
	url: "https://alex-ringenbach.fr",
	name: "Alex Ringenbach — Portfolio",
	shortName: "Alex Ringenbach",
	lang: "fr-FR",
	author: "Alex Ringenbach",
	email: "alex.ringenbach0@gmail.com",
	jobTitle: "Designer graphique",
	description:
		"Portfolio d'Alex Ringenbach, designer graphique et étudiant en BUT MMI à Montbéliard : identité visuelle, design éditorial, UI/UX et développement web.",
	locality: "Montbéliard",
	region: "Bourgogne-Franche-Comté",
	country: "FR",
	sameAs: [
		"https://www.linkedin.com/in/alex-ringenbach/",
		"https://github.com/RINGENBACH-ALEX",
		"https://www.instagram.com/alex_tremitee/",
	],
	// image de partage (Open Graph / Twitter) — 1200×630
	ogImage: "/og.png",
};

/** URL absolue à partir d'un chemin relatif. */
export function abs(path = "/") {
	return new URL(path, SITE.url).href;
}

/** Tronque un texte proprement (sur un mot) pour une meta description. */
export function excerpt(text = "", max = 160) {
	const t = text.trim().replace(/\s+/g, " ");
	if (t.length <= max) return t;
	return t.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

/** Nœud JSON-LD "Person" (Alex). */
export function personNode() {
	return {
		"@type": "Person",
		"@id": `${SITE.url}/#person`,
		name: SITE.author,
		url: SITE.url,
		image: abs("/portrait.jpg"),
		jobTitle: SITE.jobTitle,
		email: `mailto:${SITE.email}`,
		address: {
			"@type": "PostalAddress",
			addressLocality: SITE.locality,
			addressRegion: SITE.region,
			addressCountry: SITE.country,
		},
		alumniOf: {
			"@type": "CollegeOrUniversity",
			name: "BUT Métiers du Multimédia et de l'Internet",
		},
		knowsAbout: [
			"Design graphique",
			"Identité visuelle",
			"Typographie",
			"Design éditorial",
			"UI/UX design",
			"Développement web",
		],
		sameAs: SITE.sameAs,
	};
}

/** Nœud JSON-LD "WebSite". */
export function websiteNode() {
	return {
		"@type": "WebSite",
		"@id": `${SITE.url}/#website`,
		url: SITE.url,
		name: SITE.name,
		description: SITE.description,
		inLanguage: SITE.lang,
		publisher: { "@id": `${SITE.url}/#person` },
	};
}

/** Fil d'Ariane JSON-LD à partir d'une liste [{name, path}]. */
export function breadcrumbNode(items) {
	return {
		"@type": "BreadcrumbList",
		itemListElement: items.map((it, i) => ({
			"@type": "ListItem",
			position: i + 1,
			name: it.name,
			item: abs(it.path),
		})),
	};
}
