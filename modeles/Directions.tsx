// Étape 4 (Design) du film « {{TITRE}} » : trois directions, trois images figées chacune
// (accroche, bascule, solution), dessinées à la qualité finale en 1920 × 1080.
// Rendu : npm run images -- {{ID}} --directions → films/{{ID}}/images/planche-directions.jpg
// Claude Code remplace ces cartons par les vraies images, avec vous, d'après DIRECTION.md.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Fond, policesAtelier, type ImageFigee } from "../../src/moteur";

const P = policesAtelier();

const Carton: React.FC<{ direction: string; instant: string; couleurs: [string, string] }> = ({ direction, instant, couleurs }) => (
  <AbsoluteFill>
    <Fond couleurs={couleurs} />
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 24, fontFamily: P.titre, color: "#FFFFFF" }}>
      <div style={{ fontSize: 120, fontWeight: 800 }}>{direction}</div>
      <div style={{ fontSize: 44, fontWeight: 600, opacity: 0.7 }}>{instant} — à dessiner</div>
    </AbsoluteFill>
  </AbsoluteFill>
);

const A1 = () => <Carton direction="A1" instant="Accroche" couleurs={["#14141F", "#2B2B45"]} />;
const A2 = () => <Carton direction="A2" instant="Bascule" couleurs={["#000000", "#14141F"]} />;
const A3 = () => <Carton direction="A3" instant="Solution" couleurs={["#1E3A5F", "#2B5CC6"]} />;
const B1 = () => <Carton direction="B1" instant="Accroche" couleurs={["#2A1A10", "#4E3424"]} />;
const B2 = () => <Carton direction="B2" instant="Bascule" couleurs={["#000000", "#2A1A10"]} />;
const B3 = () => <Carton direction="B3" instant="Solution" couleurs={["#5B3A1E", "#C9822B"]} />;
const C1 = () => <Carton direction="C1" instant="Accroche" couleurs={["#0F2A1E", "#1F4A35"]} />;
const C2 = () => <Carton direction="C2" instant="Bascule" couleurs={["#000000", "#0F2A1E"]} />;
const C3 = () => <Carton direction="C3" instant="Solution" couleurs={["#2F6B4A", "#4E9A6E"]} />;

export const IMAGES_FIGEES: ImageFigee[] = [
  { nom: "A1", Composant: A1 },
  { nom: "A2", Composant: A2 },
  { nom: "A3", Composant: A3 },
  { nom: "B1", Composant: B1 },
  { nom: "B2", Composant: B2 },
  { nom: "B3", Composant: B3 },
  { nom: "C1", Composant: C1 },
  { nom: "C2", Composant: C2 },
  { nom: "C3", Composant: C3 },
];
