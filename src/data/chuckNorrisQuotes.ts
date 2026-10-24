export const CHUCK_NORRIS_QUOTES: string[] = [
  "Quand Chuck Norris frotte une lampe et qu’un génie en sort, le génie a droit à trois vœux.",
  "Chuck Norris a été enlevé par les extra-terrestres en 1987. Depuis, nous sommes seuls dans l’Univers.",
  "Avant d’aller à l’école, Chuck Norris déposait ses parents au travail.",
  "Chuck Norris perd toujours à cache-cache. Quand on cherche Chuck Norris on le trouve.",
  "Un jour Chuck Norris a commandé un steak dans un restaurant, et le steak a obéi.",
  "Depuis que Chuck Norris joue, l’important c’est de participer.",
  "Avoir une photo de Chuck Norris sur soi pendant une épreuve sportive est considéré comme du dopage.",
  "Un jour le Père Noël a frappé à la porte de Chuck Norris. Depuis il passe par la cheminée.",
  "Google est le seul endroit où l’on peut taper Chuck Norris.",
  "L’homme propose, la femme dispose, et Chuck Norris impose.",
  "Quand la nuit tombe, Chuck Norris sait la relever.",
  "Quand Chuck Norris était à l’école, c’est lui qui convoquait les parents de ses professeurs.",
  "Si Chuck Norris dort la lumière allumée, c’est parce que le noir a peur de lui.",
  "Quand Chuck Norris s’aperçoit qu’il a sauté de l’avion sans parachute, il remonte le chercher."
];

export const getRandomChuckNorrisQuote = (previousQuote?: string): string => {
  const available = previousQuote && CHUCK_NORRIS_QUOTES.length > 1
    ? CHUCK_NORRIS_QUOTES.filter(q => q !== previousQuote)
    : CHUCK_NORRIS_QUOTES;
  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex];
};
