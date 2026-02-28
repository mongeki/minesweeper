import { GameStatus } from '../enums/game-status.enum';
import { Cell } from './cell.model';

export interface GameState {
  rows: number;
  cols: number;
  mines: number;
  board: Cell[][];
  status: GameStatus;
  openedCount: number;
}
