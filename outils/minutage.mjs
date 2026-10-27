// npm run minutage -- <nom> [--modele small|medium|base] [--fichier voix-montee.wav]
// Minutage mot à mot de la voix montée avec Whisper, en local : écrit
// films/<nom>/minutage.json, l'horloge de tout le film (durée, mots, silences).
// Le texte du script (SCRIPT.md, version voix) sert d'indice d'orthographe.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { RACINE, dossierFilm, lancer, lireArguments, premierExistant, stop } from "./commun.mjs";

const { positionnels, options } = lireArguments();
const nom = positionnels[0];
const dossier = dossierFilm(nom);

const audio = premierExistant(
  typeof options.fichier === "string" ? join(dossier, options.fichier) : null,
  join(dossier, "voix-montee.wav"),
);
if (!audio) stop(`films/${nom}/voix-montee.wav est introuvable : montez d'abord la voix (npm run montage -- ${nom}).`);

// Python : « python3 » (macOS, Linux), « python » ou « py -3 » (Windows).
const candidats = [["python3", []], ["python", []], ["py", ["-3"]]];
const python = candidats.find(([cmd, pre]) => lancer(cmd, [...pre, "-c", "import sys; print(sys.version_info[0])"]).sortie.trim() === "3");
if (!python) stop("Python 3 est introuvable. Demandez à Claude Code : « Installe Python 3 et faster-whisper pour le minutage ».");
const [cmd, pre] = python;
const verif = lancer(cmd, [...pre, "-c", "import importlib.util as u; print(bool(u.find_spec('whisper') or u.find_spec('faster_whisper')))"]);
if (verif.sortie.trim() !== "True") stop("Whisper n'est pas installé. Demandez à Claude Code : « Installe faster-whisper pour le minutage » (téléchargement d'environ 500 Mo la première fois, modèle compris).");

// Indice d'orthographe : la version voix du script, si elle est remplie.
let indice = "";
const script = join(dossier, "SCRIPT.md");
if (existsSync(script)) {
  const texte = readFileSync(script, "utf8");
  const section = texte.split(/^## Version voix.*$/m)[1] ?? "";
  indice = section.split(/^## /m)[0].replace(/```[a-z]*|```/g, "").replace(/\s+/g, " ").trim().slice(0, 800);
}

const r = lancer(
  cmd,
  [...pre, join(RACINE, "outils", "minutage.py"), audio, "--sortie", join(dossier, "minutage.json"), "--modele", String(options.modele ?? "small"), "--langue", String(options.langue ?? "fr"), "--indice", indice],
  { silencieux: false },
);
if (r.code !== 0) stop("Le minutage a échoué (voir le message ci-dessus).");
console.log(`
Étape suivante : vérifiez les mots signalés, puis écrivez le storyboard sur ce minutage.
Le film prend automatiquement la durée de minutage.json.
`);
