// npm run bruitages -- [<nom>]
// Fabrique une petite bibliothèque de bruitages avec ffmpeg (aucun fichier
// sous licence : ils sont générés, vous en êtes libre). Sans nom de film, ils
// vont dans films/_commun/sons/ ; avec un nom, dans films/<nom>/sons/.
//   whoosh       souffle de passage (mouvement de caméra, raccord)
//   pop          apparition légère
//   clic         une information qui se pose
//   impact       coup sourd (la bascule au noir)
//   montee       montée de 3 s (avant la bascule)
//   notification signature à deux notes (le moment clé, UNE fois par film)
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { FILMS, dossierFilm, exigerFfmpeg, lancer, lireArguments, stop } from "./commun.mjs";

const { positionnels } = lireArguments();
exigerFfmpeg();
const dossier = positionnels[0] ? join(dossierFilm(positionnels[0]), "sons") : join(FILMS, "_commun", "sons");
mkdirSync(dossier, { recursive: true });

const STEREO = "aformat=sample_fmts=s16:sample_rates=48000:channel_layouts=stereo";
const SONS = {
  whoosh: ["-filter_complex", `anoisesrc=d=0.8:c=pink:r=48000:a=0.8,bandpass=f=900:width_type=o:w=2.4,afade=t=in:st=0:d=0.45:curve=exp,afade=t=out:st=0.45:d=0.35:curve=exp,volume=2.2,${STEREO}`],
  pop: ["-filter_complex", `aevalsrc='0.8*sin(2*PI*(620*t-1600*t*t))*exp(-26*t)':d=0.16:s=48000,${STEREO}`],
  clic: ["-filter_complex", `aevalsrc='0.7*sin(2*PI*2300*t)*exp(-130*t)':d=0.06:s=48000,${STEREO}`],
  impact: ["-filter_complex", `aevalsrc='0.9*sin(2*PI*52*t)*exp(-3.5*t)+0.35*sin(2*PI*104*t)*exp(-7*t)':d=1.4:s=48000,lowpass=f=400,${STEREO}`],
  montee: ["-filter_complex", `aevalsrc='0.22*sin(2*PI*(180*t+110*t*t))*(t/3)':d=3:s=48000[a];anoisesrc=d=3:c=white:r=48000:a=0.25,highpass=f=1800,volume='t/3':eval=frame[b];[a][b]amix=inputs=2:normalize=0,afade=t=out:st=2.92:d=0.08,${STEREO}`],
  notification: ["-filter_complex", `aevalsrc='0.55*sin(2*PI*880*t)*exp(-7*t)*lt(t,0.16)+0.55*sin(2*PI*1320*(t-0.14))*exp(-6*(t-0.14))*gte(t,0.14)':d=0.9:s=48000,${STEREO}`],
};

for (const [nom, args] of Object.entries(SONS)) {
  const sortie = join(dossier, `${nom}.wav`);
  const r = lancer("ffmpeg", ["-hide_banner", "-y", ...args, "-c:a", "pcm_s16le", sortie]);
  if (r.code !== 0) stop(`Échec pour ${nom} :\n${r.erreurs.split("\n").slice(-4).join("\n")}`);
  console.log(`✔ ${sortie.replace(FILMS, "films")}`);
}
console.log("\nCalez chaque bruitage sur un geste de l'image (<Bruitage fichier=... a={...} />) : l'image ne bouge jamais pour le son.");
