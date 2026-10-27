// npm run rendu -- <nom> [--formats 16x9,9x16] [--brouillon]
// Rend le film dans rendus/ :
//   --brouillon  : demi-résolution, rapide, pour vérifier le rythme et les raccords ;
//   sinon        : pleine qualité, puis son normalisé à -16 LUFS (crête -1,5 dBTP)
//                  et fichier optimisé pour la lecture en ligne (faststart).
import { existsSync, mkdirSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";
import { RENDUS, dossierFilm, exigerFfmpeg, lancer, lireArguments, remotion, stop } from "./commun.mjs";

const { positionnels, options } = lireArguments();
const nom = positionnels[0];
dossierFilm(nom);
exigerFfmpeg();
mkdirSync(RENDUS, { recursive: true });
const formats = String(options.formats ?? "16x9,9x16").split(",").map((f) => f.trim()).filter(Boolean);
const brouillon = !!options.brouillon;
const mo = (f) => `${(statSync(f).size / 1024 / 1024).toFixed(1)} Mo`;

for (const format of formats) {
  const id = `${nom}-${format}`;
  const final = join(RENDUS, `${id}${brouillon ? "-brouillon" : ""}.mp4`);
  const brut = brouillon ? final : join(RENDUS, `.brut-${id}.mp4`);
  console.log(`\n▶ Rendu de ${id}${brouillon ? " (brouillon)" : ""}…`);
  const args = ["render", "src/index.ts", id, brut, "--log=error"];
  if (brouillon) args.push("--scale=0.5", "--crf=28", "--image-format=jpeg");
  else args.push("--crf=14", "--image-format=png", "--color-space=bt709");
  const r = remotion(args, { silencieux: false });
  if (r.code !== 0) stop(`Le rendu de ${id} a échoué. Si la composition n'existe pas, vérifiez les formats déclarés dans films/${nom}/Film.tsx.`);
  if (brouillon) {
    console.log(`✔ ${final} (${mo(final)})`);
    continue;
  }

  // Son : normalisation en deux passes (mesure, puis correction linéaire).
  const sonde = lancer("ffprobe", ["-v", "error", "-select_streams", "a", "-show_entries", "stream=index", "-of", "csv=p=0", brut]);
  if (sonde.sortie.trim()) {
    const mesure = lancer("ffmpeg", ["-hide_banner", "-nostats", "-i", brut, "-af", "loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"]);
    const json = mesure.erreurs.slice(mesure.erreurs.lastIndexOf("{"), mesure.erreurs.lastIndexOf("}") + 1);
    let m;
    try {
      m = JSON.parse(json);
    } catch {
      stop("Mesure du niveau sonore impossible.");
    }
    const filtre = `loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true,aresample=48000`;
    const n = lancer("ffmpeg", ["-hide_banner", "-y", "-i", brut, "-af", filtre, "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", final]);
    if (n.code !== 0) stop(`Normalisation du son impossible :\n${n.erreurs.split("\n").slice(-5).join("\n")}`);
  } else {
    const c = lancer("ffmpeg", ["-hide_banner", "-y", "-i", brut, "-c", "copy", "-movflags", "+faststart", final]);
    if (c.code !== 0) stop("Finalisation du fichier impossible.");
    console.log("  (film sans son : ajoutez la voix montée avant le rendu final)");
  }
  if (existsSync(brut)) rmSync(brut);
  console.log(`✔ ${final} (${mo(final)})`);
}
console.log(`\nÉtape suivante : npm run controle -- ${nom}`);
