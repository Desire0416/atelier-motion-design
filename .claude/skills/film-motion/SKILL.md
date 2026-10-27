---
name: film-motion
description: Mène un film de motion design de bout en bout dans l'atelier Access Academy, selon la méthode Idée → Script → Voix → Design → Claude Code → Animation → Film final. À utiliser dès que l'utilisateur veut créer, reprendre, corriger ou rendre un film dans films/, écrire un script ou un storyboard de film, monter ou minuter une voix, dessiner des images figées, animer une séquence avec le moteur de l'atelier, ou contrôler un rendu.
---

# Film de motion design — la méthode de l'atelier

Sept étapes, toujours dans cet ordre. **Chaque étape se termine par la validation de l'utilisateur** :
tu présentes le résultat, tu attends son accord explicite, puis seulement tu passes à la suivante.
Ne saute jamais une étape, même si on te le demande pour « gagner du temps » : propose plutôt une version courte de l'étape.

```
Idée → Script → Voix → Design → Claude Code → Animation → Film final
```

Chaque film vit dans `films/<nom>/` avec une fiche par étape. S'il n'existe pas : `npm run nouveau-film -- <nom> --titre "…"`.
Pour reprendre un film, lis d'abord ses fiches pour savoir à quelle étape il en est (la première fiche non validée).

## 1. Idée — `IDEE.md`

- Pose les questions de la fiche une à une (marque, où le film sera vu, formats, durée, personne qui regarde, action attendue).
- Propose **trois angles différents**, puis aide à en retenir un.
- Porte d'étape : l'idée tient en une phrase, et la preuve existe.

## 2. Script — `SCRIPT.md`

- Six temps : accroche datée → gag muet (2–3 s, aucun mot) → diagnostic en trois douleurs → bascule au noir (~1,5 s) → solution en bénéfices → marque et appel (une seule action).
- Débit : 170–180 mots/min, soit 110–130 mots pour 45–50 s. Compte les mots et annonce la durée.
- Écris deux versions : mise en scène (avec `[crochets]`) et **version voix** (texte pur, nombres et dates en lettres, ponctuation pour les pauses). La section `## Version voix` sert d'indice d'orthographe au minutage : ne change pas son titre.
- Porte d'étape : l'utilisateur a lu le script à voix haute.

## 3. Voix — `VOIX.md`, `montage.json`

- L'utilisateur enregistre sa voix ou la génère (ElevenLabs : modèle Eleven v4, langue français, Stabilité 40–50 %, Similarité 80–90 %, 2–3 prises, pas de balises de pause). Rappelle que la formule gratuite d'ElevenLabs n'autorise pas l'usage commercial.
- Tu ne génères jamais la voix toi-même et tu ne demandes jamais de clé d'API : l'utilisateur dépose le fichier `voix.mp3` (ou `.wav`) dans le dossier du film.
- `npm run silences -- <nom>` → propose les coupes **au milieu des silences** seulement. Remplis `montage.json` (gag muet, bascule, traîne ~4 s). `npm run montage -- <nom>` → `voix-montee.wav`.
- `npm run minutage -- <nom>` → `minutage.json` (Whisper en local). Relis les mots signalés comme douteux avec l'utilisateur.
- Porte d'étape : l'utilisateur a écouté la voix montée en entier. **À partir d'ici, la voix est l'horloge : on ne la retouche plus**, l'image s'y cale.

## 4. Design — `DIRECTION.md`, `Directions.tsx`

- Définis les couleurs **par rôle** (fond sombre, fond clair, texte, accent) avec **un seul accent**.
- Dessine **trois directions vraiment différentes**, trois images figées chacune (accroche, bascule, solution), en code dans `Directions.tsx` (1920 × 1080, composants du moteur et de `elements.tsx` si besoin).
- `npm run images -- <nom> --directions`, puis **regarde toi-même la planche** (`images/planche-directions.jpg`) avant de la montrer : lisibilité, une seule chose à regarder, rien qui déborde.
- Porte d'étape : l'utilisateur choisit une direction (et ce qu'il emprunte aux autres).

## 5. Claude Code — `STORYBOARD.md`

- Écris le storyboard plan par plan **avec les temps de `minutage.json`** (début des mots), jamais estimés.
- Applique les règles de la maison (voir `references/regles.md`) : un événement toutes les 0,5–1 s, caméra qui ne s'arrête jamais, objet pont à chaque raccord, arrivées trop grandes et floues, trois niveaux de profondeur, une chose à regarder à la fois.
- Choisis une **séquence pilote**.
- Porte d'étape : l'utilisateur valide le storyboard.

## 6. Animation — `Film.tsx`

- Anime d'abord la séquence pilote, entièrement. Vérifie-la sur images clés : `npm run images -- <nom> 3.2 5.8 …` puis `--format 9x16`. **Regarde chaque image** avant de la montrer.
- Puis les autres séquences, une par une, chacune vérifiée sur images clés dans les deux formats.
- Utilise le moteur (`src/moteur`, voir `references/moteur.md`) ; les éléments propres au film vont dans `films/<nom>/elements.tsx`.
- Après chaque modification : `npm run verifier` (TypeScript) doit passer.
- Le film d'exemple `films/yela-exemple/` montre tout le chemin : inspire-toi de sa structure, pas de son contenu.
- Porte d'étape : brouillon (`npm run rendu -- <nom> --brouillon`) regardé par l'utilisateur.

## 7. Film final — `CONTROLE.md`

- Son : musique en trois phases (tension → bascule → élan) baissée sous la voix (`<Musique minutage={minutage} />`), bruitages `npm run bruitages -- <nom>` calés sur des gestes de l'image, notification de marque une seule fois.
- `npm run rendu -- <nom>` (son normalisé à -16 LUFS, crête -1,5 dBTP), puis `npm run controle -- <nom>`.
- Corrige chaque ✖ (image figée : la caméra doit bouger ; durée : la voix montée fait foi). Ouvre la planche du contrôle et regarde-la.
- Remplis le tableau de `CONTROLE.md`. Rappelle les vérifications humaines : regarder sur téléphone avec et sans le son, noms/prix/dates vérifiés par le client, preuves de licence.

## Garde-fous

- Rien ne quitte l'ordinateur : pas de service en ligne, pas de clé d'API, pas d'envoi de fichiers.
- Ne mets jamais à jour Remotion ni React (les versions sont fixées dans `package.json`) et n'ajoute pas de dépendance sans l'accord de l'utilisateur.
- N'utilise que des polices, musiques et images dont la licence est connue. N'imite pas une marque ou une personne réelle sans accord.
- Sous Windows, Python s'appelle souvent `python` (pas `python3`) ; les outils de l'atelier s'en chargent. Lance toujours les outils par `npm run …`.
- Si un outil manque (ffmpeg, Whisper), propose de l'installer et explique ce que tu fais avant de le faire.
