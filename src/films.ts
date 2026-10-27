// La liste des films de l'atelier. `npm run nouveau-film -- <nom>` y ajoute
// le vôtre automatiquement : ne modifiez pas les lignes de repère « films: ».
import type { DefinitionFilm } from "./moteur/types";
// <films:imports>
import { film as yelaExemple } from "../films/yela-exemple/Film";
// </films:imports>

export const FILMS: DefinitionFilm[] = [
  // <films:liste>
  yelaExemple,
  // </films:liste>
];
