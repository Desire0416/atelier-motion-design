// Éléments partagés du film Yéla (marque fictive) : la charte, le pot, le fil
// doré (l'objet-pont) et les polices. Utilisés par Film.tsx et Directions.tsx.
import React from "react";
import { policesAtelier } from "../../src/moteur";

export const P = policesAtelier();

/** La charte du film : une couleur par rôle, UN seul accent. */
export const CHARTE = {
  nuit: "#1C110A", // monde sombre de la douleur
  brun: "#3B2416",
  papier: "#F7EEDF", // monde clair de la solution
  encre: "#F7EEDF", // texte sur fond sombre
  encreSombre: "#2A1A10", // texte sur fond clair
  accent: "#C9822B", // ocre : le fil doré, les mots clés
  accentClair: "#E7C27D",
  feuille: "#4E6B3A",
};

/** Place un élément au point (x, y) du monde (0, 0 = centre de l'écran). */
export const Au: React.FC<{ x?: number; y?: number; children: React.ReactNode }> = ({ x = 0, y = 0, children }) => (
  // max-content : sans lui, un texte placé au centre ne dispose que de la moitié de l'écran et passe à la ligne.
  <div style={{ position: "absolute", left: "50%", top: "50%", width: "max-content", transform: `translate(-50%, -50%) translate(${x}px, ${y}px)` }}>{children}</div>
);

/** Le pot de karité, dessiné en formes simples ; son étiquette reçoit `children`. */
export const Pot: React.FC<{ taille: number; children?: React.ReactNode; couvercle?: number }> = ({ taille, children, couvercle = 0 }) => (
  <div style={{ position: "relative", width: taille, height: taille * 0.95 }}>
    <div
      style={{
        position: "absolute",
        left: taille * 0.04,
        right: taille * 0.04,
        top: taille * 0.02,
        height: taille * 0.16,
        borderRadius: taille * 0.05,
        background: `linear-gradient(180deg, ${CHARTE.accentClair}, ${CHARTE.accent})`,
        transformOrigin: "10% 100%",
        transform: `translateY(${-couvercle * taille * 0.2}px) rotate(${-couvercle * 28}deg)`,
        boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: taille * 0.16,
        bottom: 0,
        borderRadius: taille * 0.12,
        background: `linear-gradient(160deg, #5A3A24, ${CHARTE.brun} 60%, #26170D)`,
        boxShadow: `inset 0 ${taille * 0.02}px ${taille * 0.05}px rgba(255,255,255,0.12), 0 ${taille * 0.06}px ${taille * 0.12}px rgba(0,0,0,0.35)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "78%",
          minHeight: "58%",
          padding: `${taille * 0.035}px 0`,
          borderRadius: taille * 0.04,
          background: CHARTE.papier,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: taille * 0.012,
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  </div>
);

/** Deux traits gris : une étiquette vide. */
export const EtiquetteVide: React.FC<{ u: number }> = ({ u }) => (
  <>
    <div style={{ width: "70%", height: 4 * u, background: "rgba(42,26,16,0.15)", borderRadius: 4 }} />
    <div style={{ width: "48%", height: 4 * u, background: "rgba(42,26,16,0.15)", borderRadius: 4 }} />
  </>
);

/** Le fil doré : l'objet-pont du film (le trait dans le noir, le bord de l'étiquette, le soulignement du logo). */
export const Fil: React.FC<{ longueur: number; avancement: number; epaisseur?: number }> = ({ longueur, avancement, epaisseur = 6 }) => (
  <div style={{ width: longueur, height: epaisseur, borderRadius: epaisseur, background: "rgba(231,194,125,0.15)" }}>
    <div
      style={{
        width: `${avancement * 100}%`,
        height: "100%",
        borderRadius: epaisseur,
        background: `linear-gradient(90deg, ${CHARTE.accent}, ${CHARTE.accentClair})`,
        boxShadow: `0 0 ${epaisseur * 3}px ${CHARTE.accentClair}`,
      }}
    />
  </div>
);

/** Une silhouette simple (tête et buste) pour « QUI ? ». */
export const Silhouette: React.FC<{ taille: number; couleur: string }> = ({ taille, couleur }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: taille * 0.06 }}>
    <div style={{ width: taille * 0.42, height: taille * 0.42, borderRadius: "50%", background: couleur }} />
    <div style={{ width: taille * 0.8, height: taille * 0.4, borderRadius: `${taille * 0.4}px ${taille * 0.4}px ${taille * 0.08}px ${taille * 0.08}px`, background: couleur }} />
  </div>
);
