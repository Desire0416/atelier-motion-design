import React from "react";
import { Sequence, useVideoConfig } from "remotion";

/**
 * Un plan du storyboard, écrit en secondes : <Plan de={7.55} a={10.3} nom="Gag muet">.
 * À l'intérieur, le temps repart de 0 (useSecondes()). Les bornes viennent du
 * minutage de la voix : un plan commence et finit dans un silence.
 */
export const Plan: React.FC<{ de: number; a: number; nom?: string; children: React.ReactNode }> = ({ de, a, nom, children }) => {
  const { fps } = useVideoConfig();
  const from = Math.round(de * fps);
  const duree = Math.max(1, Math.round(a * fps) - from);
  return (
    <Sequence from={from} durationInFrames={duree} name={nom ?? `Plan ${de}–${a} s`}>
      {children}
    </Sequence>
  );
};
