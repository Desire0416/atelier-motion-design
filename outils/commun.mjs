// Fonctions partagées par les outils de l'atelier (Windows, macOS, Linux).
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const FILMS = join(RACINE, "films");
export const RENDUS = join(RACINE, "rendus");

/** Arrête l'outil avec un message clair (en français, sans pile d'erreur). */
export function stop(message) {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

/** Arguments : positionnels + options « --nom valeur » ou « --drapeau ». */
export function lireArguments(argv = process.argv.slice(2)) {
  const positionnels = [];
  const options = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const cle = a.slice(2);
      const suivant = argv[i + 1];
      if (suivant !== undefined && !suivant.startsWith("--")) {
        options[cle] = suivant;
        i++;
      } else options[cle] = true;
    } else positionnels.push(a);
  }
  return { positionnels, options };
}

/** Le dossier d'un film existant (films/<nom>), ou arrêt avec la liste des films. */
export function dossierFilm(nom) {
  if (!nom) stop("Indiquez le nom du film, par exemple : npm run minutage -- mon-film");
  const dossier = join(FILMS, nom);
  if (!existsSync(dossier)) stop(`Le film « ${nom} » n'existe pas dans films/. Créez-le avec : npm run nouveau-film -- ${nom}`);
  return dossier;
}

/** Lance une commande et renvoie { code, sortie, erreurs } (sans shell : chemins avec espaces acceptés). */
export function lancer(commande, args, { silencieux = true, cwd = RACINE } = {}) {
  const r = spawnSync(commande, args, { cwd, encoding: "utf8", maxBuffer: 64 * 1024 * 1024, stdio: silencieux ? "pipe" : "inherit", shell: false });
  if (r.error && r.error.code === "ENOENT") return { code: 127, sortie: "", erreurs: `${commande} introuvable` };
  return { code: r.status ?? 1, sortie: r.stdout ?? "", erreurs: r.stderr ?? "" };
}

/**
 * Lance la ligne de commande de Remotion avec Node (sans npx : sous Windows,
 * un .cmd ne peut plus être lancé sans shell).
 */
export function remotion(args, options = {}) {
  const cli = join(RACINE, "node_modules", "@remotion", "cli", "remotion-cli.js");
  if (!existsSync(cli)) stop("Remotion n'est pas installé. Lancez d'abord : npm install");
  return lancer(process.execPath, [cli, ...args], options);
}

/** Vérifie que ffmpeg et ffprobe sont installés. */
export function exigerFfmpeg() {
  for (const outil of ["ffmpeg", "ffprobe"]) {
    if (lancer(outil, ["-version"]).code !== 0) {
      stop(`${outil} est introuvable. Demandez à Claude Code : « Installe ffmpeg sur mon ordinateur et vérifie qu'il fonctionne ».`);
    }
  }
}

/** Durée d'un fichier audio ou vidéo, en secondes. */
export function duree(fichier) {
  const r = lancer("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", fichier]);
  const d = parseFloat(r.sortie);
  if (!Number.isFinite(d)) stop(`Impossible de lire la durée de ${fichier}.`);
  return d;
}

export const lireJson = (fichier) => JSON.parse(readFileSync(fichier, "utf8"));

/** Le premier fichier qui existe parmi les candidats, ou null. */
export const premierExistant = (...candidats) => candidats.find((c) => c && existsSync(c)) ?? null;

export const s2 = (n) => n.toFixed(2).replace(".", ",");
