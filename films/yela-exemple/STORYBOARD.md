# 5. Storyboard — Yéla, le karité qui dit d'où il vient

> Chaque ligne correspond à une séquence de `Film.tsx`. Les temps viennent de `minutage.json`.

| Séq. | De → à (s) | Mots de la voix | Ce qu'on voit | Caméra | Son |
|---|---|---|---|---|---|
| 1 · Accroche | 0 → 7,55 | « Lundi… Mardi… Mercredi… personne ne sait. » | Cartes LUNDI (0,3), MARDI (3,4), MERCREDI (5,8) arrivent trop grandes et floues ; le pot arrive à 1,4 ; un « ? » à 4,55. | Dérive + deux poussées datées (3,3 et 5,7) vers la carte du jour. | musique tension |
| 2 · Gag muet | 7,55 → 10,3 | (silence) | Le pot fait un demi-tour : l'étiquette est vide, « (rien) » ; trois points à 9,3. | Dérive plus marquée, glissement vers le pot (9,05). | pop à 9,3 |
| 3 · Diagnostic | 10,3 → 17,85 | « Le problème… Et quand. » | « PAS LE KARITÉ. » mot à mot, puis « TOUT CE QU'ON NE TE DIT PAS. » ; trois stations D'OÙ ? QUI ? QUAND ? | Travelling d'une station à l'autre sur « D'où » (14,75), « Qui » (16,1), « Et quand » (17,3). | montée à 15 s |
| 4 · Bascule | 17,85 → 21,2 | « Il est temps de savoir. » | Noir. La phrase arrive (18,3), repart (20,1) ; un point doré devient un fil (20,4). | Lente avancée au noir. | impact à 17,85 |
| 5 · Solution | 21,2 → 29,9 | « Chez Yéla… tu sais. » | Monde clair. L'étiquette se remplit : YÉLA (22,2), KORHOGO (23,7), PRÉPARÉ À LA MAIN (25,3), FABRIQUÉ LE 12.10.2026 (26,75) ; le couvercle s'ouvre (28,3) ; lueur (29,3). | Gros plan sur chaque ligne, puis recul à 28,15. | clics sur chaque ligne ; notification UNE fois à 29,3 ; musique élan |
| 6 · Marque | 29,9 → 39 | « Yéla. Le karité qui dit d'où il vient. Découvre la boutique Yéla. » | « Yéla » arrive dès 30,1 (avant le mot, pas d'écran vide), soulignement doré (30,6), phrase mot à mot (31,25), bouton (33,4). | Dérive lente jusqu'à la fin. | musique élan |

## La séquence pilote

- **Séquence pilote** : 5 · Solution (elle porte la preuve et le niveau de finition du monde clair).
- **Images clés vérifiées** : `npm run images -- yela-exemple 24 28 29.5` puis en `--format 9x16`.

## Règles appliquées

- Sous-titres masqués quand l'écran dit déjà la phrase (bascule, signature, appel) : `masquer` dans `<SousTitres>`.
- Bandeau sombre derrière les sous-titres : lisibles sur le monde clair comme sur le sombre.
