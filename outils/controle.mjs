// npm run controle -- <nom>            contrôle les rendus finaux du film (rendus/<nom>-*.mp4)
// npm run controle -- rendus/film.mp4  contrôle un fichier précis
// Vérifie ce que l'œil ne voit pas : durée, image, niveau sonore, passages
// noirs ou figés, et fabrique une planche (une image toutes les 0,5 s) pour
// relire tout le film d'un coup d'œil.
import { existsSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";
import { FILMS, RACINE, RENDUS, duree, exigerFfmpeg, lancer, lireArguments, lireJson, s2, stop } from "./commun.mjs";

const { positionnels, options } = lireArguments();
exigerFfmpeg();
const cible = positionnels[0];
if (!cible) stop("Indiquez un film (npm run controle -- mon-film) ou un fichier (npm run controle -- rendus/mon-film-16x9.mp4).");

let fichiers = [];
let attendu = options.attendu ? Number(options.attendu) : null;
let sansVoix = false;
if (/\.(mp4|mov|webm)$/i.test(cible)) {
  const f = existsSync(cible) ? cible : join(RACINE, cible);
  if (!existsSync(f)) stop(`Fichier introuvable : ${cible}`);
  fichiers = [f];
} else {
  fichiers = existsSync(RENDUS) ? readdirSync(RENDUS).filter((f) => f.startsWith(`${cible}-`) && f.endsWith(".mp4") && !f.includes("brouillon")).map((f) => join(RENDUS, f)) : [];
  if (!fichiers.length) stop(`Aucun rendu final pour « ${cible} » dans rendus/. Lancez d'abord : npm run rendu -- ${cible}`);
  const min = join(FILMS, cible, "minutage.json");
  if (attendu === null && existsSync(min)) attendu = lireJson(min).duree;
  sansVoix = !existsSync(join(FILMS, cible, "voix-montee.wav"));
}

let problemes = 0;
const ok = (t) => console.log(`  ✔ ${t}`);
const info = (t) => console.log(`  • ${t}`);
const alerte = (t) => {
  problemes++;
  console.log(`  ✖ ${t}`);
};

for (const f of fichiers) {
  console.log(`\n■ ${basename(f)}`);
  const flux = JSON.parse(lancer("ffprobe", ["-v", "error", "-show_entries", "stream=codec_type,codec_name,width,height,r_frame_rate,duration", "-of", "json", f]).sortie).streams;
  const video = flux.find((s) => s.codec_type === "video");
  const audio = flux.find((s) => s.codec_type === "audio");
  // La durée de l'image : celle du conteneur ajoute le remplissage du son AAC.
  const d = parseFloat(video?.duration) || duree(f);
  info(`Image : ${video.width} × ${video.height}, ${video.codec_name}, ${video.r_frame_rate.replace("/1", "")} i/s — durée ${s2(d)} s`);
  if (attendu !== null) (Math.abs(d - attendu) <= 0.1 ? ok : alerte)(`Durée ${s2(d)} s pour ${s2(attendu)} s attendues (montage de la voix)`);

  if (!audio) alerte("Aucune piste son : la voix montée manque.");
  else if (sansVoix) info("Pas de voix montée dans ce film : le niveau sonore n'est pas mesuré.");
  else {
    const r = lancer("ffmpeg", ["-hide_banner", "-nostats", "-i", f, "-map", "0:a", "-af", "ebur128=peak=true", "-f", "null", "-"]);
    const I = parseFloat((r.erreurs.match(/I:\s+(-?[\d.]+) LUFS/g) || []).pop()?.match(/-?[\d.]+/)?.[0]);
    const TP = parseFloat((r.erreurs.match(/Peak:\s+(-?[\d.]+) dBFS/g) || []).pop()?.match(/-?[\d.]+/)?.[0]);
    if (Number.isFinite(I)) (I >= -17.5 && I <= -14.5 ? ok : alerte)(`Niveau sonore ${s2(I)} LUFS (cible -16)`);
    if (Number.isFinite(TP)) (TP <= -1 ? ok : alerte)(`Crête ${s2(TP)} dBTP (au plus -1,5)`);
  }

  const noirs = [...lancer("ffmpeg", ["-hide_banner", "-nostats", "-i", f, "-vf", "blackdetect=d=0.3:pix_th=0.08", "-an", "-f", "null", "-"]).erreurs.matchAll(/black_start:([\d.]+) black_end:([\d.]+)/g)];
  if (noirs.length) noirs.forEach((m) => info(`Passage noir ${s2(+m[1])} → ${s2(+m[2])} s : voulu (bascule au noir) ? Sinon, à corriger.`));
  else ok("Aucun passage noir");

  const figes = [...lancer("ffmpeg", ["-hide_banner", "-nostats", "-i", f, "-vf", "freezedetect=n=0.002:d=1.2", "-an", "-f", "null", "-"]).erreurs.matchAll(/freeze_start: ([\d.]+)[\s\S]*?freeze_end: ([\d.]+)/g)];
  if (figes.length) figes.forEach((m) => alerte(`Image figée ${s2(+m[1])} → ${s2(+m[2])} s : la caméra ne doit jamais s'arrêter (sauf plan final voulu).`));
  else ok("Aucune image figée de plus de 1,2 s");

  const planche = f.replace(/\.mp4$/i, "-planche.jpg");
  const lignes = Math.ceil((d * 2) / 8);
  const p = lancer("ffmpeg", ["-hide_banner", "-y", "-i", f, "-vf", `fps=2,scale=320:-1,tile=8x${lignes}:padding=4:color=black`, "-frames:v", "1", "-q:v", "4", planche]);
  if (p.code === 0) info(`Planche (une image toutes les 0,5 s) : ${planche.replace(RACINE, ".")}`);
}

console.log(problemes ? `\n${problemes} point(s) à reprendre avant de livrer.\n` : "\nTout est conforme. Regardez encore le film en entier sur un téléphone, avec et sans le son.\n");
process.exit(problemes ? 1 : 0);
