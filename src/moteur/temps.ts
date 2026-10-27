import { Easing, useCurrentFrame, useVideoConfig } from "remotion";

/** Courbes de mouvement de l'atelier (jamais de mouvement linéaire, sauf la dérive). */
export const COURBES = {
  /** Arrive vite, se pose en douceur : entrées, apparitions. */
  sortie: Easing.bezier(0.16, 1, 0.3, 1),
  /** Démarre et s'arrête en douceur : mouvements de caméra. */
  entreeSortie: Easing.bezier(0.65, 0, 0.35, 1),
  /** Démarre doucement, part vite : sorties vers la caméra. */
  entree: Easing.bezier(0.7, 0, 0.84, 0),
};

/** Le temps local en secondes (dans un <Plan>, il repart de 0 au début du plan). */
export function useSecondes(): number {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
}

export const borner = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

/** Avancement de 0 à 1 entre `debut` et `debut + duree`, avec une courbe. */
export function progression(t: number, debut: number, duree: number, courbe: (x: number) => number = COURBES.sortie): number {
  if (duree <= 0) return t >= debut ? 1 : 0;
  return courbe(borner((t - debut) / duree));
}

/** Valeur interpolée entre `de` et `vers` selon l'avancement `p` (0 à 1). */
export const entre = (de: number, vers: number, p: number) => de + (vers - de) * p;
