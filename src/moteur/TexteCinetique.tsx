import React from "react";
import { Arrivee } from "./Arrivee";

/**
 * Un texte dont les mots arrivent un par un, chacun depuis la caméra.
 * Pour un mot clé, une phrase d'accroche ou une liste (« D'OÙ ? · QUI ? · QUAND ? »).
 */
export const TexteCinetique: React.FC<{
  texte: string;
  /** Instant d'arrivée du premier mot (secondes du plan). */
  a: number;
  /** Écart entre deux mots, en secondes. Idéalement calé sur la voix. */
  intervalle?: number;
  /** Instants exacts de chaque mot (remplace `intervalle`), par ex. tirés du minutage. */
  instants?: number[];
  taille: number;
  couleur: string;
  police: string;
  poids?: number;
  espacement?: number;
  /** Mots à mettre dans la couleur d'accent. */
  accents?: string[];
  couleurAccent?: string;
  style?: React.CSSProperties;
}> = ({ texte, a, intervalle = 0.22, instants, taille, couleur, police, poids = 800, espacement = -0.02, accents = [], couleurAccent, style }) => {
  const mots = texte.split(/\s+/).filter(Boolean);
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: `${taille * 0.08}px ${taille * 0.28}px`,
        fontFamily: police,
        fontWeight: poids,
        fontSize: taille,
        lineHeight: 1.02,
        letterSpacing: `${espacement}em`,
        color: couleur,
        ...style,
      }}
    >
      {mots.map((m, i) => (
        <Arrivee key={i} a={instants?.[i] ?? a + i * intervalle} depuis={1.35} flou={12} duree={0.45} style={{ display: "inline-block" }}>
          <span style={{ color: accents.includes(m) && couleurAccent ? couleurAccent : undefined }}>{m}</span>
        </Arrivee>
      ))}
    </div>
  );
};
