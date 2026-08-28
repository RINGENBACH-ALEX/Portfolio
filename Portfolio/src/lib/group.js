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
