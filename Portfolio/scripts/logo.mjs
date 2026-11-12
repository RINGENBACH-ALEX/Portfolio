/**
 * Génère toutes les déclinaisons du logo à partir de src/assets/logo-source.png
 * (lettres blanches sur fond noir, 901×901).
 *
 *   node scripts/logo.mjs
 *
 * - src/assets/logo-transparent.webp : lettres blanches sur fond transparent
 *   (en-tête, menu mobile, pied de page)
 * - public/favicon.ico (16/32/48), favicon-16.png, favicon-32.png,
 *   apple-touch-icon.png (180) : lettres blanches sur fond noir
 *
 * Aux petites tailles, les traits fins du logo sont épaissis (flou + seuil)
 * pour ne pas disparaître une fois réduits à quelques pixels.
 */
import sharp from "sharp";
import { writeFileSync } from "node:fs";

const SRC = "src/assets/logo-source.png";
const WORK = 512; // résolution de travail du masque

// 1. masque des lettres (blanc = lettre), marges noires retirées, carré
const lettres = await sharp(SRC).trim({ background: "#000", threshold: 40 }).toBuffer();
const masque = async (taille, marge, gras = 0) => {
	const inner = Math.round(WORK * (1 - 2 * marge));
	let m = sharp(
		await sharp({ create: { width: WORK, height: WORK, channels: 3, background: "#000" } })
			.composite([{ input: await sharp(lettres).resize(inner, inner, { fit: "contain", background: "#000" }).toBuffer(), gravity: "center" }])
			.png()
			.toBuffer(),
	).greyscale();
	// épaississement : flou puis renforcement du contraste = trait plus large
	if (gras > 0) m = sharp(await m.blur(gras).linear(2.6, -25).png().toBuffer()).greyscale();
	return m.resize(taille, taille, { kernel: "lanczos3" }).linear(1.1, -8).raw().toBuffer();
};
const rgba = async (taille, alpha, fond) =>
	fond
		? sharp({ create: { width: taille, height: taille, channels: 3, background: fond } })
				.composite([{ input: await sharp({ create: { width: taille, height: taille, channels: 3, background: "#fff" } }).joinChannel(alpha, { raw: { width: taille, height: taille, channels: 1 } }).png().toBuffer() }])
				.png({ compressionLevel: 9 })
				.toBuffer()
		: sharp({ create: { width: taille, height: taille, channels: 3, background: "#fff" } })
				.joinChannel(alpha, { raw: { width: taille, height: taille, channels: 1 } });

// 2. logo du site (fond transparent), 192 px : net jusqu'à 64 px affichés en 3x
await (await rgba(192, await masque(192, 0.02))).webp({ lossless: true }).toFile("src/assets/logo-transparent.webp");

// 3. favicons (fond noir)
const GRAS = { 16: 9, 32: 5, 48: 3, 180: 0 };
const MARGE = { 16: 0.02, 32: 0.04, 48: 0.06, 180: 0.14 };
const png = {};
for (const t of [16, 32, 48, 180]) png[t] = await rgba(t, await masque(t, MARGE[t], GRAS[t]), "#000");
writeFileSync("public/favicon-16.png", png[16]);
writeFileSync("public/favicon-32.png", png[32]);
writeFileSync("public/apple-touch-icon.png", png[180]);

// .ico multi-tailles (PNG embarqués)
const tailles = [16, 32, 48];
const tete = Buffer.alloc(6);
tete.writeUInt16LE(1, 2);
tete.writeUInt16LE(tailles.length, 4);
let pos = 6 + 16 * tailles.length;
const entrees = tailles.map((t) => {
	const e = Buffer.alloc(16);
	e.writeUInt8(t, 0);
	e.writeUInt8(t, 1);
	e.writeUInt16LE(1, 4);
	e.writeUInt16LE(32, 6);
	e.writeUInt32LE(png[t].length, 8);
	e.writeUInt32LE(pos, 12);
	pos += png[t].length;
	return e;
});
writeFileSync("public/favicon.ico", Buffer.concat([tete, ...entrees, ...tailles.map((t) => png[t])]));
console.log("logo + favicons générés");
