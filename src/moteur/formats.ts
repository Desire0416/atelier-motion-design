import { useVideoConfig } from "remotion";
import type { Format } from "./types";

export const FORMATS: Record<Format, { largeur: number; hauteur: number; nom: string }> = {
  "16x9": { largeur: 1920, hauteur: 1080, nom: "Paysage 16:9" },
  "9x16": { largeur: 1080, hauteur: 1920, nom: "Vertical 9:16" },
  "4x5": { largeur: 1080, hauteur: 1350, nom: "Fil 4:5" },
  "1x1": { largeur: 1080, hauteur: 1080, nom: "Carré 1:1" },
};

/**
 * Dimensions du format en cours. `u` est l'unité de mise en page : 1 u = 1 px
 * pour un petit côté de 1080 px. Écrire les tailles en `u` (ex. 96 * u) garde
 * les mêmes proportions dans tous les formats.
 */
export function useFormat() {
  const { width, height } = useVideoConfig();
  const u = Math.min(width, height) / 1080;
  return {
    largeur: width,
    hauteur: height,
    u,
    portrait: height > width * 1.2,
    paysage: width > height * 1.2,
  };
}
