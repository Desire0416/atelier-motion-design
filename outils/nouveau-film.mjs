// npm run nouveau-film -- <nom> [--titre "Titre du film"]
// Crée films/<nom>/ à partir des modèles (une fiche par étape de la méthode)
// et inscrit le film dans src/films.ts pour qu'il apparaisse dans le Studio.
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { FILMS, RACINE, lireArguments, stop } from "./commun.mjs";

const { positionnels, options } = lireArguments();
const nom = positionnels[0];
if (!nom || !/^[a-z][a-z0-9-]{1,40}$/.test(nom) || nom.endsWith("-")) {
  stop("Donnez un nom court en minuscules, chiffres et tirets, par exemple : npm run nouveau-film -- lancement-boutique");
}
const dossier = join(FILMS, nom);
if (existsSync(dossier)) stop(`Le film « ${nom} » existe déjà (films/${nom}).`);

const titre = typeof options.titre === "string" ? options.titre : nom.replace(/-/g, " ");
const composant = nom.split("-").map((p) => p[0].toUpperCase() + p.slice(1)).join("").replace(/^(\d)/, "F$1");
const variable = composant[0].toLowerCase() + composant.slice(1);
const date = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

// 1) Le dossier du film, rempli à partir des modèles.
const MODELES = join(RACINE, "modeles");
mkdirSync(join(dossier, "sons"), { recursive: true });
mkdirSync(join(dossier, "musique"), { recursive: true });
mkdirSync(join(dossier, "images"), { recursive: true });
writeFileSync(join(dossier, "sons", ".gitkeep"), "");
for (const fichier of readdirSync(MODELES)) {
  const source = join(MODELES, fichier);
  if (/\.(md|tsx|json)$/.test(fichier)) {
    const texte = readFileSync(source, "utf8")
      .replaceAll("{{ID}}", nom)
      .replaceAll("{{TITRE}}", fichier.endsWith(".tsx") ? JSON.stringify(titre).slice(1, -1) : titre)
      .replaceAll("{{DATE}}", date)
      .replaceAll("{{COMPOSANT}}", composant);
    writeFileSync(join(dossier, fichier), texte);
  } else copyFileSync(source, join(dossier, fichier));
}

// 2) L'inscription dans src/films.ts (entre les repères « films: »).
const registre = join(RACINE, "src", "films.ts");
let src = readFileSync(registre, "utf8");
if (!src.includes("// </films:imports>") || !src.includes("// </films:liste>")) stop("Repères « films: » introuvables dans src/films.ts.");
src = src
  .replace("// </films:imports>", `import { film as ${variable} } from "../films/${nom}/Film";\n// </films:imports>`)
  .replace("  // </films:liste>", `  ${variable},\n  // </films:liste>`);
writeFileSync(registre, src);

console.log(`
✔ Film créé : films/${nom}/

Les fiches de la méthode, à remplir dans l'ordre (chacune se termine par votre validation) :
  1. IDEE.md        l'angle du film
  2. SCRIPT.md      le texte, en six temps
  3. VOIX.md        la voix, son montage (montage.json) et son minutage
  4. DIRECTION.md   trois directions et leurs images figées (Directions.tsx)
  5. STORYBOARD.md  le film plan par plan
  6. Film.tsx       l'animation (Claude Code l'écrit avec vous)
  7. CONTROLE.md    les contrôles du film final

Pour commencer : ouvrez Claude Code dans l'atelier et dites
« On démarre le film ${nom} : aide-moi à trouver l'idée. »
Le film apparaît dans le Studio (npm run studio) sous « ${nom} ».
`);
