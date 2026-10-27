# Le moteur de l'atelier (`src/moteur`)

Tout s'importe depuis `../../src/moteur` dans un fichier de film. **Tous les temps sont en secondes**,
relatifs au plan courant (sauf `SousTitres`, `Voix` et `Musique`, posés à la racine du film en temps absolu).
Les tailles se multiplient par `u` (`useFormat()`), qui vaut 1 en 1080 de petit côté : le même code sert en 16:9 et en 9:16.

## Temps et format

| Élément | Rôle |
|---|---|
| `useSecondes()` | le temps courant du plan, en secondes |
| `progression(t, debut, duree, courbe?)` | 0 → 1 entre `debut` et `debut + duree` (courbe `COURBES.sortie` par défaut) |
| `entre(de, vers, p)` | interpolation linéaire |
| `borner(v, min?, max?)` | limite une valeur |
| `useFormat()` | `{ largeur, hauteur, u, portrait, paysage }` |

## Structure

```tsx
<Plan de={10.3} a={17.85} nom="3 · Diagnostic"><Diagnostic /></Plan>
```

Un `Plan` est une séquence entre deux instants du minutage ; à l'intérieur, le temps repart de 0.

## Caméra

```tsx
<Camera
  depart={{ echelle: 1.3, x: 0, y: 0, rotation: 0 }}
  derive={0.015}                       // zoom lent continu, par seconde
  mouvements={[{ a: 3.3, duree: 0.7, x: 60 * u, echelle: 1.12 }]}
  flouMax={14}                         // flou de mouvement maximal
>
  …
</Camera>
```

`x` et `y` désignent le point regardé (la scène se déplace à l'opposé).

## Arrivées, sorties, texte

```tsx
<Arrivee a={1.4} duree={0.55} depuis={1.6} flou={18} decalageY={0}>…</Arrivee>
<Sortie a={4.3} duree={0.45} vers={1.5} flou={16}>…</Sortie>
<TexteCinetique texte="PAS LE KARITÉ." a={0.6} intervalle={0.32} taille={120 * u}
  couleur="#F7EEDF" police={P.titre} poids={800} accents={["KARITÉ."]} couleurAccent="#C9822B" />
```

`TexteCinetique` accepte `instants` (un temps par mot) à la place d'`intervalle` pour caler chaque mot sur la voix.

## Fond et polices

```tsx
const P = policesAtelier();   // { titre: Plus Jakarta Sans, texte: Inter } — licence OFL
<Fond couleurs={["#1C110A", "#3B2416"]} angle="radial" grain={0.06} vignette={0.4} />
chargerPolice("Ma Police", "_commun/polices/MaPolice-700.woff2", "700");  // une autre police sous licence
```

## Sous-titres et son (à la racine du film)

```tsx
<SousTitres minutage={minutage} police={P.texte} couleur="#F7EEDF" couleurAccent="#C9822B"
  motsCles={["karité", "Yéla"]} bandeau="rgba(28,17,10,0.72)" masquer={[[17.85, 21.2]]} />
<Voix fichier="mon-film/voix-montee.wav" />
<Musique fichier="mon-film/musique/tension.mp3" de={0} a={18.2} volume={0.45} minutage={minutage} />
<Bruitage fichier="mon-film/sons/clic.wav" a={2.5} volume={0.4} />   // dans un Plan : temps du plan
```

Les fichiers absents sont ignorés sans erreur (le film se rend quand même) ; les chemins partent de `films/`.
`Musique` baisse d'elle-même pendant les mots de la voix quand on lui passe `minutage`.

## Déclarer le film

```tsx
export const film: DefinitionFilm = {
  id: "mon-film", titre: "…", duree: minutage.duree, fps: 30,
  formats: ["16x9", "9x16"], Composant: MonFilm, imagesFigees: IMAGES_FIGEES,
};
```

`npm run nouveau-film` l'inscrit dans `src/films.ts`. Formats possibles : `16x9`, `9x16`, `4x5`, `1x1`.
