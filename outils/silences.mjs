// npm run silences -- <nom> [--fichier voix.mp3] [--seuil -40] [--min 0.12]
// Repère les phrases et les silences de la voix BRUTE (avant montage) et
// propose un point de coupe au milieu de chaque silence. C'est là, et
// seulement là, que l'on coupe pour faire de la place au gag muet et à la
// bascule (npm run montage). Écrit films/<nom>/silences.json.
import { join } from "node:path";
import { writeFileSync } from "node:fs";
import { dossierFilm, duree, exigerFfmpeg, lancer, lireArguments, premierExistant, s2, stop } from "./commun.mjs";

const { positionnels, options } = lireArguments();
const nom = positionnels[0];
const dossier = dossierFilm(nom);
exigerFfmpeg();

const fichier = premierExistant(
  typeof options.fichier === "string" ? join(dossier, options.fichier) : null,
  join(dossier, "voix.mp3"),
  join(dossier, "voix.wav"),
  join(dossier, "voix.m4a"),
);
if (!fichier) stop(`Aucune voix dans films/${nom}/ : déposez la prise choisie sous le nom voix.mp3 (ou voix.wav).`);

const seuil = Number(options.seuil ?? -40);
const min = Number(options.min ?? 0.12);
const total = duree(fichier);
const r = lancer("ffmpeg", ["-hide_banner", "-nostats", "-i", fichier, "-af", `silencedetect=noise=${seuil}dB:d=${min}`, "-f", "null", "-"]);
const debuts = [...r.erreurs.matchAll(/silence_start: (-?[\d.]+)/g)].map((m) => Math.max(0, parseFloat(m[1])));
const fins = [...r.erreurs.matchAll(/silence_end: ([\d.]+)/g)].map((m) => parseFloat(m[1]));
const silences = debuts.map((d, i) => ({ debut: d, fin: fins[i] ?? total })).filter((s) => s.fin > s.debut);

// Les phrases sont les intervalles entre deux silences.
const phrases = [];
let t = silences[0]?.debut === 0 ? silences[0].fin : 0;
for (const s of silences) {
  if (s.debut > t + 0.05) phrases.push({ debut: t, fin: s.debut });
  t = Math.max(t, s.fin);
}
if (total > t + 0.05) phrases.push({ debut: t, fin: total });

const resultat = {
  fichier: fichier.split(/[\\/]/).pop(),
  duree: +total.toFixed(3),
  seuil_dB: seuil,
  phrases: phrases.map((p, i) => {
    const apres = silences.find((s) => Math.abs(s.debut - p.fin) < 0.02);
    return {
      n: i + 1,
      debut: +p.debut.toFixed(3),
      fin: +p.fin.toFixed(3),
      silence_apres: apres ? +(apres.fin - apres.debut).toFixed(3) : 0,
      coupe: apres ? +((apres.debut + apres.fin) / 2).toFixed(3) : null,
    };
  }),
};
writeFileSync(join(dossier, "silences.json"), JSON.stringify(resultat, null, 2) + "\n");

console.log(`\nVoix : ${resultat.fichier} — ${s2(total)} s, ${phrases.length} phrases (seuil ${seuil} dB)\n`);
console.log(" n°   début →  fin     silence après   point de coupe");
for (const p of resultat.phrases) {
  console.log(
    ` ${String(p.n).padStart(2)}  ${s2(p.debut).padStart(6)} → ${s2(p.fin).padEnd(6)}   ${p.silence_apres ? s2(p.silence_apres).padStart(5) + " s" : "   — "}         ${p.coupe !== null ? s2(p.coupe) + " s" : "—"}`,
  );
}
console.log(`
Écrit : films/${nom}/silences.json
Étape suivante : notez dans films/${nom}/montage.json les coupes où insérer le gag muet (2 à 3 s)
et la bascule (environ 1,5 s), en reprenant les « points de coupe » ci-dessus, puis : npm run montage -- ${nom}
`);
