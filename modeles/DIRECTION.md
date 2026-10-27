# 4. Design — {{TITRE}}

> Étape 4 sur 7 · Idée → Script → Voix → **Design** → Claude Code → Animation → Film final
> Trois directions vraiment différentes pour la même voix, trois images figées chacune.
> Une image figée est un instant du futur film, à la qualité finale. On choisit sur images, pas sur description.

## Les couleurs, par rôle

Une palette se définit par ce que fait chaque couleur, pas par son nom. **Un seul accent.**

| Rôle | Couleur | Usage |
|---|---|---|
| Fond sombre | # | le monde du problème |
| Fond clair | # | le monde de la solution |
| Texte | # | |
| Texte sur clair | # | |
| Accent (un seul) | # | ce qu'il faut regarder, une chose à la fois |

**Polices** : titres ______ · texte ______ (licence : ______)

## Les trois directions

### A — « » 

- Le principe en une phrase :
- L'objet pont (ce qui passe d'un plan à l'autre) :
- Images figées : A1 (accroche), A2 (bascule), A3 (solution)

### B — « »

- Le principe en une phrase :
- L'objet pont :
- Images figées : B1, B2, B3

### C — « »

- Le principe en une phrase :
- L'objet pont :
- Images figées : C1, C2, C3

Les images figées s'écrivent dans `Directions.tsx` (Claude Code les dessine avec vous), puis :
`npm run images -- {{ID}} --directions` → `images/planche-directions.jpg`.

## Le choix

- **Direction retenue** :
- **Ce qu'on emprunte aux autres** :
- **Pourquoi** :

## Validation

- [ ] Les trois directions ne se ressemblent pas (fond, objet, mouvement).
- [ ] Sur chaque image, on sait où regarder en moins d'une seconde.
- [ ] Les textes restent lisibles en 9:16 sur un téléphone.
- [ ] Validé par : ______ le ______
