import React from "react";
import { Audio, Sequence, getStaticFiles, interpolate, staticFile, useVideoConfig } from "remotion";
import type { Minutage } from "./types";

/** Vrai si le fichier existe dans films/ (ex. « mon-film/voix-montee.wav »). */
export function fichierExiste(chemin: string): boolean {
  return getStaticFiles().some((f) => f.name === chemin);
}

/** La voix montée : l'horloge du film. Rien n'est joué tant que le fichier n'existe pas. */
export const Voix: React.FC<{ fichier: string; volume?: number }> = ({ fichier, volume = 1 }) =>
  fichierExiste(fichier) ? <Audio src={staticFile(fichier)} volume={volume} /> : null;

/** Distance (en secondes) entre l'instant t et le mot de voix le plus proche (0 pendant un mot). */
function distanceVoix(t: number, minutage: Minutage): number {
  let d = Infinity;
  for (const m of minutage.mots) {
    if (t >= m.debut - 0.1 && t <= m.fin + 0.15) return 0;
    d = Math.min(d, Math.abs(t - m.debut), Math.abs(t - m.fin));
  }
  return d;
}

/**
 * Une musique sous licence, qui s'efface sous la voix (atténuation) et se
 * relève dans les silences : la voix reste toujours compréhensible.
 */
export const Musique: React.FC<{
  fichier: string;
  /** Volume de la musique seule (0 à 1). */
  volume?: number;
  /** Minutage de la voix : la musique baisse pendant qu'elle parle. */
  minutage?: Minutage;
  /** Part du volume gardée sous la voix (0,3 = 30 %). */
  attenuation?: number;
  /** Début et fin de la musique dans le film, en secondes. */
  de?: number;
  a?: number;
  fonduEntree?: number;
  fonduSortie?: number;
}> = ({ fichier, volume = 0.5, minutage, attenuation = 0.3, de = 0, a, fonduEntree = 0.4, fonduSortie = 1.5 }) => {
  const { fps, durationInFrames } = useVideoConfig();
  if (!fichierExiste(fichier)) return null;
  const fin = a ?? durationInFrames / fps;
  return (
    <Sequence from={Math.round(de * fps)} durationInFrames={Math.max(1, Math.round((fin - de) * fps))} name={`Musique ${fichier}`}>
      <Audio
        src={staticFile(fichier)}
        volume={(f) => {
          const tLocal = f / fps;
          const t = de + tLocal;
          const fondu = Math.min(
            interpolate(tLocal, [0, fonduEntree], [0, 1], { extrapolateRight: "clamp" }),
            interpolate(t, [fin - fonduSortie, fin], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          );
          const sousLaVoix = minutage ? interpolate(distanceVoix(t, minutage), [0, 0.3], [attenuation, 1], { extrapolateRight: "clamp" }) : 1;
          return volume * fondu * sousLaVoix;
        }}
      />
    </Sequence>
  );
};

/** Un bruitage calé sur l'image : il part à `a` secondes (temps du film ou du plan). */
export const Bruitage: React.FC<{ fichier: string; a: number; volume?: number }> = ({ fichier, a, volume = 0.6 }) => {
  const { fps } = useVideoConfig();
  if (!fichierExiste(fichier)) return null;
  return (
    <Sequence from={Math.round(a * fps)} name={`Bruitage ${fichier}`} layout="none">
      <Audio src={staticFile(fichier)} volume={volume} />
    </Sequence>
  );
};
