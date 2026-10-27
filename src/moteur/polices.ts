import { continueRender, delayRender, staticFile } from "remotion";

const chargees = new Set<string>();

/**
 * Charge une police (fichier .woff2 rangé dans films/, ex. « _commun/polices/Inter-600.woff2 »)
 * avant la première image. À appeler en haut du fichier du film. Les polices
 * de l'atelier sont sous licence SIL Open Font License.
 */
export function chargerPolice(famille: string, fichier: string, poids = "400", style = "normal"): string {
  const cle = `${famille}|${fichier}|${poids}|${style}`;
  if (chargees.has(cle) || typeof document === "undefined") return famille;
  chargees.add(cle);
  const attente = delayRender(`Chargement de la police ${famille} ${poids}`);
  const police = new FontFace(famille, `url('${staticFile(fichier)}') format('woff2')`, { weight: poids, style });
  police
    .load()
    .then(() => {
      document.fonts.add(police);
      continueRender(attente);
    })
    .catch((e) => {
      console.error(`Police introuvable : ${fichier}`, e);
      continueRender(attente); // le film se rend quand même, avec une police de secours
    });
  return famille;
}

/** Les deux polices fournies avec l'atelier (Plus Jakarta Sans et Inter, licence OFL). */
export function policesAtelier() {
  chargerPolice("Plus Jakarta Sans", "_commun/polices/PlusJakartaSans-800.woff2", "800");
  chargerPolice("Plus Jakarta Sans", "_commun/polices/PlusJakartaSans-600.woff2", "600");
  chargerPolice("Inter", "_commun/polices/Inter-400.woff2", "400");
  chargerPolice("Inter", "_commun/polices/Inter-600.woff2", "600");
  return {
    titre: "'Plus Jakarta Sans', 'Segoe UI', Arial, sans-serif",
    texte: "Inter, 'Segoe UI', Arial, sans-serif",
  };
}
