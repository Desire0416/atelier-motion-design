# 7. Film final — Yéla, le karité qui dit d'où il vient

## Le son

- **Voix** : Ingrid (ElevenLabs v4), montée et minutée (voir VOIX.md).
- **Musique** : générée sur les repères du film (tension jusqu'à la bascule, impact, élan à partir de « Chez », accord final sur la marque), libre de droits, dans `musique/bande.wav` (non versionnée) ; baissée sous la voix par `<Musique minutage={…} />`.
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
| Après la voix | Écran presque vide de 10,4 à 11,9 s : la voix dit « Le problème… » avant le texte | « LE PROBLÈME, » s'affiche sur ses mots. |

Résultat après corrections : durée 39,00 s, son à -16 LUFS (crête -1,5 dBTP), aucune image figée, un seul passage noir (la bascule, voulu).

## À l'œil et à l'oreille

- [x] Regardé en entier en 16:9 et en 9:16.
- [x] Mention « Marque fictive » présente sur le plan final.
