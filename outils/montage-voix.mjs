// npm run montage -- <nom>
// Monte la voix d'après films/<nom>/montage.json : insère des silences aux
// points de coupe (gag muet, bascule au noir, respiration avant la fin),
// ajoute la traîne de fin, avec un fondu de 5 ms à chaque raccord (aucun clic).
// Écrit films/<nom>/voix-montee.wav : la voix de référence du film.
//
// montage.json :
// {
//   "source": "voix.mp3",
//   "avant": 0.3,                                   (silence avant la première phrase)
//   "coupes": [ { "a": 7.42, "ajouter": 2.6, "pourquoi": "gag muet" } ],
//   "traine": 4.0,                                  (silence de fin pour le plan final)
//   "fondu_ms": 5
// }
import { join } from "node:path";
import { existsSync } from "node:fs";
import { dossierFilm, duree, exigerFfmpeg, lancer, lireArguments, lireJson, s2, stop } from "./commun.mjs";

const { positionnels } = lireArguments();
const nom = positionnels[0];
const dossier = dossierFilm(nom);
exigerFfmpeg();

const fichierMontage = join(dossier, "montage.json");
if (!existsSync(fichierMontage)) stop(`films/${nom}/montage.json est introuvable (il est créé avec le film).`);
const m = lireJson(fichierMontage);
const source = join(dossier, m.source ?? "voix.mp3");
if (!existsSync(source)) stop(`La voix ${m.source ?? "voix.mp3"} est introuvable dans films/${nom}/.`);

const total = duree(source);
const fondu = (m.fondu_ms ?? 5) / 1000;
const coupes = [...(m.coupes ?? [])].sort((a, b) => a.a - b.a);
for (const c of coupes) {
  if (!(c.a > 0 && c.a < total)) stop(`Coupe à ${c.a} s hors de la voix (durée ${s2(total)} s).`);
  if (!(c.ajouter > 0 && c.ajouter <= 10)) stop(`Silence ajouté invalide à ${c.a} s : ${c.ajouter} (entre 0 et 10 s).`);
}

// Morceaux de voix entre les coupes, et silences intercalés.
const bornes = [0, ...coupes.map((c) => c.a), total];
const filtres = ["[0:a]aresample=48000,aformat=sample_fmts=fltp:channel_layouts=stereo,asplit=" + (bornes.length - 1) + bornes.slice(1).map((_, i) => `[v${i}]`).join("") + ";"];
const chaine = [];
const silence = (d, id) => {
  filtres.push(`anullsrc=r=48000:cl=stereo,atrim=duration=${d.toFixed(3)}[${id}];`);
  chaine.push(`[${id}]`);
};
if (m.avant > 0) silence(m.avant, "zavant");
for (let i = 0; i < bornes.length - 1; i++) {
  const a = bornes[i], b = bornes[i + 1], d = b - a;
  filtres.push(
    `[v${i}]atrim=start=${a.toFixed(4)}:end=${b.toFixed(4)},asetpts=PTS-STARTPTS,afade=t=in:st=0:d=${fondu},afade=t=out:st=${Math.max(0, d - fondu).toFixed(4)}:d=${fondu}[p${i}];`,
  );
  chaine.push(`[p${i}]`);
  if (i < coupes.length) silence(coupes[i].ajouter, `z${i}`);
}
if (m.traine > 0) silence(m.traine, "zfin");
filtres.push(`${chaine.join("")}concat=n=${chaine.length}:v=0:a=1[sortie]`);

const sortie = join(dossier, "voix-montee.wav");
const r = lancer("ffmpeg", ["-hide_banner", "-y", "-i", source, "-filter_complex", filtres.join(""), "-map", "[sortie]", "-c:a", "pcm_s16le", sortie]);
if (r.code !== 0) stop(`Le montage a échoué :\n${r.erreurs.split("\n").slice(-6).join("\n")}`);

const nouvelle = duree(sortie);
console.log(`\n✔ Voix montée : films/${nom}/voix-montee.wav — ${s2(nouvelle)} s (voix brute : ${s2(total)} s)\n`);
let decalage = m.avant ?? 0;
console.log(`  Avant la première phrase : ${s2(decalage)} s de silence`);
for (const c of coupes) {
  console.log(`  À ${s2(c.a)} s de la voix brute (${s2(c.a + decalage)} s dans le montage) : +${s2(c.ajouter)} s${c.pourquoi ? ` — ${c.pourquoi}` : ""}`);
  decalage += c.ajouter;
}
console.log(`  Traîne de fin : ${s2(m.traine ?? 0)} s`);
console.log(`
Écoutez le montage (gag muet, bascule) avant d'aller plus loin.
Étape suivante : npm run minutage -- ${nom}   (minutage mot à mot de voix-montee.wav)
La durée du film (${s2(nouvelle)} s) sera reprise par le minutage.
`);
