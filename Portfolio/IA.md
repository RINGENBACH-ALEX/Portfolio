# Déclaration d'usage de l'intelligence artificielle

Ce fichier déclare, pour chaque outil d'IA utilisé sur le portfolio : **à quelle étape**, **pour quoi faire**, et **ce que j'ai modifié, corrigé ou rejeté** dans ce qu'il a produit.

> Les passages marqués **[À COMPLÉTER]** sont des informations que seul l'auteur peut fournir. Ils doivent être remplis avant le rendu.

## Récapitulatif

| Outil | Étape(s) | Usage | Part du travail final |
|---|---|---|---|
| **Claude Code** (Anthropic, extension VS Code) | Intégration, qualité | Assistance au code Astro / Tailwind, audit qualité, corrections | [À COMPLÉTER : estimation honnête, ex. « environ X % du code écrit avec assistance »] |
| **Figma MCP** (via Claude Code) | [À COMPLÉTER] | [À COMPLÉTER : ex. export d'un visuel Figma → image `mcp_figma_blob…` du projet Focale] | [À COMPLÉTER] |
| [À COMPLÉTER : ChatGPT ? Copilot ? Midjourney ? Figma AI ?] | | | |

Ce qui **n'a pas** été produit par une IA : [À COMPLÉTER — ex. le positionnement, la direction artistique, les maquettes Figma, les visuels des projets, les textes de présentation…]

---

## 1. Claude Code — intégration du site

### Étape et usage
[À COMPLÉTER — décrire les sessions de développement d'août à novembre 2026. Exemples à adapter :]

- **Grille de mise en page (septembre 2026).** J'ai demandé que toutes les pages partagent une grille unique de 12 colonnes (4 sur mobile, 8 sur tablette), au lieu de largeurs `max-w-*` disparates. Cela a donné la classe `.grid-page` dans `src/styles/global.css` et le composant `Section.astro`. La décision venait de moi, l'IA a écrit l'implémentation.
- [À COMPLÉTER : composants (carrousel, filtres, menu mobile), connexion à PocketBase (`backend.mjs`), SEO (`lib/seo.js`, JSON-LD), page 404…]

### Ce que j'ai modifié, corrigé ou rejeté
[À COMPLÉTER — c'est la partie la plus importante pour le jury. Exemples de formulation :]
- « La première version du carrousel … ; je l'ai remplacée par … parce que … »
- « J'ai refusé … (ex. une librairie de slider externe) pour garder … »
- « J'ai réécrit les textes de … car la proposition ne correspondait pas à ma voix. »
- « En relisant, j'ai repéré que … ne fonctionnait pas sur … ; j'ai corrigé en … »

---

## 2. Claude Code — audit qualité et livrables (session du 12/11/2026)

### Étape et usage
Phase « Qualité » (point 6 du cahier des charges). J'ai demandé à Claude Code de m'aider à produire `QUALITE.md` et ce fichier `IA.md`. Il a :

1. **Audité le build de production.** Lighthouse sur 8 pages, recherche dans le HTML généré, inspection de la base PocketBase, test A/B pour mesurer le coût des animations.
2. **Proposé et appliqué des corrections**, détaillées dans `QUALITE.md` :
   - `projet/[id].astro` : les liens « agrandir » pointaient vers `http://127.0.0.1:8090`. Ils utilisent maintenant `getImage()` et pointent vers les WebP générées au build.
   - `CompetenceCard.astro` : animation des jauges au scroll (`animation-timeline: view()`) remplacée par une transition déclenchée une seule fois par un `IntersectionObserver`. Coût mesuré : 7,7 s de travail du thread principal avant, 2,1 s après.
   - `ProjetCard.astro` : suppression de l'`aria-label` qui contredisait le libellé visible, ajout de « (nouvel onglet) » pour les lecteurs d'écran, ajout d'une prop `eager`.
   - `projets.astro` : `<h2>` masqué pour corriger la hiérarchie des titres, 2 premières cartes en `eager`.
   - `Hero.astro`, `profil.astro` : portrait en `widths` + `sizes` au lieu de `densities`.
   - `Header.astro` : lien de la page active passé de rouge sur noir (contraste 3,3:1) à blanc souligné.
   - `contact.astro` : mention RGPD sous le formulaire, vouvoiement harmonisé dans les messages.
   - `mentions-legales.astro` : suppression de la fausse mention « Google Fonts », ajout du transfert hors UE (FormSubmit), d'une durée de conservation, de la CNIL, de la licence OFL de la police et d'une mention de l'usage de l'IA.
   - `About.astro`, `profil.astro` : « Montbeliard » → « Montbéliard ».
3. **Rédigé une première version** de `QUALITE.md` et de ce fichier.

### Ce que j'ai vérifié, modifié ou rejeté
[À COMPLÉTER après relecture du diff (`git diff`). Points à vérifier en particulier :]
- La **durée de conservation de 1 an** dans les mentions légales est une proposition de l'IA. [Je la garde / je la remplace par …]
- La couleur de survol rouge sur fond noir n'a **pas** été modifiée (choix de direction artistique). [Je la garde / je la change]
- [Ce que j'ai réécrit dans `QUALITE.md` pour qu'il reflète mes propres vérifications, ex. tests NVDA, zoom, mesures en ligne.]

---

## 3. [Autre outil] — [À COMPLÉTER]

- **Étape :**
- **Usage :**
- **Ce que j'ai gardé / modifié / rejeté :**

---

## Maîtrise du code

Je dois pouvoir expliquer chacun de ces éléments devant le jury. Je l'ai coché après l'avoir relu et compris.

- [ ] Génération statique des pages projet : `getStaticPaths()` dans `src/pages/projet/[id].astro`, appel à PocketBase **au build uniquement**
- [ ] Optimisation d'images : `<Image>` / `getImage()` d'`astro:assets` (WebP, redimensionnement, `widths` / `sizes`)
- [ ] Grille : `.grid-page`, `.col-full`, `.col-prose` et l'ordre des `@layer` Tailwind
- [ ] Carrousel (`src/scripts/carousel.js`) : défilement, clavier, glisser à la souris
- [ ] Filtres (`FilterBar.astro`) : `aria-pressed`, `aria-live`, filtre gardé dans l'URL
- [ ] Menu mobile (`Header.astro`) : focus piégé, Échap, `aria-expanded`
- [ ] Formulaire (`contact.astro`) : envoi `fetch` vers FormSubmit, champ anti-spam, repli sans JavaScript
- [ ] SEO (`lib/seo.js`, `Layout.astro`) : canonical, Open Graph, JSON-LD
- [ ] Jauges (`CompetenceCard.astro`) : `IntersectionObserver`, et pourquoi c'est moins coûteux qu'`animation-timeline`
