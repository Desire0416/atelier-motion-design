# Atelier motion design — Access Academy

Atelier de fabrication de films de motion design avec Claude Code, utilisé dans la formation
« Motion design avec l'IA : films d'animation de marque » d'Access Academy (Digital Access).

## La méthode

```
Idée → Script → Voix → Design → Claude Code → Animation → Film final
```

Pour tout travail sur un film, suis la compétence `film-motion` (`.claude/skills/film-motion/SKILL.md`) :
une étape à la fois, chaque étape validée par l'utilisateur avant la suivante.

## Organisation

- `films/<nom>/` : un film = un dossier (fiches de la méthode, `Film.tsx`, `Directions.tsx`, `minutage.json`, voix, sons, images).
- `films/yela-exemple/` : le film d'exemple complet (marque fictive). Ne le modifie pas sans qu'on le demande.
- `films/_commun/` : polices (licence OFL) et bruitages communs.
- `src/moteur/` : le moteur partagé (caméra, arrivées, texte, sous-titres, son). Une modification ici touche tous les films : à faire seulement si l'utilisateur le demande, puis `npm run verifier`.
- `src/films.ts` : le registre des films (mis à jour par `npm run nouveau-film`).
- `outils/` : les commandes de l'atelier (Node et Python), lancées par `npm run …`.
- `modeles/` : les fiches et fichiers de départ d'un nouveau film.
- `rendus/` : les vidéos finales (non versionnées).

## Commandes

| Commande | Étape | Rôle |
|---|---|---|
| `npm run nouveau-film -- <nom> --titre "…"` | 1 | crée le dossier du film |
| `npm run silences -- <nom>` | 3 | repère phrases et silences de la voix brute |
| `npm run montage -- <nom>` | 3 | monte la voix d'après `montage.json` |
| `npm run minutage -- <nom>` | 3 | minutage mot à mot (Whisper, en local) |
| `npm run images -- <nom> --directions` | 4 | rend les images figées des directions |
| `npm run studio` | 5–6 | ouvre Remotion Studio dans le navigateur |
| `npm run images -- <nom> 2.5 8 [--format 9x16]` | 6 | images clés du film |
| `npm run bruitages -- [<nom>]` | 7 | génère les bruitages |
| `npm run rendu -- <nom> [--brouillon] [--formats 16x9,9x16]` | 7 | rendu (son normalisé à -16 LUFS) |
| `npm run controle -- <nom>` | 7 | contrôles du film rendu |
| `npm run verifier` | — | vérification TypeScript |

## Règles

- La voix montée est l'horloge du film ; les temps viennent de `minutage.json`.
- Tout reste sur l'ordinateur : aucune clé d'API, aucun service en ligne.
- Versions de Remotion et React fixées : ne pas les mettre à jour.
- Code et textes en français.
