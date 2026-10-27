import React from "react";
import { COURBES, borner, entre, progression, useSecondes } from "./temps";

/**
 * Un élément qui arrive depuis la caméra : trop grand et flou, puis il se pose.
 * C'est la signature des films de l'atelier, bien plus vivante qu'un fondu.
 */
export const Arrivee: React.FC<{
  /** Instant d'arrivée, en secondes (temps du plan). */
  a: number;
  duree?: number;
  /** Échelle de départ (1,6 = arrive 60 % trop grand). */
  depuis?: number;
  /** Flou de départ, en pixels. */
  flou?: number;
  /** Petit décalage vertical de départ, en pixels. */
  decalageY?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ a, duree = 0.55, depuis = 1.6, flou = 18, decalageY = 0, style, children }) => {
  const t = useSecondes();
  if (t < a) return null;
  const p = progression(t, a, duree, COURBES.sortie);
  return (
    <div
      style={{
        ...style,
        opacity: borner(p * 4),
        transform: `translateY(${entre(decalageY, 0, p)}px) scale(${entre(depuis, 1, p)})`,
        filter: p < 0.98 ? `blur(${entre(flou, 0, p).toFixed(2)}px)` : undefined,
      }}
    >
      {children}
    </div>
  );
};

/** L'inverse : à `a` secondes, l'élément part vers la caméra (grandit, se floute, disparaît). */
export const Sortie: React.FC<{
  a: number;
  duree?: number;
  vers?: number;
  flou?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ a, duree = 0.45, vers = 1.5, flou = 16, style, children }) => {
  const t = useSecondes();
  const p = progression(t, a, duree, COURBES.entree);
  if (p >= 1) return null;
  return (
    <div
      style={{
        ...style,
        opacity: 1 - p,
        transform: p > 0 ? `scale(${entre(1, vers, p)})` : undefined,
        filter: p > 0.02 ? `blur(${entre(0, flou, p).toFixed(2)}px)` : undefined,
      }}
    >
      {children}
    </div>
  );
};
