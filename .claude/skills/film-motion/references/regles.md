# Les règles de la maison

Ce qui distingue un film de l'atelier d'un diaporama animé.

## Rythme

- Un événement toutes les **0,5 à 1 s** : une arrivée, un mouvement de caméra, un mot qui s'allume.
- Dans l'accroche (5 premières secondes) : toutes les **0,1 à 0,3 s**. C'est là qu'on perd ou garde la personne.
- Les silences de plus de 0,4 s du minutage sont des **plans avec une action muette** (un geste, un objet qui bouge), jamais des trous.

## Caméra

- Elle **ne s'arrête jamais** : une dérive lente en continu (`derive` de 0,01 à 0,045 par seconde selon le calme voulu).
- Par-dessus, des **mouvements datés** sur les mots importants (`mouvements`), d'une durée de 0,4 à 0,8 s.
- Le flou de mouvement suit la vitesse (le moteur le calcule).
- `npm run controle` signale toute image figée de plus de 1,2 s.

## Raccords

- À chaque changement de séquence, un **objet pont** : il sort d'un plan et entre dans le suivant (le pot, le fil, une forme de la marque).
- La bascule au noir est la seule coupure franche du film.

## Arrivées et profondeur

- Les éléments arrivent **trop grands et flous**, puis se posent (`<Arrivee depuis={1.6} flou={18}>`).
- **Trois niveaux** : fond (dégradé, grain, vignette), sujet, premier plan (texte, objet qui passe).
- **Une seule chose à regarder à la fois.** Si deux éléments bougent ensemble, l'un des deux est de trop.

## Couleur et texte

- Couleurs définies par rôle, **un seul accent** : il désigne ce qu'il faut regarder.
- Le problème dans un monde sombre, la solution dans un monde clair : la bascule fait passer de l'un à l'autre.
- En 9:16, tout texte doit tenir dans 86 % de la largeur ; vérifier chaque image clé en vertical.
- Sous-titres : bandeau sombre (`bandeau`), mots clés dans l'accent (`motsCles`), masqués quand l'écran dit déjà la phrase (`masquer`).

## Son

- La voix montée est l'horloge : l'image se cale sur elle, jamais l'inverse.
- Musique en trois phases : **tension** (problème), **bascule** (silence ou impact), **élan** (solution et marque), baissée sous la voix.
- Chaque bruitage est calé sur un geste de l'image. La notification de marque, **une seule fois**, au moment clé.
- Mixage final : -16 LUFS, crête -1,5 dBTP (le rendu s'en charge).

## Avant de montrer une image

Regarde-la toi-même : texte coupé ou qui déborde, contraste, deux choses qui se battent pour l'œil, élément mal centré en 9:16.
Corriger une image coûte dix fois moins cher que corriger une vidéo.
