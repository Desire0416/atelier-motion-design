// Réglages de rendu de l'atelier. Les fichiers d'un film (voix, sons, images,
// polices) vivent dans son dossier films/<nom>/ : ce dossier sert de « public »
// à Remotion, d'où staticFile("<nom>/voix-montee.wav").
import { Config } from "@remotion/cli/config";

Config.setPublicDir("./films");
Config.setVideoImageFormat("png"); // images sans perte avant l'encodage : dégradés propres
Config.setColorSpace("bt709"); // couleurs fidèles sur téléphone et sur YouTube
Config.setCrf(16); // qualité haute ; npm run rendu ajuste pour les brouillons
Config.setOverwriteOutput(true);
