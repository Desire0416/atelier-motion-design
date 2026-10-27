# 5. Storyboard — Yéla, le karité qui dit d'où il vient

> Chaque ligne correspond à une séquence de `Film.tsx`. Les temps viennent de `minutage.json`.

| Séq. | De → à (s) | Mots de la voix | Ce qu'on voit | Caméra | Son |
|---|---|---|---|---|---|
| 1 · Accroche | 0 → 7,9 | « Lundi… Mardi… Mercredi… personne ne sait. » | Cartes LUNDI (0,3), MARDI (3,2), MERCREDI (6,3), chacune sur son mot, arrivent trop grandes et floues ; le pot arrive à 1,4 ; un « ? » sur « d'où » (4,6). | Dérive + deux poussées sur « Mardi » et « Mercredi ». | musique : tension |
| 2 · Gag muet | 7,9 → 10,4 | (silence) | Le pot fait un demi-tour : l'étiquette est vide, « (rien) » ; trois points à 9,6. | Dérive plus marquée, glissement vers le pot. | pop à 9,6 |
| 3 · Diagnostic | 10,4 → 18,1 | « Le problème… Et quand. » | « LE PROBLÈME, », « PAS LE KARITÉ. » et « TOUT CE QU'ON NE TE DIT PAS. » mot à mot, calés sur la voix ; trois stations D'OÙ ? QUI ? QUAND ? | Travelling d'une station à l'autre sur « D'où » (14,7), « Qui » (15,9), « quand » (17,3). | montée à 15,2 s |
| 4 · Bascule | 18,1 → 21,2 | « Il est temps de savoir. » | Noir. La phrase arrive sur « Il » (18,5), repart (20,1) ; un point doré devient un fil (20,4). | Lente avancée au noir. | impact à 18,1 |
| 5 · Solution | 21,2 → 29,8 | « Chez Yéla… tu sais. » | Monde clair. L'étiquette se remplit sur les mots : YÉLA (21,4), KORHOGO (24,3), PRÉPARÉ À LA MAIN (25,3), FABRIQUÉ LE 12.10.2026 (26,8) ; le couvercle s'ouvre sur « Tu » (28,1) ; lueur sur « sais » (29,2). | Gros plan sur chaque ligne, puis recul. | clics sur chaque ligne ; notification UNE fois sur « sais » ; musique : élan |
| 6 · Marque | 29,8 → 39 | « Yéla. Le karité qui dit d'où il vient. Découvre la boutique Yéla. » | « Yéla » arrive juste avant le mot (30,0), soulignement doré, phrase mot à mot sur la voix (31,1), bouton sur « Découvre » (32,9). | Dérive lente jusqu'à la fin. | musique : élan, accord final |

Tous ces temps sont des repères de la voix dans `Film.tsx` (`repere(minutage, "…")`) : aucun n'est écrit à la main.

## La séquence pilote

- **Séquence pilote** : 5 · Solution (elle porte la preuve et le niveau de finition du monde clair).
- **Images clés vérifiées** : `npm run images -- yela-exemple 24 28 29.5` puis en `--format 9x16`.

## Règles appliquées

- Sous-titres masqués quand l'écran dit déjà la phrase (bascule, signature, appel) : `masquer` dans `<SousTitres>`.
- Bandeau sombre derrière les sous-titres : lisibles sur le monde clair comme sur le sombre.
