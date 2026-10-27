# 3. Voix — Yéla, le karité qui dit d'où il vient

> Le dépôt ne contient **pas** de voix pour ce film d'exemple : `minutage.json` a été écrit à la main
> pour montrer le format. Pour l'entendre avec une voix, enregistrez la version voix de SCRIPT.md
> (ou générez-la), déposez-la ici sous le nom `voix.mp3`, puis suivez les trois commandes ci-dessous.

## Ce qu'on ferait avec une vraie prise

1. `npm run silences -- yela-exemple`
2. Dans `montage.json`, trois coupes :

| Coupe après | Silence ajouté | Pourquoi |
|---|---|---|
| « personne ne sait. » | +2,6 s | gag muet (le pot se retourne) |
| « Et quand. » | +1,2 s | bascule au noir |
| « tu sais. » | +0,4 s | respiration avant la marque |

3. `npm run montage -- yela-exemple` → `voix-montee.wav`
4. `npm run minutage -- yela-exemple` → remplace `minutage.json` (gardez une copie de l'exemple si besoin).

Le film prend alors la durée de la voix montée et les sous-titres suivent les vrais mots.

## Le minutage d'exemple

- Durée : 39 s (traîne de fin comprise).
- Silences qui deviennent des plans : 7,53 → 10,30 s (gag muet) et 19,57 → 21,20 s (fin de la bascule).
