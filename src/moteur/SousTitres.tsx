import React from "react";
import { AbsoluteFill } from "remotion";
import { useFormat } from "./formats";
import { borner, useSecondes } from "./temps";
import type { Minutage, Mot } from "./types";

const normaliser = (s: string) =>
  s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");

/** Regroupe les mots en lignes de sous-titres : une phrase courte, ou au plus `max` mots. */
export function grouperMots(mots: Mot[], max: number): Mot[][] {
  const groupes: Mot[][] = [];
  let courant: Mot[] = [];
  for (const [i, m] of mots.entries()) {
    const precedent = mots[i - 1];
    const finDePhrase = precedent && /[.!?…:]$/.test(precedent.mot.trim());
    const pause = precedent && m.debut - precedent.fin > 0.35;
    // Un dernier mot de phrase reste avec les autres plutôt que seul à l'écran.
    const orphelin = courant.length === max && /[.!?…:]$/.test(m.mot.trim());
    if (courant.length && (finDePhrase || pause || (courant.length >= max && !orphelin))) {
      groupes.push(courant);
      courant = [];
    }
    courant.push(m);
  }
  if (courant.length) groupes.push(courant);
  return groupes;
}

/**
 * Sous-titres mot à mot, calés sur la voix : chaque mot arrive un peu avant
 * d'être prononcé (`avance`), en 6 images au plus. Les mots clés sont
 * encadrés dans la couleur d'accent. À placer à la racine du film (temps absolu).
 */
export const SousTitres: React.FC<{
  minutage: Minutage;
  motsCles?: string[];
  police: string;
  couleur: string;
  couleurAccent: string;
  couleurTexteAccent?: string;
  /** Taille du texte en unités de format (voir useFormat). */
  taille?: number;
  /** Avance de l'arrivée de chaque mot sur la voix, en secondes. */
  avance?: number;
  /** Ombre portée pour rester lisible sur une image sombre et chargée. */
  ombre?: boolean;
  /** Bandeau derrière les mots dits (ex. « rgba(20,12,8,0.72) ») : lisible sur fond clair comme sombre. */
  bandeau?: string;
  /** Intervalles [début, fin] en secondes sans sous-titres : quand l'écran affiche déjà la phrase dite. */
  masquer?: [number, number][];
}> = ({ minutage, motsCles = [], police, couleur, couleurAccent, couleurTexteAccent = "#FFFFFF", taille = 50, avance = 0.15, ombre = true, bandeau, masquer = [] }) => {
  const t = useSecondes();
  const { u, portrait } = useFormat();
  const groupes = React.useMemo(() => grouperMots(minutage.mots, portrait ? 4 : 7), [minutage, portrait]);
  const cles = React.useMemo(() => new Set(motsCles.map(normaliser)), [motsCles]);

  const index = groupes.findIndex((g, i) => {
    const debut = g[0].debut - avance;
    const suivant = groupes[i + 1]?.[0].debut;
    const fin = Math.min(suivant !== undefined ? suivant - avance : Infinity, g[g.length - 1].fin + 0.5);
    return t >= debut && t < fin;
  });
  if (index < 0 || masquer.some(([de, a]) => t >= de && t < a)) return null;
  const groupe = groupes[index];
  // Le bandeau ne couvre que les mots déjà arrivés : il grandit avec la phrase.
  const dernierVisible = groupe.reduce((n, m, i) => (t >= m.debut - avance ? i : n), -1);

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: (portrait ? 330 : 86) * u, pointerEvents: "none" }}>
      <div
        style={{
          maxWidth: portrait ? "86%" : "74%",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: bandeau ? `${10 * u}px 0px` : `${10 * u}px ${14 * u}px`,
          fontFamily: police,
          fontWeight: 600,
          fontSize: taille * u,
          lineHeight: 1.18,
          color: couleur,
          textShadow: ombre && !bandeau ? `0 ${2 * u}px ${14 * u}px rgba(0,0,0,0.55)` : undefined,
        }}
      >
        {groupe.map((m, i) => {
          const visible = t >= m.debut - avance;
          const p = borner((t - (m.debut - avance)) / 0.2); // 6 images à 30 i/s
          const cle = cles.has(normaliser(m.mot));
          const fond = cle ? couleurAccent : bandeau;
          const rayon = 12 * u;
          return (
            // Le fond du mot apparaît d'un coup, sans bouger ; seul le mot glisse et s'éclaire.
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity: visible ? Math.min(1, p * 2.5) : 0,
                padding: bandeau ? `${8 * u}px ${9 * u}px` : cle ? `${2 * u}px ${12 * u}px` : undefined,
                borderRadius: bandeau && !cle ? `${i === 0 ? rayon : 0}px ${i === dernierVisible ? rayon : 0}px ${i === dernierVisible ? rayon : 0}px ${i === 0 ? rayon : 0}px` : cle ? 10 * u : undefined,
                background: visible ? fond : undefined,
                color: cle ? couleurTexteAccent : undefined,
                textShadow: cle ? "none" : undefined,
              }}
            >
              <span style={{ display: "inline-block", opacity: visible ? p : 0, transform: `translateY(${(1 - p) * 14 * u}px)` }}>{m.mot.trim()}</span>
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
