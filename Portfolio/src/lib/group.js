/** Regroupe une liste par la valeur d'un champ, en gardant l'ordre d'apparition. */
export function groupBy(items, key, fallback = "Autres") {
	const groups = [];
	for (const item of items) {
		const val = item[key] || fallback;
		let g = groups.find((x) => x.nom === val);
		if (!g) groups.push((g = { nom: val, items: [] }));
		g.items.push(item);
	}
	return groups;
}

/**
 * Filtres d'une FilterBar : d'abord les catégories de `labels` dans leur
 * ordre (même vides, compteur à 0), puis celles présentes dans les données
 * mais absentes de `labels`.
 */
export function filtresFrom(items, key, labels, fallback = "Autres") {
	const count = (v) => items.filter((i) => (i[key] || fallback) === v).length;
	const extra = groupBy(items, key, fallback)
		.map((g) => g.nom)
		.filter((v) => !(v in labels));
	return [...Object.keys(labels), ...extra].map((value) => ({
		value,
		label: labels[value] ?? value,
		count: count(value),
	}));
}
