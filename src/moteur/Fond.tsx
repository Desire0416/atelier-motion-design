import React from "react";
import { AbsoluteFill } from "remotion";

const GRAIN =
  "url(\"data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(%23g)'/></svg>",
  ) +
  "\")";

/**
 * Un fond texturé : un dégradé, un léger grain (le fond n'est jamais un aplat
 * mort) et un vignetage qui ramène le regard au centre.
 */
export const Fond: React.FC<{
  couleurs: [string, string];
  /** Angle du dégradé en degrés, ou « radial ». */
  angle?: number | "radial";
  grain?: number;
  vignette?: number;
  children?: React.ReactNode;
}> = ({ couleurs, angle = "radial", grain = 0.07, vignette = 0.35, children }) => (
  <AbsoluteFill
    style={{
      background:
        angle === "radial"
          ? `radial-gradient(circle at 50% 42%, ${couleurs[1]} 0%, ${couleurs[0]} 72%)`
          : `linear-gradient(${angle}deg, ${couleurs[0]}, ${couleurs[1]})`,
    }}
  >
    {children}
    {grain > 0 && <AbsoluteFill style={{ backgroundImage: GRAIN, opacity: grain, mixBlendMode: "overlay" }} />}
    {vignette > 0 && (
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, transparent 55%, rgba(0,0,0,${vignette}) 100%)` }} />
    )}
  </AbsoluteFill>
);
