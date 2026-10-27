// Images figées et images clés, pour regarder le film avant de le rendre.
//   npm run images -- <nom> --directions          les images figées des directions (Directions.tsx)
//   npm run images -- <nom> 2.5 7.8 12            le film (16:9) à ces instants, en secondes
//   npm run images -- <nom> --format 9x16 2.5     idem en vertical
// Les PNG vont dans films/<nom>/images/, avec une planche qui les réunit.
import { existsSync, mkdirSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { RACINE, dossierFilm, exigerFfmpeg, lancer, lireArguments, remotion, stop } from "./commun.mjs";

const { positionnels, options } = lireArguments();
const nom = positionnels[0];
const dossier = dossierFilm(nom);
const sortie = join(dossier, "images");
mkdirSync(sortie, { recursive: true });

const fichiers = [];
if (options.directions) {
  const src = join(dossier, "Directions.tsx");
  if (!existsSync(src)) stop(`films/${nom}/Directions.tsx est introuvable.`);
  const noms = [...readFileSync(src, "utf8").matchAll(/\{\s*nom:\s*"([^"]+)"/g)].map((m) => m[1]);
  if (!noms.length) stop("Aucune image figée déclarée dans Directions.tsx (IMAGES_FIGEES).");
  noms.forEach((n, i) => {
    const png = join(sortie, `direction-${n}.png`);
    console.log(`… ${n}`);
    const r = remotion(["still", "src/index.ts", `${nom}-images`, png, `--frame=${i}`]);
    if (r.code !== 0) stop(`Rendu de l'image ${n} impossible :\n${(r.erreurs || r.sortie).split("\n").slice(-8).join("\n")}`);
    fichiers.push(png);
  });
} else {
  const instants = positionnels.slice(1).map(Number).filter((n) => Number.isFinite(n) && n >= 0);
  if (!instants.length) stop("Indiquez des instants en secondes (ex. npm run images -- mon-film 2.5 8) ou --directions.");
  const format = String(options.format ?? "16x9");
  const fps = Number(options.fps ?? 30);
  for (const t of instants) {
    const png = join(sortie, `${format}-${t.toFixed(2).replace(".", "_")}s.png`);
    console.log(`… ${t} s`);
    const r = remotion(["still", "src/index.ts", `${nom}-${format}`, png, `--frame=${Math.round(t * fps)}`]);
    if (r.code !== 0) stop(`Rendu à ${t} s impossible :\n${(r.erreurs || r.sortie).split("\n").slice(-8).join("\n")}`);
    fichiers.push(png);
  }
}

// Planche : toutes les images sur une seule page, pour les comparer d'un coup d'œil.
exigerFfmpeg();
const planche = join(sortie, options.directions ? "planche-directions.jpg" : `planche-${options.format ?? "16x9"}.jpg`);
const colonnes = options.directions ? 3 : Math.min(4, fichiers.length);
const lignes = Math.ceil(fichiers.length / colonnes);
const entrees = fichiers.flatMap((f) => ["-i", f]);
const filtre =
  fichiers.map((_, i) => `[${i}:v]scale=640:-1[i${i}]`).join(";") +
  ";" +
  fichiers.map((_, i) => `[i${i}]`).join("") +
  `xstack=inputs=${fichiers.length}:layout=${fichiers.map((_, i) => `${(i % colonnes) ? Array.from({ length: i % colonnes }, (_, k) => `w${k}`).join("+") : "0"}_${Math.floor(i / colonnes) ? Array.from({ length: Math.floor(i / colonnes) }, (_, k) => `h${k * colonnes}`).join("+") : "0"}`).join("|")}:fill=black`;
if (fichiers.length > 1) {
  const r = lancer("ffmpeg", ["-hide_banner", "-y", ...entrees, "-filter_complex", filtre, "-frames:v", "1", "-q:v", "3", planche]);
  if (r.code === 0) console.log(`\n✔ Planche : ${planche.replace(RACINE, ".")}`);
}
console.log(`✔ ${fichiers.length} image(s) dans films/${nom}/images/ (${readdirSync(sortie).length} fichiers au total)`);
console.log(`Lignes : ${lignes}, colonnes : ${colonnes}. Regardez chaque image : corriger une image coûte dix fois moins cher que corriger une vidéo.`);
