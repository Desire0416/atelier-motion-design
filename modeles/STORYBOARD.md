# 5. Storyboard — {{TITRE}}

> Étape 5 sur 7 · Idée → Script → Voix → Design → **Claude Code** → Animation → Film final
> Le storyboard est la commande passée à Claude Code : chaque ligne devient du code.
> Les temps viennent de `minutage.json` (début des mots), jamais d'une estimation.

## Les règles de la maison

- **Rythme** : un événement toutes les 0,5 à 1 s (toutes les 0,1 à 0,3 s dans l'accroche).
- **Caméra** : elle ne s'arrête jamais. Une dérive lente en continu, plus des mouvements datés.
- **Raccords** : un objet pont à chaque changement de séquence (il sort d'un plan et entre dans le suivant).
- **Arrivées** : les éléments arrivent trop grands et flous, puis se posent.
- **Profondeur** : trois niveaux (fond, sujet, premier plan).
- **Lecture** : une seule chose à regarder à la fois.
- **Son** : chaque bruitage est calé sur un geste de l'image. La notification de marque, une seule fois.

## Les plans

| Séq. | De → à (s) | Mots de la voix | Ce qu'on voit | Caméra | Son |
|---|---|---|---|---|---|
| 1 · Accroche | | | | | |
| 2 · Gag muet | | (silence) | | | |
| 3 · Diagnostic | | | | | |
| 4 · Bascule | | | noir | | impact |
| 5 · Solution | | | | | |
| 6 · Marque | | | | | notification |

## La séquence pilote

Avant d'animer tout le film, une séquence entière est menée jusqu'au bout (souvent la bascule ou la solution).
Elle fixe le niveau de finition pour le reste.

- **Séquence pilote** :
- **Images clés vérifiées** (`npm run images -- {{ID}} 3.2 8.5 …`) :

## Validation

- [ ] Chaque plan a un début et une fin pris dans le minutage.
- [ ] Aucun plan sans mouvement.
- [ ] La séquence pilote est validée sur images clés.
- [ ] Validé par : ______ le ______
