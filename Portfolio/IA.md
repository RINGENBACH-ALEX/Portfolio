## Outils utilisés

| Outil | Étape | Usage |
|---|---|---|
| Codex (OpenAI) | Début de l'intégration | Essai de fond animé pour l'accueil (abandonné) |
| Claude Code (VS Code) | Intégration (août – sept. 2026) | Code Astro / Tailwind, pages, connexion PocketBase, responsive, performance, accessibilité, SEO |
| Claude Code | Qualité (nov. 2026) | Audit Lighthouse / axe, corrections, première version de `QUALITE.md` et de ce fichier |

Part du code écrite avec assistance : [À COMPLÉTER].

## Ce qui vient de moi

- Positionnement et direction artistique : palette « Crimson Noir » (`#C50337` / `#02060E`), références de vagues et de marbre.
- Monogramme « AR », portrait, visuels des projets, logos des compétences.
- Base PocketBase : collections `competences` et `projets`, leurs champs et tout leur contenu.
- Modèle de `backend.mjs`, repris de ma SAE 203.
- Choix de structure : pages séparées au lieu d'ancres, grille commune de 12 colonnes pour toutes les pages.
- Informations personnelles : parcours, outils, centres d'intérêt, ville, hébergeur.

**Rédigé par l'IA à partir de mes consignes :** la plupart des textes de présentation (accroche, profil, « Ma façon de travailler », intros, mentions légales, 404).

## Ce que j'ai modifié, corrigé ou rejeté

**Codex.** Le résultat ne correspondait pas à ma demande : rejeté, travail repris avec Claude Code. [À COMPLÉTER : rien n'en subsiste / ce qui en reste.]

**Claude Code, intégration.**
- Fond animé : premier marbre refusé , puis marbre retiré pour ne garder que les vagues SVG.
- Voile en dégradé du hero supprimé ; section compétences sans vagues ; image et texte inversés sur la page profil.
- Informations inventées par l'IA (dates, établissement, bac, outils, loisirs, ville) remplacées par les miennes.
- `backend.mjs` : fonctions inutiles supprimées ; champ `type` ajouté dans PocketBase pour regrouper les projets.
- Cartes : tailles d'images et de logos reprises plusieurs fois.
- Page 404 : première version refusée ; dans la seconde, glisser-déposer retiré.
- Bugs trouvés en testant : images PocketBase absentes, logos déformés, cartes non cliquables.

**Claude Code, qualité.** Les corrections sont détaillées dans `QUALITE.md`. Le débordement horizontal sur mobile a été repéré par moi. [À COMPLÉTER : ce que j'ai vérifié ou changé, ex. durée de conservation de 1 an gardée ou non.]

