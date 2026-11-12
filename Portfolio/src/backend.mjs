import PocketBase from "pocketbase";

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

export async function allProjets() {
    const records = await pb.collection("projets").getFullList({
        expand: "competences"
    });
    return recentFirst(records);
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

// processus (champ éditeur HTML) -> étapes { titre, html }
// chaque <h3> démarre une étape, son contenu va jusqu'au <h3> suivant.
// Le numéro "1." saisi dans PocketBase est retiré (la carte l'affiche déjà).
export function processusOfProjet(projet) {
    const html = projet?.processus ?? "";
    const etapes = [];
    const re = /<h3[^>]*>([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3|$)/g;
    let m;
    while ((m = re.exec(html)) !== null) {
        const titre = m[1]
            .replace(/<[^>]+>/g, "")
            .replace(/^\s*\d+\s*[.)-]\s*/, "")
            .trim();
        etapes.push({ titre, html: m[2].trim() });
    }
    return etapes;
}

