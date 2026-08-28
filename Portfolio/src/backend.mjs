import PocketBase from "pocketbase";

const pb = new PocketBase("http://127.0.0.1:8090");


/* ------------------------------------------------------------------ */
/*  Fichiers                                                           */
/* ------------------------------------------------------------------ */

export function getImageUrl(record, field) {
    if (!record || !record[field]) {
        return null;
    }

    // champ fichier simple (string) ou multiple (array) -> on prend le 1er
    const file = Array.isArray(record[field]) ? record[field][0] : record[field];
    if (!file) {
        return null;
    }

    return pb.files.getURL(record, file);
}

export function getFileUrl(record, filename) {
    if (!record || !filename) {
        return null;
    }

    return pb.files.getURL(record, filename);
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
/*           type (site-web | maquette)                                 */
/* ------------------------------------------------------------------ */

export async function allProjets() {
    const records = await pb.collection("projets").getFullList({
        sort: "-created"
    });
    return records;
}

export async function allProjetsByType() {
    const records = await pb.collection("projets").getFullList({
        sort: "type,-created"
    });
    return records;
}

export async function projetsByType(type) {
    const records = await pb.collection("projets").getFullList({
        filter: `type = "${type}"`,
        sort: "-created"
    });
    return records;
}

export async function oneProjetById(id) {
    const record = await pb.collection("projets").getOne(id);
    return record;
}

