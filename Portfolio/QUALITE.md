# Grille de contrôle qualité — alex-ringenbach.fr

Pour chaque critère : **pourquoi il compte sur ce site**, **ce que j'ai vérifié et comment**, **ce que j'ai corrigé** (ou pourquoi je ne l'ai pas fait).

## Contexte technique (il détermine les critères)

- **Site statique généré par Astro.** PocketBase n'est appelé **qu'au moment du build** pour récupérer les projets et compétences. En production il n'y a ni base de données ni API : uniquement du HTML, du CSS, quelques scripts inline et des images.
- **Contenus fournis par PocketBase** : images PNG d'origine lourdes, texte HTML du « processus » saisi dans un éditeur riche. Les risques sont donc le poids des images, les liens vers le serveur local et les URL techniques.
- **Direction artistique sombre et animée** (vagues SVG, halos flous, glitch sur la 404). Les risques sont le contraste, le mouvement et le coût CPU.
- **Un formulaire de contact** qui passe par un service tiers (FormSubmit). C'est la seule collecte de données personnelles du site.
- **Des projets d'école présentant des marques**, une police externe et des logos de logiciels. C'est ce qui pose des questions de propriété intellectuelle.

## Méthode et outils

| Outil | Usage |
|---|---|
| `npm run build` + `astro preview` | Contrôles faits sur le **build de production**, pas sur le serveur de dev |
| Lighthouse 12.8.2 (CLI, profil mobile, Chrome) | Performance, accessibilité automatisée, SEO, bonnes pratiques, sur 8 pages : accueil, `/projets`, `/competences`, `/profil`, `/contact`, `/mentions-legales`, une page projet, 404 |
| Onglet réseau Lighthouse (`network-requests`) | Liste des domaines contactés, pour vérifier les promesses RGPD |
| `grep` sur `dist/` | Nombre de `<h1>`, `<title>`, `alt`, `127.0.0.1`, `target="_blank"` dans le HTML généré |
| Test A/B Lighthouse | Copie d'une page avec une animation désactivée, pour mesurer son coût réel |
| Calcul de ratio WCAG | Contrastes des couples de couleurs de la charte (`#c50337`, `#02060e`, blanc) |
| Lecture du code | Clavier, ARIA, `prefers-reduced-motion` |
| `curl -I` sur le domaine | État de la mise en ligne |

> ⚠️ Au 12/11/2026, `alex-ringenbach.fr` sert encore une ancienne page (dernière modification en décembre 2024). Les mesures ont donc été faites en local sur le build de production. **Il faudra les refaire sur le site en ligne** (voir « Reste à faire »).

## Synthèse des mesures (Lighthouse mobile)

| Page | Perf. | Access. | SEO | Poids | Requêtes | Nœuds DOM | LCP |
|---|---|---|---|---|---|---|---|
| Accueil | 98 | 100 | 100 | 168 Kio | 12 | 352 | 2,0 s |
| /projets | 94 | 100 | 100 | 172 Kio | 20 | 311 | 1,8 s |
| /competences | 100 | 100 | 100 | 73 Kio | 15 | 380 | 1,4 s |
| /profil | 95 | 100 | 100 | 127 Kio | 7 | 196 | 1,8 s |
| /contact | 100 | 100 | 100 | 38 Kio | 6 | 133 | 1,2 s |
| /mentions-legales | 100 | 100 | 100 | 39 Kio | 6 | 158 | 1,2 s |
| /projet/… (Radiance) | 100 | 100 | 100 | 85 Kio | 11 | 204 | 1,6 s |
| 404 | 100 | 100 | 69 \* | 38 Kio | 6 | — | 1,2 s |

\* Le SEO de la 404 est volontairement bas : la page est en `noindex`.
CLS = 0 sur toutes les pages. Le score de performance varie de ± 5 points d'un passage à l'autre (TBT en environnement simulé).

---

## 1. Accessibilité

| # | Critère et pourquoi ici | Vérification | Résultat / correction |
|---|---|---|---|
| A1 | **Contraste sur fonds sombres et rouges** : toute la charte repose sur du blanc, du noir `#02060e` et du rouge `#c50337` | Calcul des ratios WCAG | Blanc sur noir ≈ 20:1 ✅ · blanc sur rouge ≈ 6,1:1 ✅ · rouge sur blanc ≈ 6,1:1 ✅ · **rouge sur noir ≈ 3,3:1 ❌** (le minimum est 4,5:1 pour du texte normal). **Corrigé :** le lien de la page active dans le menu desktop était en rouge sur noir, en 10 px. Il est désormais blanc et souligné en rouge (`Header.astro`). **Limite connue :** les états de *survol* passent encore en rouge sur fond noir. C'est un état temporaire déclenché par la souris, mais non conforme au sens strict. |
| A2 | **Hiérarchie des titres** : les pages sont composées de nombreux composants (cartes, carrousels) | `grep '<h1'` sur `dist/` + audit `heading-order` | Un seul `<h1>` sur chacune des 16 pages ✅. **Corrigé :** `/projets` passait de `h1` à `h3` (titres des cartes). Ajout d'un `<h2>` « Liste des projets » visible des lecteurs d'écran uniquement. |
| A3 | **Nom accessible = libellé visible** (WCAG 2.5.3) | Audit `label-content-name-mismatch` | **Corrigé :** le lien image des cartes projet avait un `aria-label` égal au titre, qui masquait le badge visible « Site web » / « Maquette ». J'ai supprimé l'`aria-label` : le nom vient désormais du `alt` de l'image et du badge. Il est conservé uniquement quand la carte n'a pas d'image. |
| A4 | **Liens qui ouvrent un nouvel onglet** : nombreux sur ce site (projets en ligne, réseaux, agrandissement d'images) | `grep target="_blank"` | Le pied de page signalait déjà « (nouvel onglet) ». **Corrigé :** ajout de ce texte en `sr-only` sur les liens « Voir en ligne » des cartes, sur « Ouvrir le projet » et sur les images agrandies des pages projet. |
| A5 | **Images** : visuels de projets issus de PocketBase, images décoratives floutées, logos | Audit `image-alt` + lecture de `ProjetCard` / `CompetenceCard` | Visuels de projet : `alt` = titre du projet (+ « aperçu n »). Fonds flous et logos du pied de page : `alt=""` + `aria-hidden`. Icônes SVG : `aria-hidden`. ✅ |
| A6 | **Navigation clavier** : menu mobile plein écran, carrousels, filtres | Lecture du code + test Tab / Maj+Tab / Échap | Lien d'évitement « Aller au contenu ». Focus visible (`outline` rouge, visible sur fond clair comme sombre). Menu mobile : `aria-expanded`, focus piégé dans le menu, fermeture par Échap, retour du focus sur le bouton. Carrousel : piste focusable, flèches du clavier, boutons nommés. Filtres : `aria-pressed` et annonce du nombre de résultats (`aria-live`). ✅ |
| A7 | **Formulaire de contact** | Lecture de `Field.astro` / `contact.astro` | Chaque champ a son `<label>`, ainsi que `required` et `autocomplete` (nom, e-mail). Le message de résultat est dans une région `role="status"`. Le champ anti-spam est caché et retiré de la tabulation. ✅ |
| A8 | **Mouvement** : vagues animées en boucle, glitch, rideau du menu, jauges | Recherche de `prefers-reduced-motion` dans le code | Toutes les animations sont coupées si l'utilisateur a demandé à réduire les animations (`global.css` + chaque composant). ✅ |
| A9 | **Langue** | Lighthouse `html-has-lang` | `<html lang="fr">` ✅ |

**Non vérifié (à faire) :** un test réel au lecteur d'écran (NVDA) sur le carrousel et les filtres, et un zoom à 200 % sans défilement horizontal.

## 2. Sobriété et performance

| # | Critère et pourquoi ici | Vérification | Résultat / correction |
|---|---|---|---|
| P1 | **Coût CPU des animations** : direction artistique très animée | Test A/B Lighthouse sur `/competences` (copie de la page avec une animation désactivée) | Avec les jauges animées au scroll, le thread principal travaillait **7,7 s** (TBT 240 à 330 ms). Sans elles, **0,6 s**. Cause : chacune des ~76 jauges avait sa propre timeline `animation-timeline: view()`, recalculée à chaque image pendant que les vagues bougent. **Corrigé :** une simple transition déclenchée **une seule fois** par `IntersectionObserver` (`CompetenceCard.astro`). Résultat : 2,1 s, TBT 60 ms, performance 93 → **100**. |
| P2 | **Vagues SVG animées en continu** | Même test A/B (vagues désactivées) | Elles coûtent aussi du CPU tant que la page est ouverte. **Choix assumé** de direction artistique, limité par `prefers-reduced-motion`. **Piste :** les mettre en pause hors de l'écran avec `IntersectionObserver` + `animation-play-state`. |
| P3 | **Poids des images** : les originaux PocketBase sont des PNG de captures d'écran (plusieurs centaines de Ko) | Audits `total-byte-weight`, `uses-responsive-images` | Toutes les images sont converties en **WebP** et redimensionnées **au build** (`astro:assets`), avec `width`/`height` explicites (CLS = 0). Images sous la ligne de flottaison en `loading="lazy"`. **Corrigé :** le portrait (accueil, profil) servait une version 2x de 960 px à tous les mobiles. Il utilise désormais `widths` + `sizes` : accueil **226 → 168 Kio**, profil **165 → 127 Kio**. |
| P4 | **Chargement de l'image principale (LCP)** | Audit `lcp-lazy-loaded` | **Corrigé :** sur `/projets`, l'image LCP (1re carte) était en lazy. Les 2 premières cartes sont maintenant chargées en `eager` (prop `eager` de `ProjetCard`). |
| P5 | **Polices** | Onglet réseau | Une seule police d'affichage (Bevan) : **21 Ko** en woff2, sous-ensemble latin, auto-hébergée, `preload` + `font-display: swap`. Texte courant en police système (Arial) : 0 octet téléchargé. ✅ |
| P6 | **JavaScript** | Lighthouse `bootup-time` | Aucun framework côté client : les scripts (menu, carrousel, filtres, formulaire) sont inline et pèsent quelques Ko. Évaluation des scripts : **< 60 ms** par page. ✅ |
| P7 | **Pas de serveur applicatif** | `grep 127.0.0.1` sur `dist/` | Site 100 % statique : aucune requête vers PocketBase en production. Cela a mis au jour un **bug corrigé** : les liens « agrandir l'image » des 9 pages projet pointaient vers `http://127.0.0.1:8090/…` (le PocketBase local), donc des liens morts en ligne. Ils pointent maintenant vers les WebP générées au build (`projet/[id].astro`). |
| P8 | **CSS** | Audit `render-blocking-resources` | Un seul fichier CSS de 45 Ko (Tailwind purgé), bloquant au rendu (~110 à 150 ms estimés). **Accepté** : l'intégrer dans le HTML le répéterait dans chaque page. |

**EcoIndex :** à mesurer en ligne (ecoindex.fr ou extension GreenIT-Analysis). Les entrées de calcul sont faibles : 133 à 380 nœuds DOM, 6 à 20 requêtes, 38 à 172 Kio.

## 3. Référencement

| # | Critère et pourquoi ici | Vérification | Résultat / correction |
|---|---|---|---|
| R1 | **`<title>` et meta description uniques** : 16 pages, dont 9 générées depuis PocketBase | `grep '<title>'` sur `dist/` | Titre propre à chaque page, au format « Projet — Type par Alex Ringenbach ». La description des pages projet est tirée de PocketBase et tronquée à 160 caractères sur un mot entier (`excerpt()`). ✅ |
| R2 | **Plan du site et robots** | Lecture de `sitemap-0.xml` et `robots.txt` | Sitemap généré automatiquement (15 URL, 404 exclue) et déclaré dans `robots.txt`. 404 en `noindex`. ✅ |
| R3 | **URL canoniques** | `grep canonical` | Une balise `canonical` absolue par page, cohérente avec le sitemap (barre oblique finale). ✅ **À vérifier en ligne :** les liens internes n'ont pas de `/` final. Si Apache (Infomaniak) redirige `/projets` vers `/projets/`, chaque clic coûte une redirection 301 (`curl -I`). |
| R4 | **Données structurées** : portfolio d'une personne, donc « compréhensible par une machine » au sens le plus littéral | Lecture du JSON-LD généré | `Person` (métier, ville, réseaux en `sameAs`), `WebSite`, `ProfilePage`, `BreadcrumbList` sur chaque page, `CreativeWork` par projet, `ItemList` pour les compétences. **À faire :** valider dans le *Rich Results Test* de Google une fois en ligne. |
| R5 | **Partage sur les réseaux** : le lien du site sera posté sur LinkedIn | Lecture des balises `og:*` | Open Graph + Twitter Card sur toutes les pages. Image 1200×630 générale, et **image propre à chaque projet** générée au build. ✅ |
| R6 | **URL lisibles** | Lecture du sitemap | ❌ **Non corrigé :** les pages projet utilisent l'identifiant PocketBase (`/projet/rjir3cejevcqtt0`). Correction prévue : ajouter un champ `slug` dans PocketBase et l'utiliser dans `getStaticPaths()`. |
| R7 | **Sémantique** | Voir A2 | Un `h1` par page, des `nav` nommées, `main`, `footer`. ✅ |

## 4. Conformité juridique

| # | Critère et pourquoi ici | Vérification | Résultat / correction |
|---|---|---|---|
| J1 | **Mentions légales (LCEN)** | Lecture de `/mentions-legales` | Éditeur, directeur de publication et hébergeur (Infomaniak, adresse, téléphone) présents, avec un lien dans le pied de toutes les pages. ✅ **À confirmer** au déploiement : l'hébergeur réel doit bien être Infomaniak. |
| J2 | **Information RGPD au moment de la collecte** : le formulaire de contact | Lecture de `contact.astro` | ❌ → **Corrigé :** ajout sous le bouton d'une mention courte (finalité, service utilisé, absence de revente), avec un lien vers `/mentions-legales#donnees`. |
| J3 | **Sous-traitant et transfert hors UE** | Lecture des mentions | **Complété :** FormSubmit est opéré hors de l'Union européenne, c'est désormais indiqué. J'ai ajouté une **durée de conservation précise** (1 an après le dernier échange, au lieu de « le temps nécessaire ») et le droit de réclamation auprès de la CNIL. |
| J4 | **Cookies et traceurs** : faut-il un bandeau ? | Liste des domaines contactés par chaque page (réseau Lighthouse) | Toutes les requêtes vont vers le site lui-même : aucun cookie, aucun traceur, **donc pas de bandeau nécessaire**. **Corrigé :** les mentions affirmaient à tort que la police était chargée depuis Google Fonts (ce qui implique un transfert d'adresse IP vers Google). Elle est en fait auto-hébergée. Le texte décrit maintenant la réalité. |
| J5 | **Droits des auteurs des contenus publiés** | Inventaire des ressources tierces | Police Bevan (Vernon Adams) : **licence SIL OFL 1.1**, crédit ajouté. Projets d'école représentant des marques et des événements : paragraphe « Nature des projets présentés » (cadre pédagogique, non commercial). Projets de groupe : propriété partagée mentionnée. Logos de logiciels (page Compétences) : marques citées à titre illustratif. |
| J6 | **Droit à l'image** | Inventaire des photos | Seule photo de personne : mon propre portrait. ✅ |
| J7 | **Transparence sur l'IA** | — | Usage déclaré dans `IA.md` et mentionné dans les crédits. |
| J8 | **Données dans le dépôt public** | `git ls-files` + inspection SQLite | ❌ **À corriger avant de rendre le dépôt public :** `pocketbase/pb_data/data.db` est versionné. Il contient le compte administrateur PocketBase (e-mail + hash du mot de passe). De plus, les collections `projets` et `competences` ont des règles d'écriture vides, donc publiques : sans danger tant que PocketBase reste local, mais à verrouiller s'il est mis en ligne. |

---

## Reste à faire

1. Mettre le site en ligne, puis refaire Lighthouse, `curl -I` (redirections, HTTPS) et l'EcoIndex **sur le domaine**.
2. Retirer `pocketbase/pb_data/` du dépôt (`.gitignore` + `git rm --cached`) et changer le mot de passe administrateur PocketBase.
3. Faire un test NVDA et un test de zoom à 200 %.
4. Ajouter des URL lisibles (`slug`) pour les projets.
5. Corriger la couleur de survol rouge sur fond noir, ou documenter ce choix.
