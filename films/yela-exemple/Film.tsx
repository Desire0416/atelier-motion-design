// Film d'exemple de l'atelier : « Yéla », marque de soins au karité ENTIÈREMENT
// FICTIVE (fil rouge de la formation Access Academy). 39 s, 16:9 et 9:16.
// Il suit STORYBOARD.md plan par plan, sur le minutage de minutage.json.
import React from "react";
import { AbsoluteFill } from "remotion";
import {
  Arrivee,
  Bruitage,
  Camera,
  Fond,
  Musique,
  Plan,
  SousTitres,
  Sortie,
  TexteCinetique,
  Voix,
  entre,
  progression,
  useFormat,
  useSecondes,
  type DefinitionFilm,
  type Minutage,
  type ProprietesFilm,
} from "../../src/moteur";
import minutageJson from "./minutage.json";
import { IMAGES_FIGEES } from "./Directions";
import { Au, CHARTE, EtiquetteVide, Fil, P, Pot, Silhouette } from "./elements";

const minutage = minutageJson as Minutage;

/* ─────────────── Séquence 1 — Accroche datée (0 → 7,55 s), monde sombre ─────────────── */
const Accroche: React.FC = () => {
  const { u, portrait } = useFormat();
  const carte = (jour: string, a: number, x: number, y: number) => (
    <Au x={x * u} y={y * u}>
      <Arrivee a={a} depuis={1.9} flou={22}>
        <div style={{ fontFamily: P.titre, fontWeight: 800, fontSize: 64 * u, letterSpacing: "0.08em", color: CHARTE.encre, padding: `${10 * u}px ${26 * u}px`, border: `${3 * u}px solid rgba(247,238,223,0.25)`, borderRadius: 18 * u }}>
          {jour}
        </div>
      </Arrivee>
    </Au>
  );
  const t = useSecondes();
  const doute = progression(t, 6.75, 0.6);
  return (
    <AbsoluteFill>
      <Fond couleurs={[CHARTE.nuit, CHARTE.brun]} />
      <Camera derive={0.015} mouvements={[{ a: 3.3, duree: 0.7, x: 60 * u, echelle: 1.12 }, { a: 5.7, duree: 0.6, x: -40 * u, echelle: 1.28 }]}>
        {carte("LUNDI", 0.3, portrait ? -170 : -560, portrait ? -560 : -260)}
        {carte("MARDI", 3.4, portrait ? 170 : 440, portrait ? -420 : -260)}
        {/* Jamais sous les sous-titres : en bas à gauche en 16:9, entre le pot et les sous-titres en 9:16 (hors de la zone des boutons des réseaux). */}
        {carte("MERCREDI", 5.8, portrait ? 0 : -460, portrait ? 300 : 210)}
        <Au>
          <Arrivee a={1.4} depuis={1.7} flou={20} duree={0.7}>
            <Pot taille={360 * u}>
              <EtiquetteVide u={u} />
            </Pot>
          </Arrivee>
        </Au>
        <Au x={250 * u} y={-200 * u}>
          <Arrivee a={4.55} depuis={2.2} flou={24}>
            <div style={{ fontFamily: P.titre, fontWeight: 800, fontSize: 220 * u, color: CHARTE.accent, transform: `scale(${entre(1, 0.55, doute)})`, opacity: entre(1, 0.5, doute) }}>?</div>
          </Arrivee>
        </Au>
      </Camera>
    </AbsoluteFill>
  );
};

/* ─────────────── Séquence 2 — Gag muet (7,55 → 10,30 s) : le pot se retourne, l'étiquette est vide ─────────────── */
const GagMuet: React.FC = () => {
  const { u } = useFormat();
  const t = useSecondes();
  const tour = progression(t, 0.35, 1.1); // 0 → 1 : un demi-tour
  const face = Math.abs(Math.cos(tour * Math.PI));
  return (
    <AbsoluteFill>
      <Fond couleurs={[CHARTE.nuit, CHARTE.brun]} vignette={0.5} />
      {/* Après le demi-tour, la caméra continue d'avancer vers le pot : jamais d'image arrêtée. */}
      <Camera depart={{ echelle: 1.3 }} derive={0.03} mouvements={[{ a: 1.5, duree: 1.2, x: -24 * u, y: 10 * u, echelle: 1.4 }]}>
        <Au>
          <div style={{ transform: `scaleX(${Math.max(0.04, face)})` }}>
            <Pot taille={360 * u}>
              {tour > 0.5 ? (
                <div style={{ fontFamily: P.texte, fontSize: 30 * u, color: "rgba(42,26,16,0.35)" }}>(rien)</div>
              ) : (
                <EtiquetteVide u={u} />
              )}
            </Pot>
          </div>
        </Au>
        <Au x={230 * u} y={-210 * u}>
          <Arrivee a={1.75} depuis={0.4} flou={0} duree={0.35}>
            <div style={{ fontFamily: P.titre, fontWeight: 800, fontSize: 90 * u, color: CHARTE.accentClair }}>…</div>
          </Arrivee>
        </Au>
      </Camera>
      <Bruitage fichier="yela-exemple/sons/pop.wav" a={1.75} volume={0.5} />
    </AbsoluteFill>
  );
};

/* ─────────────── Séquence 3 — Diagnostic et trois douleurs (10,30 → 17,85 s) ─────────────── */
const Diagnostic: React.FC = () => {
  const { u, portrait } = useFormat();
  // Les trois stations du monde : en ligne en 16:9, en colonne en 9:16.
  const station = (i: number) => (portrait ? { x: 0, y: (i - 1) * 520 * u } : { x: (i - 1) * 700 * u, y: 40 * u });
  const s = [0, 1, 2].map(station);
  const douleur = (i: number, texte: string, a: number, symbole: React.ReactNode) => (
    <Au x={s[i].x} y={s[i].y}>
      <Arrivee a={a} depuis={1.8} flou={20}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 * u }}>
          <div style={{ width: 200 * u, height: 200 * u, borderRadius: "50%", border: `${5 * u}px solid ${CHARTE.accent}`, display: "grid", placeItems: "center" }}>{symbole}</div>
          <div style={{ fontFamily: P.titre, fontWeight: 800, fontSize: 96 * u, color: CHARTE.encre }}>{texte}</div>
        </div>
      </Arrivee>
    </Au>
  );
  return (
    <AbsoluteFill>
      <Fond couleurs={[CHARTE.nuit, "#2B1A0F"]} />
      <Camera
        depart={{ x: 0, y: portrait ? -900 * u : -600 * u, echelle: 1 }}
        derive={0.018}
        mouvements={[
          { a: 4.45, duree: 0.6, x: s[0].x, y: s[0].y, echelle: portrait ? 1.05 : 1.25 },
          { a: 5.8, duree: 0.5, x: s[1].x, y: s[1].y },
          { a: 7.0, duree: 0.45, x: s[2].x, y: s[2].y },
        ]}
      >
        <Au y={portrait ? -900 * u : -600 * u}>
          <Sortie a={4.3}>
            <TexteCinetique texte="PAS LE KARITÉ." a={0.6} intervalle={0.32} taille={120 * u} couleur={CHARTE.encre} police={P.titre} accents={["KARITÉ."]} couleurAccent={CHARTE.accent} />
            <div style={{ height: 40 * u }} />
            <TexteCinetique texte="TOUT CE QU'ON NE TE DIT PAS." a={2.2} intervalle={0.2} taille={72 * u} couleur={CHARTE.accentClair} police={P.titre} style={{ maxWidth: (portrait ? 900 : 1300) * u }} />
          </Sortie>
        </Au>
        {douleur(0, "D'OÙ ?", 4.6, <div style={{ width: 90 * u, height: 110 * u, borderRadius: "50% 50% 46% 46%", background: CHARTE.accent }} />)}
        {douleur(1, "QUI ?", 5.9, <Silhouette taille={110 * u} couleur={CHARTE.encre} />)}
        {douleur(2, "QUAND ?", 7.1, <div style={{ width: 100 * u, height: 100 * u, borderRadius: 14 * u, border: `${6 * u}px solid ${CHARTE.encre}`, borderTopWidth: 22 * u }} />)}
      </Camera>
    </AbsoluteFill>
  );
};

/* ─────────────── Séquence 4 — Bascule au noir (17,85 → 21,20 s) ─────────────── */
const Bascule: React.FC = () => {
  const { u } = useFormat();
  const t = useSecondes();
  const point = progression(t, 2.55, 0.5);
  const trait = progression(t, 3.05, 0.3);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* Même au noir, la phrase avance lentement vers nous. */}
      <Camera derive={0.045}>
        <Au y={-40 * u}>
          <Arrivee a={0.45} depuis={1.15} flou={8} duree={0.6}>
            <Sortie a={2.25} vers={1.1} flou={6}>
              <div style={{ fontFamily: P.titre, fontWeight: 600, fontSize: 64 * u, color: CHARTE.encre }}>Il est temps de savoir.</div>
            </Sortie>
          </Arrivee>
        </Au>
        <Au y={60 * u}>
          <div style={{ opacity: point, transform: `scale(${entre(0, 1, point)})` }}>
            <Fil longueur={entre(14, 900, trait) * u} avancement={1} epaisseur={14 * u} />
          </div>
        </Au>
      </Camera>
    </AbsoluteFill>
  );
};

/* ─────────────── Séquence 5 — La solution : le pot qui dit d'où il vient (21,20 → 29,90 s), monde clair ─────────────── */
const Solution: React.FC = () => {
  const { u, portrait } = useFormat();
  const t = useSecondes();
  const ligne = (texte: string, a: number, taille = 34) => (
    <Arrivee a={a} depuis={1.5} flou={10} duree={0.45}>
      <div style={{ fontFamily: P.titre, fontWeight: 800, fontSize: taille * u, color: CHARTE.encreSombre, letterSpacing: "0.04em", textAlign: "center" }}>{texte}</div>
    </Arrivee>
  );
  const bord = progression(t, 0.1, 0.9);
  const couvercle = progression(t, 7.1, 0.6);
  const lueur = progression(t, 8.1, 0.6);
  return (
    <AbsoluteFill>
      <Fond couleurs={["#EADCC4", CHARTE.papier]} vignette={0.15} grain={0.05} />
      <Camera
        depart={{ echelle: portrait ? 1.6 : 1.7, y: -40 * u }}
        derive={0.012}
        mouvements={[
          { a: 2.45, duree: 0.5, y: -10 * u, echelle: portrait ? 1.75 : 1.9 },
          { a: 4.05, duree: 0.45, y: 30 * u },
          { a: 5.5, duree: 0.45, y: 70 * u },
          { a: 6.95, duree: 0.8, y: 0, echelle: 1.05 },
        ]}
      >
        <Au>
          <div style={{ position: "absolute", inset: -60 * u, borderRadius: "50%", background: `radial-gradient(circle, rgba(231,194,125,${0.55 * lueur}) 0%, transparent 70%)` }} />
          <Pot taille={360 * u} couvercle={couvercle}>
            <div style={{ position: "absolute", inset: 10 * u, border: `${3 * u}px solid ${CHARTE.accent}`, borderRadius: 10 * u, clipPath: `inset(0 ${100 - bord * 100}% 0 0)` }} />
            {ligne("YÉLA", 1.0, 40)}
            {ligne("KORHOGO", 2.5, 26)}
            {ligne("PRÉPARÉ À LA MAIN", 4.1, 18)}
            {ligne("FABRIQUÉ LE 12.10.2026", 5.55, 16)}
          </Pot>
        </Au>
      </Camera>
      <Bruitage fichier="yela-exemple/sons/clic.wav" a={2.5} volume={0.4} />
      <Bruitage fichier="yela-exemple/sons/clic.wav" a={4.1} volume={0.4} />
      <Bruitage fichier="yela-exemple/sons/clic.wav" a={5.55} volume={0.4} />
      <Bruitage fichier="yela-exemple/sons/notification.wav" a={8.1} volume={0.55} />
    </AbsoluteFill>
  );
};

/* ─────────────── Séquence 6 — La marque et l'appel (29,90 → 39 s) ─────────────── */
const Marque: React.FC = () => {
  const { u, portrait } = useFormat();
  const t = useSecondes();
  const souligne = progression(t, 0.7, 0.6);
  return (
    <AbsoluteFill>
      <Fond couleurs={["#EADCC4", CHARTE.papier]} vignette={0.12} grain={0.05} />
      <Camera derive={0.008}>
        <Au y={-150 * u}>
          <Arrivee a={0.2} depuis={1.8} flou={20} duree={0.6}>
            <div style={{ fontFamily: P.titre, fontWeight: 800, fontSize: 230 * u, color: CHARTE.encreSombre, letterSpacing: "-0.03em" }}>Yéla</div>
          </Arrivee>
        </Au>
        <Au y={-20 * u}>
          <Fil longueur={460 * u} avancement={souligne} epaisseur={10 * u} />
        </Au>
        <Au y={90 * u}>
          <div style={{ width: portrait ? 900 * u : 1400 * u }}>
            <TexteCinetique texte="Le karité qui dit d'où il vient." a={1.35} intervalle={0.2} taille={60 * u} couleur={CHARTE.encreSombre} police={P.titre} poids={600} />
          </div>
        </Au>
        <Au y={260 * u}>
          <Arrivee a={3.5} depuis={1.4} flou={12}>
            <div style={{ fontFamily: P.texte, fontWeight: 600, fontSize: 40 * u, color: CHARTE.papier, background: CHARTE.encreSombre, padding: `${18 * u}px ${44 * u}px`, borderRadius: 999 }}>
              Découvre la boutique Yéla
            </div>
          </Arrivee>
        </Au>
      </Camera>
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 34 * u }}>
        <div style={{ fontFamily: P.texte, fontSize: 20 * u, color: "rgba(42,26,16,0.55)" }}>Marque fictive — film d'exemple de l'atelier Access Academy</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ─────────────── Le film ─────────────── */
const YelaExemple: React.FC<ProprietesFilm> = () => (
  <AbsoluteFill style={{ background: CHARTE.nuit }}>
    <Plan de={0} a={7.55} nom="1 · Accroche datée"><Accroche /></Plan>
    <Plan de={7.55} a={10.3} nom="2 · Gag muet"><GagMuet /></Plan>
    <Plan de={10.3} a={17.85} nom="3 · Diagnostic"><Diagnostic /></Plan>
    <Plan de={17.85} a={21.2} nom="4 · Bascule au noir"><Bascule /></Plan>
    <Plan de={21.2} a={29.9} nom="5 · Solution"><Solution /></Plan>
    <Plan de={29.9} a={39} nom="6 · Marque et appel"><Marque /></Plan>

    <SousTitres minutage={minutage} motsCles={["karité", "Yéla", "savoir", "Korhogo"]} police={P.texte} couleur={CHARTE.encre} couleurAccent={CHARTE.accent} bandeau="rgba(28,17,10,0.72)"
      // Pas de sous-titres quand l'écran dit déjà la phrase (bascule, signature, appel).
      masquer={[[17.85, 21.2], [31.2, 39]]}
    />

    {/* Le son : la voix (si vous en déposez une), la musique sous licence, les bruitages. */}
    <Voix fichier="yela-exemple/voix-montee.wav" />
    <Musique fichier="yela-exemple/musique/tension.mp3" de={0} a={18.2} volume={0.45} minutage={minutage} />
    <Musique fichier="yela-exemple/musique/elan.mp3" de={21.2} volume={0.5} minutage={minutage} />
    <Bruitage fichier="yela-exemple/sons/montee.wav" a={15.0} volume={0.5} />
    <Bruitage fichier="yela-exemple/sons/impact.wav" a={17.85} volume={0.7} />
    <Bruitage fichier="yela-exemple/sons/whoosh.wav" a={21.0} volume={0.5} />
  </AbsoluteFill>
);

export const film: DefinitionFilm = {
  id: "yela-exemple",
  titre: "Yéla — le karité qui dit d'où il vient (marque fictive)",
  duree: minutage.duree,
  fps: 30,
  formats: ["16x9", "9x16"],
  Composant: YelaExemple,
  imagesFigees: IMAGES_FIGEES,
};
