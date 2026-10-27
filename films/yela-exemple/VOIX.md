# 3. Voix — Yéla, le karité qui dit d'où il vient

## La voix

- **Chemin** : voix de synthèse ElevenLabs, voix **Ingrid**, modèle **Eleven v4**, réglages par défaut.
- **Texte** : la version voix de SCRIPT.md, telle quelle, avec trois balises de jeu (`[warmly]` sur la solution et la signature, `[softly]` sur « Tu l'ouvres… tu sais »).
- **Prises** : deux prises entières de 29,3 et 29,4 s.
- **Prise retenue** : la seconde. Les deux prises ont été transcrites par Whisper et comparées au texte ; dans la seconde, « Mercredi » et « préparé » sont les plus nets, « Korhogo » est correct dans les deux.
- **Droits** : formule ElevenLabs payante (usage commercial autorisé). Le fichier de la voix n'est pas versionné dans le dépôt ; déposez votre propre prise sous le nom `voix.mp3` pour refaire l'exercice.

## Le montage (`montage.json`)

| Coupe à (voix brute) | Silence ajouté | Pourquoi |
|---|---|---|
| 7,73 s | +2,6 s | gag muet : le pot se retourne, l'étiquette est vide |
| 14,88 s | +0,5 s | bascule : l'impact avant « Il est temps de savoir » |
| 16,29 s | +1,3 s | bascule : le fil doré, puis le monde clair |
| 25,07 s | +0,4 s | respiration avant la marque |

Avant la première phrase : 0,3 s. Traîne de fin : 4,54 s, pour que la voix montée retombe exactement sur 39 s.

## Le minutage (`minutage.json`)

- 85 mots minutés par Whisper, avec le texte de SCRIPT.md comme indice d'orthographe.
- Corrigés à la main : « carité » → « karité », la virgule avant « Découvre » remise en point, et le début de « Lundi », que la reconnaissance plaçait à 0 s au lieu de 0,33 s.

## Le film se cale sur la voix

Film.tsx ne contient aucun temps écrit à la main : chaque plan et chaque arrivée s'appuient sur un **repère** (`repere(minutage, "Korhogo")`), l'instant où le mot est prononcé. Une nouvelle prise, une fois montée et minutée, recale le film toute seule.

Repères principaux : gag muet 7,9 → 10,4 s · diagnostic 10,4 → 18,1 s · bascule 18,1 → 21,2 s · solution 21,2 → 29,8 s · marque 29,8 → 39 s.
