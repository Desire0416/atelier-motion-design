// Film d'exemple de l'atelier : « Yéla », marque de soins au karité ENTIÈREMENT
// FICTIVE (fil rouge de la formation Access Academy). 39 s, 16:9 et 9:16.
// Il suit STORYBOARD.md plan par plan. Tous les temps viennent de la voix :
// chaque repère est l'instant où un mot est prononcé (minutage.json), si bien
// qu'une nouvelle prise, une fois montée et minutée, recale le film toute seule.
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
  repere,
  motsDe,
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

/* ─────────────── Les repères de la voix (secondes, temps absolu) ─────────────── */
const r = (texte: string, apres = 0) => repere(minutage, texte, { apres });
const rFin = (texte: string, apres = 0) => repere(minutage, texte, { apres, fin: true });
/** Instants d'arrivée de chaque mot d'une phrase, relatifs au début d'un plan (un peu avant le mot). */
const instants = (texte: string, apres: number, debutPlan: number) => motsDe(minutage, texte, apres).map((m) => m.debut - debutPlan - 0.08);

const T = (() => {
  const lundi = r("Lundi");
  const mardi = r("Mardi");
  const mercredi = r("Mercredi");
  const personne = r("personne");
  const gag = rFin("sait", personne) + 0.1;
  const diagnostic = r("Le problème", gag) - 0.25;
  const probleme = r("Le problème", gag);
  const pas = r("pas le karité", diagnostic);
  const tout = r("tout ce qu'on", pas);
  const dou = r("D'où vient la noix", tout);
  const qui = r("Qui", dou);
  const quand = r("quand", qui);
  const il = r("Il est temps", quand);
  const bascule = il - 0.45;
  const chez = r("Chez", il);
  const yela = r("Yéla", chez);
  const korhogo = r("Korhogo", chez);
  const mains = r("mains", korhogo);
  const date = r("date", mains);
  const tu = r("Tu", date);
  const sais = r("sais", tu);
  const signature = r("Yéla", sais);
  const marque = signature - 0.55;
  const leKarite = r("le karité qui dit", signature);
  const decouvre = r("Découvre", leKarite);
  return { lundi, mardi, dou1: r("d'où", mardi), mercredi, personne, gag, diagnostic, probleme, pas, tout, dou, qui, quand, bascule, chez, yela, korhogo, mains, date, tu, sais, marque, signature, leKarite, decouvre };
})();

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
  const doute = progression(t, T.personne, 0.6);
  return (
    <AbsoluteFill>
      <Fond couleurs={[CHARTE.nuit, CHARTE.brun]} />
      <Camera derive={0.015} mouvements={[{ a: T.mardi - 0.1, duree: 0.7, x: 60 * u, echelle: 1.12 }, { a: T.mercredi - 0.1, duree: 0.6, x: -40 * u, echelle: 1.28 }]}>
        {carte("LUNDI", T.lundi - 0.05, portrait ? -170 : -560, portrait ? -560 : -260)}
        {carte("MARDI", T.mardi - 0.05, portrait ? 170 : 440, portrait ? -420 : -260)}
        {/* Jamais sous les sous-titres : en bas à gauche en 16:9, entre le pot et les sous-titres en 9:16 (hors de la zone des boutons des réseaux). */}
        {carte("MERCREDI", T.mercredi - 0.05, portrait ? 0 : -460, portrait ? 300 : 210)}
        <Au>
          <Arrivee a={T.lundi + 1.1} depuis={1.7} flou={20} duree={0.7}>
            <Pot taille={360 * u}>
              <EtiquetteVide u={u} />
            </Pot>
          </Arrivee>
        </Au>
        <Au x={250 * u} y={-200 * u}>
          <Arrivee a={T.dou1 - 0.05} depuis={2.2} flou={24}>
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
  const d = (abs: number) => abs - T.diagnostic; // temps du plan
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
          { a: d(T.dou) - 0.15, duree: 0.6, x: s[0].x, y: s[0].y, echelle: portrait ? 1.05 : 1.25 },
          { a: d(T.qui) - 0.1, duree: 0.5, x: s[1].x, y: s[1].y },
          { a: d(T.quand) - 0.1, duree: 0.45, x: s[2].x, y: s[2].y },
        ]}
      >
        <Au y={portrait ? -900 * u : -600 * u}>
          <Sortie a={d(T.dou) - 0.3}>
            {/* « Le problème » : l'écran parle dès que la voix commence (pas d'image vide). */}
            <TexteCinetique texte="LE PROBLÈME," a={0} instants={instants("le problème", T.probleme, T.diagnostic)} taille={52 * u} couleur={CHARTE.accentClair} police={P.titre} />
            <div style={{ height: 22 * u }} />
            <TexteCinetique texte="PAS LE KARITÉ." a={0} instants={instants("pas le karité", T.pas, T.diagnostic)} taille={120 * u} couleur={CHARTE.encre} police={P.titre} accents={["KARITÉ."]} couleurAccent={CHARTE.accent} />
            <div style={{ height: 40 * u }} />
            <TexteCinetique texte="TOUT CE QU'ON NE TE DIT PAS." a={0} instants={instants("tout ce qu'on ne te dit pas", T.tout, T.diagnostic)} taille={72 * u} couleur={CHARTE.accentClair} police={P.titre} style={{ maxWidth: (portrait ? 900 : 1300) * u }} />
          </Sortie>
        </Au>
        {douleur(0, "D'OÙ ?", d(T.dou) - 0.05, <div style={{ width: 90 * u, height: 110 * u, borderRadius: "50% 50% 46% 46%", background: CHARTE.accent }} />)}
        {douleur(1, "QUI ?", d(T.qui) - 0.05, <Silhouette taille={110 * u} couleur={CHARTE.encre} />)}
        {douleur(2, "QUAND ?", d(T.quand) - 0.05, <div style={{ width: 100 * u, height: 100 * u, borderRadius: 14 * u, border: `${6 * u}px solid ${CHARTE.encre}`, borderTopWidth: 22 * u }} />)}
      </Camera>
    </AbsoluteFill>
  );
};

/* ─────────────── Séquence 4 — Bascule au noir (17,85 → 21,20 s) ─────────────── */
const Bascule: React.FC = () => {
  const { u } = useFormat();
  const t = useSecondes();
  const b = (abs: number) => abs - T.bascule; // temps du plan
  const point = progression(t, b(T.chez) - 0.8, 0.5);
  const trait = progression(t, b(T.chez) - 0.3, 0.3);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* Même au noir, la phrase avance lentement vers nous. */}
      <Camera derive={0.045}>
        <Au y={-40 * u}>
          <Arrivee a={0.45} depuis={1.15} flou={8} duree={0.6}>
            <Sortie a={b(T.chez) - 1.1} vers={1.1} flou={6}>
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
  const s = (abs: number) => abs - T.chez; // temps du plan
  const bord = progression(t, 0.1, 0.9);
  const couvercle = progression(t, s(T.tu) - 0.05, 0.6);
  const lueur = progression(t, s(T.sais) - 0.1, 0.6);
  return (
    <AbsoluteFill>
      <Fond couleurs={["#EADCC4", CHARTE.papier]} vignette={0.15} grain={0.05} />
      <Camera
        depart={{ echelle: portrait ? 1.6 : 1.7, y: -40 * u }}
        derive={0.012}
        mouvements={[
          { a: s(T.korhogo) - 0.1, duree: 0.5, y: -10 * u, echelle: portrait ? 1.75 : 1.9 },
          { a: s(T.mains) - 0.1, duree: 0.45, y: 30 * u },
          { a: s(T.date) - 0.1, duree: 0.45, y: 70 * u },
          { a: s(T.tu) - 0.2, duree: 0.8, y: 0, echelle: 1.05 },
        ]}
      >
        <Au>
          <div style={{ position: "absolute", inset: -60 * u, borderRadius: "50%", background: `radial-gradient(circle, rgba(231,194,125,${0.55 * lueur}) 0%, transparent 70%)` }} />
          <Pot taille={360 * u} couvercle={couvercle}>
            <div style={{ position: "absolute", inset: 10 * u, border: `${3 * u}px solid ${CHARTE.accent}`, borderRadius: 10 * u, clipPath: `inset(0 ${100 - bord * 100}% 0 0)` }} />
            {ligne("YÉLA", s(T.yela) - 0.05, 40)}
            {ligne("KORHOGO", s(T.korhogo) - 0.05, 26)}
            {ligne("PRÉPARÉ À LA MAIN", s(T.mains) - 0.05, 18)}
            {ligne("FABRIQUÉ LE 12.10.2026", s(T.date) - 0.05, 16)}
          </Pot>
        </Au>
      </Camera>
      <Bruitage fichier="yela-exemple/sons/clic.wav" a={s(T.korhogo)} volume={0.4} />
      <Bruitage fichier="yela-exemple/sons/clic.wav" a={s(T.mains)} volume={0.4} />
      <Bruitage fichier="yela-exemple/sons/clic.wav" a={s(T.date)} volume={0.4} />
      <Bruitage fichier="yela-exemple/sons/notification.wav" a={s(T.sais)} volume={0.55} />
    </AbsoluteFill>
  );
};

/* ─────────────── Séquence 6 — La marque et l'appel (29,90 → 39 s) ─────────────── */
const Marque: React.FC = () => {
  const { u, portrait } = useFormat();
  const t = useSecondes();
  const m = (abs: number) => abs - T.marque; // temps du plan
  const souligne = progression(t, m(T.signature) + 0.15, 0.6);
  return (
    <AbsoluteFill>
      <Fond couleurs={["#EADCC4", CHARTE.papier]} vignette={0.12} grain={0.05} />
      <Camera derive={0.008}>
        <Au y={-150 * u}>
          <Arrivee a={m(T.signature) - 0.35} depuis={1.8} flou={20} duree={0.6}>
            <div style={{ fontFamily: P.titre, fontWeight: 800, fontSize: 230 * u, color: CHARTE.encreSombre, letterSpacing: "-0.03em" }}>Yéla</div>
          </Arrivee>
        </Au>
        <Au y={-20 * u}>
          <Fil longueur={460 * u} avancement={souligne} epaisseur={10 * u} />
        </Au>
        <Au y={90 * u}>
          <div style={{ width: portrait ? 900 * u : 1400 * u }}>
            <TexteCinetique texte="Le karité qui dit d'où il vient." a={0} instants={instants("le karité qui dit d'où il vient", T.leKarite, T.marque)} taille={60 * u} couleur={CHARTE.encreSombre} police={P.titre} poids={600} />
          </div>
        </Au>
        <Au y={260 * u}>
          <Arrivee a={m(T.decouvre) - 0.05} depuis={1.4} flou={12}>
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
    <Plan de={0} a={T.gag} nom="1 · Accroche datée"><Accroche /></Plan>
    <Plan de={T.gag} a={T.diagnostic} nom="2 · Gag muet"><GagMuet /></Plan>
    <Plan de={T.diagnostic} a={T.bascule} nom="3 · Diagnostic"><Diagnostic /></Plan>
    <Plan de={T.bascule} a={T.chez} nom="4 · Bascule au noir"><Bascule /></Plan>
    <Plan de={T.chez} a={T.marque} nom="5 · Solution"><Solution /></Plan>
    <Plan de={T.marque} a={minutage.duree} nom="6 · Marque et appel"><Marque /></Plan>

    <SousTitres minutage={minutage} motsCles={["karité", "Yéla", "savoir", "Korhogo"]} police={P.texte} couleur={CHARTE.encre} couleurAccent={CHARTE.accent} bandeau="rgba(28,17,10,0.72)"
      // Pas de sous-titres quand l'écran dit déjà la phrase (bascule, signature, appel).
      masquer={[[T.bascule, T.chez], [T.leKarite - 0.2, minutage.duree]]}
    />

    {/* Le son : la voix (si vous en déposez une), la musique sous licence, les bruitages. */}
    <Voix fichier="yela-exemple/voix-montee.wav" />
    {/* Musique générée sur les repères du film (tension, bascule, élan), baissée sous la voix. */}
    <Musique fichier="yela-exemple/musique/bande.wav" volume={0.5} minutage={minutage} />
    <Bruitage fichier="yela-exemple/sons/montee.wav" a={T.bascule - 2.85} volume={0.5} />
    <Bruitage fichier="yela-exemple/sons/impact.wav" a={T.bascule} volume={0.45} />
    <Bruitage fichier="yela-exemple/sons/whoosh.wav" a={T.chez - 0.2} volume={0.5} />
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
