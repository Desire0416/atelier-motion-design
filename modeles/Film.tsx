// Film « {{TITRE}} » — créé le {{DATE}}.
// Étape 5 (Claude Code) puis 6 (Animation) : ce fichier s'écrit séquence par
// séquence d'après STORYBOARD.md, sur les temps de minutage.json. Une séquence
// pilote d'abord, vérifiée sur images clés, puis le reste du film.
import React from "react";
import { AbsoluteFill } from "remotion";
import {
  Arrivee,
  Camera,
  Fond,
  Plan,
  SousTitres,
  Voix,
  policesAtelier,
  useFormat,
  type DefinitionFilm,
  type Minutage,
  type ProprietesFilm,
} from "../../src/moteur";
import minutageJson from "./minutage.json";
import { IMAGES_FIGEES } from "./Directions";

const minutage = minutageJson as Minutage;
const P = policesAtelier();

// Les couleurs par rôle (DIRECTION.md). Un seul accent.
const CHARTE = {
  fondSombre: "#14141F",
  fondClair: "#F4F1EA",
  texte: "#FFFFFF",
  texteSurClair: "#14141F",
  accent: "#00BCD4",
};

/* ─────────────── Séquence de départ (à remplacer par la première séquence du storyboard) ─────────────── */
const Ouverture: React.FC = () => {
  const { u } = useFormat();
  return (
    <AbsoluteFill>
      <Fond couleurs={[CHARTE.fondSombre, "#262640"]} />
      <Camera derive={0.01}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 80 * u }}>
          <Arrivee a={0.3}>
            <div style={{ fontFamily: P.titre, fontWeight: 800, fontSize: 96 * u, color: CHARTE.texte, textAlign: "center" }}>
              {"{{TITRE}}"}
            </div>
          </Arrivee>
        </AbsoluteFill>
      </Camera>
    </AbsoluteFill>
  );
};

/* ─────────────── Le film ─────────────── */
const {{COMPOSANT}}: React.FC<ProprietesFilm> = () => (
  <AbsoluteFill style={{ background: CHARTE.fondSombre }}>
    <Plan de={0} a={minutage.duree} nom="1 · Ouverture"><Ouverture /></Plan>

    <SousTitres minutage={minutage} police={P.texte} couleur={CHARTE.texte} couleurAccent={CHARTE.accent} bandeau="rgba(20,20,31,0.72)" />
    <Voix fichier="{{ID}}/voix-montee.wav" />
  </AbsoluteFill>
);

export const film: DefinitionFilm = {
  id: "{{ID}}",
  titre: "{{TITRE}}",
  duree: minutage.duree,
  fps: 30,
  formats: ["16x9", "9x16"],
  Composant: {{COMPOSANT}},
  imagesFigees: IMAGES_FIGEES,
};
