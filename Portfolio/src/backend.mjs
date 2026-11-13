import PocketBase from "pocketbase";
import { slugify } from "./lib/seo.js";

const pb = new PocketBase("https://api.alex-ringenbach.fr");


/* ------------------------------------------------------------------ */
/*  Fichiers                                                           */
/* ------------------------------------------------------------------ */

// `thumb` (optionnel) : dimension PocketBase, ex. "600x0" (redimensionne côté serveur)
export function getImageUrl(record, field, thumb) {
    if (!record || !record[field]) {
        return null;
    }

    // champ fichier simple (string) ou multiple (array) -> on prend le 1er
    const file = Array.isArray(record[field]) ? record[field][0] : record[field];
    if (!file) {
        return null;
    }

    return pb.files.getURL(record, file, thumb ? { thumb } : {});
}

export function getFileUrl(record, filename, thumb) {
    if (!record || !filename) {
        return null;
    }

    return pb.files.getURL(record, filename, thumb ? { thumb } : {});
}


/* ------------------------------------------------------------------ */
/*  Compétences                                                        */
/*  champs : nom, categorie (Logiciel | Langage de programmation),     */
/*           maitrise (Faible | Moyenne | Haute | Experte), Logo       */
/* ------------------------------------------------------------------ */

export async function allCompetences() {
    const records = await pb.collection("competences").getFullList({
        sort: "nom"
    });
    return records;
}

export async function allCompetencesByCategorie() {
    const records = await pb.collection("competences").getFullList({
        sort: "categorie,nom"
    });
    return records;
}

export async function competencesByCategorie(categorie) {
    const records = await pb.collection("competences").getFullList({
        filter: `categorie = "${categorie}"`,
        sort: "nom"
    });
    return records;
}

export async function competencesByMaitrise(maitrise) {
    const records = await pb.collection("competences").getFullList({
        filter: `maitrise = "${maitrise}"`,
        sort: "nom"
    });
    return records;
}

export async function oneCompetenceById(id) {
    const record = await pb.collection("competences").getOne(id);
    return record;
}


/* ------------------------------------------------------------------ */
/*  Projets                                                            */
/*  champs : titre, description, lien (url), image (multiple),          */
/*           type (site-web | maquette | Projet Personnel),             */
/*           competences (relation multiple -> competences),           */
/*           date (date de réalisation du projet, facultative)         */
/* ------------------------------------------------------------------ */

// Du plus récent au plus ancien : date du projet si renseignée, sinon
// date d'ajout dans PocketBase. Trié ici (et pas via `sort`) pour que ça
// marche même si le champ `date` n'existe pas encore dans la collection.
export function recentFirst(records) {
    const when = (r) => String(r.date || r.created || "");
    return [...records].sort((a, b) => when(b).localeCompare(when(a)));
}

// Adresse lisible de chaque projet (/projet/<slug>/), tirée du titre.
// Un champ `slug` rempli dans PocketBase est prioritaire. En cas de titres
// identiques, le plus ancien garde le slug nu, les suivants prennent -2, -3…
// (attribué dans l'ordre de création : un nouveau projet ne vole jamais
// l'adresse d'un ancien).
export function withSlugs(records) {
    const pris = new Set();
    const parCreation = [...records].sort((a, b) =>
        String(a.created ?? "").localeCompare(String(b.created ?? "")),
    );
    for (const r of parCreation) {
        const base = slugify(r.slug || r.titre) || r.id;
        let s = base;
        for (let n = 2; pris.has(s); n++) s = `${base}-${n}`;
        pris.add(s);
        r.slug = s;
    }
    return records;
}

export async function allProjets() {
    const records = await pb.collection("projets").getFullList({
        expand: "competences"
    });
    return recentFirst(withSlugs(records));
}

export async function allProjetsByType() {
    const records = await pb.collection("projets").getFullList({
        sort: "type,-created",
        expand: "competences"
    });
    return records;
}

export async function projetsByType(type) {
    const records = await pb.collection("projets").getFullList({
        filter: `type = "${type}"`,
        sort: "-created",
        expand: "competences"
    });
    return records;
}

// projets qui utilisent une compétence donnée
export async function projetsByCompetence(competenceId) {
    const records = await pb.collection("projets").getFullList({
        filter: `competences ~ "${competenceId}"`,
        sort: "-created",
        expand: "competences"
    });
    return records;
}

export async function oneProjetById(id) {
    const record = await pb.collection("projets").getOne(id, {
        expand: "competences"
    });
    return record;
}

// compétences liées à un projet (déjà récupérées via `expand`)
export function competencesOfProjet(projet) {
    return projet?.expand?.competences ?? [];
}

// L'éditeur de PocketBase (TinyMCE) encode les accents et la ponctuation en
// entités HTML (&eacute;, &rsquo;, &#39;…). Le corps des étapes est inséré en
// HTML (set:html) donc s'affiche bien, mais le titre est affiché comme texte :
// il faut le décoder, sinon on voit « l'id&eacute;e ».
const ENTITES = {
    amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
    rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", laquo: "«", raquo: "»",
    hellip: "…", ndash: "–", mdash: "—", euro: "€", deg: "°",
    oelig: "œ", OElig: "Œ", aelig: "æ", AElig: "Æ", szlig: "ß",
};
const ACCENTS = { acute: "́", grave: "̀", circ: "̂", uml: "̈", cedil: "̧", tilde: "̃", ring: "̊" };
export function decodeEntites(texte = "") {
    return texte.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
        if (e[0] === "#") {
            const n = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
            return Number.isFinite(n) ? String.fromCodePoint(n) : m;
        }
        if (e in ENTITES) return ENTITES[e];
        // lettres accentuées : &eacute; = e + accent aigu, &Ccedil; = C + cédille…
        const acc = /^([a-z])(acute|grave|circ|uml|cedil|tilde|ring)$/i.exec(e);
        return acc ? (acc[1] + ACCENTS[acc[2]]).normalize("NFC") : m;
    });
}

// processus (champ éditeur HTML) -> étapes { titre, html }
// chaque <h3> démarre une étape, son contenu va jusqu'au <h3> suivant.
// Le numéro "1." saisi dans PocketBase est retiré (la carte l'affiche déjà).
export function processusOfProjet(projet) {
    const html = projet?.processus ?? "";
    const etapes = [];
    const re = /<h3[^>]*>([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3|$)/g;
    let m;
    while ((m = re.exec(html)) !== null) {
        const titre = decodeEntites(m[1].replace(/<[^>]+>/g, ""))
            .replace(/^\s*\d+\s*[.)-]\s*/, "")
            .trim();
        etapes.push({ titre, html: m[2].trim() });
    }
    return etapes;
}

