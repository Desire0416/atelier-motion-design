# 3. Voix — {{TITRE}}

> Étape 3 sur 7 · Idée → Script → **Voix** → Design → Claude Code → Animation → Film final
> La voix montée est l'horloge du film : l'image se cale sur elle, jamais l'inverse.

## Enregistrer ou générer

**Votre propre voix** (gratuit) : pièce calme, téléphone à 20 cm, trois prises entières.

**ElevenLabs** (voix de synthèse) :

- Modèle : Eleven v4 (ou le plus récent proposé). Langue réglée sur **français**.
- Réglages de départ : Stabilité 40–50 %, Similarité 80–90 %.
- Pas de balises de pause : les pauses viennent de la ponctuation et des retours à la ligne.
- Peu de balises de jeu (une ou deux au plus, aux moments clés).
- Nombres et dates écrits en lettres (« le douze octobre », pas « 12/10 »).
- Générer 2 à 3 prises et garder la meilleure.
- ⚠️ La formule gratuite d'ElevenLabs interdit l'usage commercial : une formule payante est nécessaire pour un film livré à un client.

- **Voix choisie** :
- **Réglages** :
- **Prise retenue** :

Déposez la prise retenue dans ce dossier sous le nom **`voix.mp3`** (ou `voix.wav`).

## Monter la voix

1. `npm run silences -- {{ID}}` : repère les phrases et propose un point de coupe au milieu de chaque silence.
2. Reportez dans `montage.json` les coupes voulues : la place du gag muet (2–3 s), celle de la bascule au noir (~1,5 s), la traîne de fin (~4 s).
3. `npm run montage -- {{ID}}` : produit `voix-montee.wav` (fondus de 5 ms, aucun clic).
4. Écoutez la voix montée en entier. On ne coupe **que** dans un silence.

| Coupe à (s) | Silence ajouté (s) | Pourquoi |
|---|---|---|
| | | gag muet |
| | | bascule au noir |

## Minuter la voix

`npm run minutage -- {{ID}}` : Whisper (sur votre ordinateur, rien n'est envoyé) donne le début et la fin de chaque mot.
Chaque silence de plus de 0,4 s devient un changement de plan possible.

- **Durée de la voix montée** : s
- **Mots douteux signalés** (à corriger à la main dans `minutage.json`) :

## Validation

- [ ] La voix montée dure ce que prévoit le script (± 2 s).
- [ ] Aucune coupe au milieu d'un mot ou d'une respiration.
- [ ] Le minutage est relu : les mots clés tombent au bon endroit.
- [ ] Les droits de la voix sont clairs (votre voix, ou formule commerciale).
- [ ] Validé par : ______ le ______
