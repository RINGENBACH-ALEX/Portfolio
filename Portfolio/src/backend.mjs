import PocketBase from "pocketbase";

const pb = new PocketBase("http://127.0.0.1:8090");


/* ------------------------------------------------------------------ */
/*  Fichiers                                                           */
/* ------------------------------------------------------------------ */

export function getImageUrl(record, field) {
    if (!record || !record[field]) {
        return null;
    }

    return pb.files.getURL(record, record[field]);
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

