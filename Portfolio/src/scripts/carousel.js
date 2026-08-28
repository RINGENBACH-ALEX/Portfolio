// Carrousel horizontal générique.
// Markup attendu dans un conteneur [data-carousel] :
//   [data-track]  -> la piste scrollable (flex + overflow-x-auto)
//   [data-prev] / [data-next] -> boutons flèches
//   [data-more]   -> lien "voir plus", révélé une fois arrivé au bout

function initCarousel(root) {
	const track = root.querySelector("[data-track]");
	const prev = root.querySelector("[data-prev]");
	const next = root.querySelector("[data-next]");
	const more = root.querySelector("[data-more]");
	if (!track || !prev || !next) return;

	const step = () => {
		const card = track.firstElementChild;
		if (!card) return track.clientWidth;
		const gap = parseFloat(getComputedStyle(track).columnGap || "16") || 16;
		return card.offsetWidth + gap;
	};

	function update() {
		const atStart = track.scrollLeft <= 2;
		const atEnd =
			track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;

		prev.classList.toggle("invisible", atStart);
		next.classList.toggle("invisible", atEnd);
		if (more) {
			more.classList.toggle("hidden", !atEnd);
			more.classList.toggle("inline-flex", atEnd);
		}
	}

	prev.addEventListener("click", () =>
		track.scrollBy({ left: -step(), behavior: "smooth" }),
	);
	next.addEventListener("click", () =>
		track.scrollBy({ left: step(), behavior: "smooth" }),
	);
	track.addEventListener("scroll", update, { passive: true });
	window.addEventListener("resize", update);
	update();
}

document.querySelectorAll("[data-carousel]").forEach(initCarousel);
