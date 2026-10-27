# 7. Film final — Yéla, le karité qui dit d'où il vient

## Le son

- **Musique** : non fournie (le dépôt ne contient aucune musique sous licence). Le film attend
  `musique/tension.mp3` (0 → 18,2 s) et `musique/elan.mp3` (à partir de 21,2 s), baissées sous la voix.
- **Bruitages** : `npm run bruitages -- yela-exemple` (générés, libres de droits).

## Le rendu

```
npm run rendu -- yela-exemple --brouillon
npm run rendu -- yela-exemple
npm run controle -- yela-exemple
```

## Ce que le contrôle a trouvé pendant la fabrication de l'exemple

| Contrôle | Trouvé | Correction |
|---|---|---|
| Images figées | 8,5 → 10,3 s (fin du gag) et 18,6 → 20,5 s (bascule) | Dérive de caméra plus marquée et mouvement daté dans le gag ; avancée lente au noir. |
| Lecture en 9:16 | Sous-titres blancs illisibles sur le fond clair | Bandeau sombre derrière les mots déjà dits. |
| Lecture en 9:16 | Texte du diagnostic qui déborde | Largeur maximale propre au vertical. |
| Doublons | Sous-titre identique au texte à l'écran (bascule, appel) | Sous-titres masqués sur ces intervalles. |
| Étiquette | « FABRIQUÉ LE… » coupé en bas | Étiquette qui s'agrandit avec son contenu. |
| Planche 16:9 | Carte MERCREDI sous les sous-titres ; 0,6 s d'écran vide avant « Yéla » | Carte placée en bas à gauche en 16:9 ; « Yéla » arrive dès 30,1 s. |

Résultat après corrections : durée 39,00 s, aucune image figée, un seul passage noir (la bascule, voulu).

## À l'œil et à l'oreille

- [x] Regardé en entier en 16:9 et en 9:16.
- [x] Mention « Marque fictive » présente sur le plan final.
