import type React from "react";

/** Formats de sortie : 16:9 (page, YouTube), 9:16 (Reels, TikTok, statut WhatsApp), 4:5 et 1:1 (fils d'actualité). */
export type Format = "16x9" | "9x16" | "4x5" | "1x1";

/** Un mot de la voix, avec son début et sa fin en secondes (fichier minutage.json). */
export interface Mot {
  mot: string;
  debut: number;
  fin: number;
}

/** Le minutage d'une voix montée : l'horloge du film. Produit par `npm run minutage`. */
export interface Minutage {
  duree: number;
  mots: Mot[];
  silences?: { debut: number; fin: number }[];
}

// Un type (et non une interface) : Remotion exige des propriétés compatibles avec Record<string, unknown>.
export type ProprietesFilm = {
  format: Format;
};

/** Une image figée (étape Design) : un instant du futur film, à la qualité finale. */
export interface ImageFigee {
  nom: string; // ex. « A1 », « B2 »
  Composant: React.FC;
}

/** Ce qu'un film déclare pour apparaître dans le Studio et au rendu (src/films.ts). */
export interface DefinitionFilm {
  /** Nom du dossier films/<id> (minuscules et tirets). */
  id: string;
  titre: string;
  /** Durée en secondes : celle du montage de la voix, traîne de fin comprise. */
  duree: number;
  fps?: number;
  formats: Format[];
  Composant: React.FC<ProprietesFilm>;
  /** Les images figées des directions (fichier Directions.tsx du film). */
  imagesFigees?: ImageFigee[];
}
