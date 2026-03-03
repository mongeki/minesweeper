export type GameAction =
  | { type: 'open'; row: number; col: number }
  | { type: 'flag'; row: number; col: number }
  | { type: 'chord'; row: number; col: number };
