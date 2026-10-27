// Étape Design : trois directions vraiment différentes pour la même voix,
// trois images figées chacune (un instant du futur film, à la qualité finale).
// Rendu : npm run images -- yela-exemple --directions  → films/yela-exemple/images/
// Direction retenue : A (« Le pot qui parle »), avec un emprunt à B (la carte).
import React from "react";
import { AbsoluteFill } from "remotion";
import { Fond, type ImageFigee } from "../../src/moteur";
import { Au, CHARTE, EtiquetteVide, Fil, P, Pot } from "./elements";

const u = 1; // les images figées sont en 1920 × 1080

const Titre: React.FC<{ children: React.ReactNode; taille?: number; couleur?: string; flou?: number }> = ({ children, taille = 90, couleur = CHARTE.encre, flou = 0 }) => (
  <div style={{ fontFamily: P.titre, fontWeight: 800, fontSize: taille, color: couleur, letterSpacing: "-0.01em", filter: flou ? `blur(${flou}px)` : undefined, textAlign: "center" }}>{children}</div>
);

const Legende: React.FC<{ texte: string; sombre?: boolean }> = ({ texte, sombre = true }) => (
  <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 70 }}>
    <div style={{ fontFamily: P.texte, fontWeight: 600, fontSize: 44, color: sombre ? CHARTE.encre : CHARTE.encreSombre, textShadow: sombre ? "0 2px 14px rgba(0,0,0,0.5)" : "none" }}>{texte}</div>
  </AbsoluteFill>
);

/* ── Direction A — « Le pot qui parle » : tout se passe sur le pot et son étiquette ── */
const A1 = () => (
  <AbsoluteFill>
    <Fond couleurs={[CHARTE.nuit, CHARTE.brun]} />
    <Au x={-560} y={-300}><Titre taille={60} flou={10}>LUNDI</Titre></Au>
    <Au x={540} y={-260}><Titre taille={64}>MARDI</Titre></Au>
    <Au><Pot taille={380}><EtiquetteVide u={u} /></Pot></Au>
    <Au x={260} y={-210}><Titre taille={220} couleur={CHARTE.accent}>?</Titre></Au>
    <Legende texte="Mardi, tu te demandes d'où il vient." />
  </AbsoluteFill>
);
const A2 = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Au y={-40}><Titre taille={64}>Il est temps de savoir.</Titre></Au>
    <Au y={60}><Fil longueur={700} avancement={1} epaisseur={14} /></Au>
  </AbsoluteFill>
);
const A3 = () => (
  <AbsoluteFill>
    <Fond couleurs={["#EADCC4", CHARTE.papier]} vignette={0.15} />
    <Au>
      <div style={{ transform: "scale(1.7)" }}>
        <Pot taille={360}>
          <div style={{ position: "absolute", inset: 10, border: `3px solid ${CHARTE.accent}`, borderRadius: 10 }} />
          <Titre taille={40} couleur={CHARTE.encreSombre}>YÉLA</Titre>
          <Titre taille={26} couleur={CHARTE.encreSombre}>KORHOGO</Titre>
          <Titre taille={18} couleur={CHARTE.encreSombre}>PRÉPARÉ À LA MAIN</Titre>
        </Pot>
      </div>
    </Au>
    <Legende texte="la ville de Korhogo, les mains qui l'ont préparé" sombre={false} />
  </AbsoluteFill>
);

/* ── Direction B — « Le chemin du karité » : une carte, de Korhogo à la ville ── */
const Carte: React.FC<{ avancement: number; nuit?: boolean }> = ({ avancement, nuit = true }) => (
  <svg width={1400} height={700} viewBox="0 0 1400 700">
    <path d="M 160 160 C 420 120, 520 420, 780 380 S 1120 560, 1260 560" fill="none" stroke={nuit ? "rgba(247,238,223,0.12)" : "rgba(42,26,16,0.12)"} strokeWidth={10} strokeLinecap="round" />
    <path d="M 160 160 C 420 120, 520 420, 780 380 S 1120 560, 1260 560" fill="none" stroke={CHARTE.accent} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={`${avancement} 1`} />
    <circle cx={160} cy={160} r={18} fill={CHARTE.accentClair} />
    <circle cx={1260} cy={560} r={18} fill={avancement > 0.95 ? CHARTE.accentClair : "rgba(247,238,223,0.3)"} />
    <text x={160} y={115} textAnchor="middle" fontFamily="Inter" fontWeight={600} fontSize={38} fill={nuit ? CHARTE.encre : CHARTE.encreSombre}>Korhogo</text>
    <text x={1260} y={625} textAnchor="middle" fontFamily="Inter" fontWeight={600} fontSize={38} fill={nuit ? CHARTE.encre : CHARTE.encreSombre}>Abidjan</text>
  </svg>
);
const B1 = () => (
  <AbsoluteFill>
    <Fond couleurs={["#0E140B", "#1F2A17"]} />
    <Au><Carte avancement={0} /></Au>
    <Au x={0} y={-30}><Titre taille={180} couleur={CHARTE.accent}>?</Titre></Au>
    <Legende texte="Mercredi... personne ne sait." />
  </AbsoluteFill>
);
const B2 = () => (
  <AbsoluteFill>
    <Fond couleurs={["#0E140B", "#1F2A17"]} />
    <Au><div style={{ filter: "blur(1.5px)" }}><Carte avancement={0.6} /></div></Au>
    <Au y={-300}><Titre taille={70}>D'OÙ VIENT LA NOIX ?</Titre></Au>
  </AbsoluteFill>
);
const B3 = () => (
  <AbsoluteFill>
    <Fond couleurs={["#E3E7D6", "#F4F6EC"]} vignette={0.12} />
    <Au><Carte avancement={1} nuit={false} /></Au>
    <Au y={-290}><Titre taille={84} couleur={CHARTE.feuille}>Yéla</Titre></Au>
    <Legende texte="Chez Yéla, chaque pot raconte son karité" sombre={false} />
  </AbsoluteFill>
);

/* ── Direction C — « Trois jours au marché » : une grille de calendrier ── */
const Case: React.FC<{ jour: string; barre?: boolean; claire?: boolean; children?: React.ReactNode }> = ({ jour, barre, claire, children }) => (
  <div style={{ width: 400, height: 420, borderRadius: 26, background: claire ? CHARTE.papier : "rgba(247,238,223,0.06)", border: `3px solid ${claire ? CHARTE.accent : "rgba(247,238,223,0.2)"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, position: "relative" }}>
    <div style={{ fontFamily: P.titre, fontWeight: 800, fontSize: 46, color: claire ? CHARTE.encreSombre : CHARTE.encre }}>{jour}</div>
    {children}
    {barre && <div style={{ position: "absolute", width: "86%", height: 10, background: CHARTE.accent, transform: "rotate(-24deg)", borderRadius: 10 }} />}
  </div>
);
const C1 = () => (
  <AbsoluteFill>
    <Fond couleurs={["#120D0A", "#24170F"]} />
    <Au><div style={{ display: "flex", gap: 40 }}><Case jour="LUNDI" /><Case jour="MARDI" /><Case jour="MERCREDI" /></div></Au>
    <Legende texte="Lundi, tu achètes du beurre de karité au marché." />
  </AbsoluteFill>
);
const C2 = () => (
  <AbsoluteFill>
    <Fond couleurs={["#120D0A", "#24170F"]} />
    <Au><div style={{ transform: "scale(1.5)" }}><Case jour="MERCREDI" barre /></div></Au>
    <Au y={-420}><Titre taille={64}>PERSONNE NE SAIT.</Titre></Au>
  </AbsoluteFill>
);
const C3 = () => (
  <AbsoluteFill>
    <Fond couleurs={["#EADCC4", CHARTE.papier]} vignette={0.12} />
    <Au>
      <div style={{ transform: "scale(1.35)" }}>
        <Case jour="AUJOURD'HUI" claire>
          <div style={{ transform: "scale(0.55)", marginTop: -60 }}><Pot taille={360}><Titre taille={34} couleur={CHARTE.encreSombre}>YÉLA</Titre></Pot></div>
        </Case>
      </div>
    </Au>
    <Legende texte="Tu l'ouvres... tu sais." sombre={false} />
  </AbsoluteFill>
);

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
