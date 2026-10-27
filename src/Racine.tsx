import React from "react";
import { Composition, Folder, useCurrentFrame } from "remotion";
import { FILMS } from "./films";
import { FORMATS } from "./moteur/formats";
import type { DefinitionFilm } from "./moteur/types";

/** Affiche l'image figée n° (image courante) d'un film : une image par direction artistique. */
const planches = new Map<string, React.FC>();
const imagesFigees = (film: DefinitionFilm) => {
  if (!planches.has(film.id)) {
    const Planche: React.FC = () => {
      const i = useCurrentFrame();
      const Image = film.imagesFigees?.[i]?.Composant;
      return Image ? <Image /> : null;
    };
    planches.set(film.id, Planche);
  }
  return planches.get(film.id)!;
};

/**
 * Toutes les compositions de l'atelier : pour chaque film, une composition par
 * format (« <film>-16x9 », « <film>-9x16 »…) et, si le film en a, ses images
 * figées (« <film>-images », une image par entrée de Directions.tsx).
 */
export const Racine: React.FC = () => (
  <>
    {FILMS.map((film) => {
      const fps = film.fps ?? 30;
      return (
        <Folder key={film.id} name={film.id}>
          {film.formats.map((format) => (
            <Composition
              key={format}
              id={`${film.id}-${format}`}
              component={film.Composant}
              width={FORMATS[format].largeur}
              height={FORMATS[format].hauteur}
              fps={fps}
              durationInFrames={Math.max(1, Math.round(film.duree * fps))}
              defaultProps={{ format }}
            />
          ))}
          {film.imagesFigees?.length ? (
            <Composition
              id={`${film.id}-images`}
              component={imagesFigees(film)}
              width={1920}
              height={1080}
              fps={1}
              durationInFrames={film.imagesFigees.length}
            />
          ) : null}
        </Folder>
      );
    })}
  </>
);
