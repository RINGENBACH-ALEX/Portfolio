// Carrousel horizontal générique.
// Markup attendu dans un conteneur [data-carousel] :
//   [data-track]        -> la piste scrollable (flex + overflow-x-auto)
//   [data-prev] / [data-next]  -> boutons flèches
//   [data-progress-bar] -> barre de progression (transform: scaleX)
//   [data-count]        -> compteur "03 / 05"
//   [data-more]         -> lien "voir plus", révélé une fois arrivé au bout

function initCarousel(root) {
	const track = root.querySelector("[data-track]");
	const prev = root.querySelector("[data-prev]");
	const next = root.querySelector("[data-next]");
	const bar = root.querySelector("[data-progress-bar]");
	const count = root.querySelector("[data-count]");
	const more = root.querySelector("[data-more]");
	if (!track || !prev || !next) return;

	const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
	const total = track.children.length;
	const pad = (n) => String(n).padStart(2, "0");

	const step = () => {
		const card = track.firstElementChild;
		if (!card) return track.clientWidth;
		const gap = parseFloat(getComputedStyle(track).columnGap || "16") || 16;
		return card.offsetWidth + gap;
	};

	function update() {
		const max = track.scrollWidth - track.clientWidth;
		const atStart = track.scrollLeft <= 2;
		const atEnd = track.scrollLeft >= max - 2;
		const progress = max > 0 ? track.scrollLeft / max : 0;

		const scrollable = max > 0;
		for (const [btn, off] of [
			[prev, atStart],
			[next, atEnd],
		]) {
			btn.classList.toggle("opacity-30", off);
			btn.classList.toggle("pointer-events-none", off);
		}
		if (more) {
			more.classList.toggle("hidden", !atEnd);
			more.classList.toggle("inline-flex", atEnd);
		}
		if (bar) bar.style.transform = `scaleX(${progress})`;
		if (count) {
			const i = atEnd
				? total
				: Math.min(total, Math.round(track.scrollLeft / step()) + 1);
			count.textContent = scrollable ? `${pad(i)} / ${pad(total)}` : "";
		}
		track.style.setProperty("--fade-l", atStart ? "0px" : "2rem");
		track.style.setProperty("--fade-r", atEnd || max <= 0 ? "0px" : "2rem");
	}

	const go = (dir) =>
		track.scrollBy({
			left: dir * step(),
			behavior: reduce ? "auto" : "smooth",
		});

	prev.addEventListener("click", () => go(-1));
	next.addEventListener("click", () => go(1));
	track.addEventListener("scroll", update, { passive: true });
	window.addEventListener("resize", update);

	// navigation clavier quand la piste a le focus
	track.addEventListener("keydown", (e) => {
		if (e.key === "ArrowRight") {
			e.preventDefault();
			go(1);
		} else if (e.key === "ArrowLeft") {
			e.preventDefault();
			go(-1);
		}
	});

	// glisser à la souris (le tactile utilise le scroll natif)
	let dragging = false;
	let startX = 0;
	let startLeft = 0;
	let moved = 0;

	track.addEventListener("pointerdown", (e) => {
		if (e.pointerType !== "mouse") return;
		dragging = true;
		moved = 0;
		startX = e.clientX;
		startLeft = track.scrollLeft;
		track.classList.add("is-dragging");
	});
	window.addEventListener("pointermove", (e) => {
		if (!dragging) return;
		const dx = e.clientX - startX;
		moved = Math.max(moved, Math.abs(dx));
		track.scrollLeft = startLeft - dx;
	});
	window.addEventListener("pointerup", () => {
		if (!dragging) return;
		dragging = false;
		track.classList.remove("is-dragging");
		// neutralise le clic qui suit un vrai glissement (sinon on ouvre une carte)
		if (moved > 6) {
			const kill = (ev) => {
				ev.preventDefault();
				ev.stopPropagation();
			};
			track.addEventListener("click", kill, { capture: true, once: true });
			setTimeout(
				() => track.removeEventListener("click", kill, { capture: true }),
				0,
			);
		}
	});

	update();
}

document.querySelectorAll("[data-carousel]").forEach(initCarousel);
