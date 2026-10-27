import type { Minutage, Mot } from "./types";

// Caler l'image sur la voix : retrouver dans minutage.json l'instant où un mot
// (ou une suite de mots) est prononcé. Accents, majuscules et ponctuation sont
// ignorés ; les jetons sans lettres (« ? », « … ») sont sautés.

const normaliser = (s: string) =>
  s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");

/**
 * Les mots de la voix qui correspondent à `texte`, dans l'ordre, à partir du
 * premier prononcé après `apres` secondes. Arrête le rendu avec un message
 * clair si la suite est introuvable (mot mal transcrit : corrigez minutage.json).
 */
export function motsDe(minutage: Minutage, texte: string, apres = 0): Mot[] {
  const cherches = texte.split(/\s+/).map(normaliser).filter(Boolean);
  const mots = minutage.mots.filter((m) => normaliser(m.mot));
  for (let i = 0; i < mots.length; i++) {
    if (mots[i].debut < apres - 1e-6) continue;
    if (cherches.every((c, k) => mots[i + k] && normaliser(mots[i + k].mot) === c)) return mots.slice(i, i + cherches.length);
  }
  throw new Error(`Repère introuvable dans minutage.json : « ${texte} » après ${apres.toFixed(2)} s.`);
}

/** L'instant (s) où la voix commence `texte` — ou le termine, avec `fin: true`. */
export function repere(minutage: Minutage, texte: string, { apres = 0, fin = false }: { apres?: number; fin?: boolean } = {}): number {
  const mots = motsDe(minutage, texte, apres);
  return fin ? mots[mots.length - 1].fin : mots[0].debut;
}
