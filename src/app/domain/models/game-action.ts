export type GameAction =
  | { type: 'open'; row: number; col: number }
  | { type: 'flag'; row: number; col: number }
  | { type: 'auto-flag'; row: number; col: number };
