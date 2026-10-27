import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { COURBES, borner, entre, useSecondes } from "./temps";

/** Ce que regarde la caméra : le point (x, y) du monde au centre de l'écran, et le zoom. */
export interface EtatCamera {
  x: number;
  y: number;
  echelle: number;
  rotation: number;
}

/** Un mouvement daté : à `a` secondes, la caméra part vers un nouvel état en `duree` secondes. */
export interface Mouvement extends Partial<EtatCamera> {
  a: number;
  duree?: number;
}

const DEPART: EtatCamera = { x: 0, y: 0, echelle: 1, rotation: 0 };

/** État de la caméra à l'instant t (mouvements datés appliqués dans l'ordre, puis dérive). */
export function etatCamera(t: number, depart: Partial<EtatCamera>, mouvements: Mouvement[], derive: number): EtatCamera {
  let etat: EtatCamera = { ...DEPART, ...depart };
  for (const m of [...mouvements].sort((a, b) => a.a - b.a)) {
    const duree = m.duree ?? 0.8;
    if (t <= m.a) break;
    const p = COURBES.entreeSortie(borner((t - m.a) / duree));
    etat = {
      x: entre(etat.x, m.x ?? etat.x, p),
      y: entre(etat.y, m.y ?? etat.y, p),
      echelle: entre(etat.echelle, m.echelle ?? etat.echelle, p),
      rotation: entre(etat.rotation, m.rotation ?? etat.rotation, p),
    };
  }
  // La caméra ne s'arrête jamais : une dérive lente (zoom de `derive` par seconde).
  return { ...etat, echelle: etat.echelle * (1 + derive * Math.max(0, t)) };
}

/**
 * Le monde du plan, vu par une caméra qui ne s'arrête jamais : dérive lente
 * en continu, mouvements datés vers ce qui arrive, flou de bougé pendant les
 * mouvements rapides (c'est au sommet de ce flou que l'on raccorde deux plans).
 */
export const Camera: React.FC<{
  depart?: Partial<EtatCamera>;
  mouvements?: Mouvement[];
  /** Zoom lent par seconde (0,012 = 1,2 % par seconde). */
  derive?: number;
  /** Flou de bougé maximal, en pixels. */
  flouMax?: number;
  children: React.ReactNode;
}> = ({ depart = {}, mouvements = [], derive = 0.012, flouMax = 14, children }) => {
  const t = useSecondes();
  const { fps } = useVideoConfig();
  const e = etatCamera(t, depart, mouvements, derive);
  const avant = etatCamera(t - 1 / fps, depart, mouvements, derive);
  const vitesse = (Math.hypot(e.x - avant.x, e.y - avant.y) * e.echelle + Math.abs(Math.log(e.echelle / avant.echelle)) * 900) * fps;
  const flou = borner(vitesse * 0.004, 0, flouMax);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${e.echelle}) rotate(${e.rotation}deg) translate(${-e.x}px, ${-e.y}px)`,
          transformOrigin: "50% 50%",
          filter: flou > 0.3 ? `blur(${flou.toFixed(2)}px)` : undefined,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
