# Atelier motion design

L'atelier de la formation **« Motion design avec l'IA : films d'animation de marque »** d'[Access Academy](https://academy.digitalaccess.ci) (Digital Access, Abidjan).

On y fabrique des films publicitaires animés de 30 à 60 secondes, en 16:9 et en 9:16, avec **Claude Code** comme partenaire de travail, en suivant une méthode en sept étapes :

```
Idée → Script → Voix → Design → Claude Code → Animation → Film final
```

L'animation est écrite en code ([Remotion](https://www.remotion.dev), React) : chaque image se recalcule, se corrige et se rend à l'identique, et le même film sort en horizontal et en vertical.

## Ce qu'il y a dedans

| Dossier | Contenu |
|---|---|
| `films/yela-exemple/` | un film complet de 39 s (marque fictive « Yéla », beurre de karité), avec ses fiches remplies |
| `modeles/` | les fiches de chaque étape et les fichiers de départ d'un nouveau film |
| `src/moteur/` | le moteur : caméra qui ne s'arrête jamais, arrivées floues, texte mot à mot, sous-titres calés sur la voix, son |
| `outils/` | montage de la voix, minutage mot à mot, images figées, bruitages, rendu, contrôles |
| `.claude/skills/film-motion/` | la méthode, pour que Claude Code vous guide étape par étape |

## Installer

Il vous faut [Claude Code](https://claude.com/claude-code) et un compte Claude payant (formule Pro au minimum, Max conseillée pour un film entier).
Ouvrez Claude Code dans le dossier où vous rangez vos projets et donnez-lui cette consigne :

> Clone https://github.com/Desire0416/atelier-motion-design, installe ce qu'il faut pour le faire fonctionner (Node.js 20 ou plus, ffmpeg, Python 3 et Whisper), lance `npm install`, puis vérifie que l'atelier marche en rendant les images figées du film d'exemple.

Ce que Claude Code installera, si ce n'est pas déjà fait :

- **Node.js** 20 ou plus, puis les dépendances (`npm install`) ;
- **ffmpeg** (montage, rendu, contrôles) ;
- **Python 3** et **Whisper** (`pip install -U openai-whisper`, ou `faster-whisper`, plus léger) pour le minutage. Le premier minutage télécharge le modèle de reconnaissance (environ 500 Mo), une seule fois.

## Fabriquer un film

Dans Claude Code, ouvert dans le dossier de l'atelier :

> On démarre un nouveau film pour [marque] : aide-moi à trouver l'idée.

Claude Code crée le dossier du film (`npm run nouveau-film`) et vous accompagne d'une étape à l'autre. À chaque étape, il vous montre le résultat et attend votre accord. Les commandes sont décrites dans [CLAUDE.md](CLAUDE.md).

Pour voir le film d'exemple :

```bash
npm run studio
```

## Ce que ça coûte

| Outil | Coût |
|---|---|
| L'atelier | gratuit (licence MIT) |
| Claude Code | un abonnement Claude payant (Pro au minimum) |
| Voix | gratuite si vous enregistrez la vôtre ; ElevenLabs : formule payante pour un usage commercial (la formule gratuite l'interdit) |
| Remotion | gratuit pour les particuliers et les structures de 3 personnes au plus ; au-delà, une licence d'entreprise est nécessaire ([remotion.pro](https://www.remotion.pro)) |
| Musique | selon la bibliothèque choisie : gardez toujours la preuve de licence |
| Whisper, ffmpeg, bruitages de l'atelier | gratuits |

## Licences

- Le code de l'atelier (moteur, outils, modèles) : licence MIT, voir [LICENSE](LICENSE).
- Remotion : sa propre licence, voir ci-dessus.
- Polices Plus Jakarta Sans et Inter : SIL Open Font License 1.1 (`films/_commun/polices/`).
- « Yéla » est une marque inventée pour l'exemple : toute ressemblance avec une marque existante serait fortuite.

## Confidentialité

Tout se passe sur votre ordinateur : la voix, le minutage (Whisper tourne en local) et le rendu. L'atelier n'envoie rien en ligne et ne demande aucune clé d'API.
