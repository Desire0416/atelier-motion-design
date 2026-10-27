# 7. Film final — {{TITRE}}

> Étape 7 sur 7 · Idée → Script → Voix → Design → Claude Code → Animation → **Film final**

## Le son

- **Musique** : trois phases (tension → bascule → élan), baissée sous la voix (`<Musique minutage={…} />`).
  - Titre et source : ______ · **Preuve de licence conservée** : ☐
- **Bruitages** : `npm run bruitages -- {{ID}}` (générés : libres de droits).
- **Mixage** : le rendu normalise à **-16 LUFS**, crête à **-1,5 dBTP**.

## Le rendu

1. `npm run rendu -- {{ID}} --brouillon` : demi-résolution, pour juger le rythme.
2. `npm run rendu -- {{ID}}` : pleine qualité, son normalisé → `rendus/{{ID}}-16x9.mp4`, `rendus/{{ID}}-9x16.mp4`.

## Les contrôles

`npm run controle -- {{ID}}` vérifie ce que l'œil ne voit pas :

| Contrôle | Attendu | Résultat |
|---|---|---|
| Durée | celle de la voix montée (± 0,1 s) | |
| Niveau sonore | -16 LUFS (± 1,5) | |
| Crête | ≤ -1,5 dBTP | |
| Passages noirs | seulement la bascule voulue | |
| Images figées | aucune de plus de 1,2 s | |
| Planche (une image / 0,5 s) | relue en entier | |

Puis à l'œil et à l'oreille :

- [ ] Regardé en entier sur un téléphone, **avec** le son.
- [ ] Regardé en entier **sans** le son : les sous-titres suffisent.
- [ ] Orthographe des textes et des sous-titres relue.
- [ ] Noms, prix, dates et coordonnées vérifiés avec le client.
- [ ] Licences : voix ☐ · musique ☐ · polices ☐ · images ☐

## Livraison

- Fichiers livrés :
- Date :
- Retours du client :
