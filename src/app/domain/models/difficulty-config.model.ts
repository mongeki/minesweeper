import { Difficulty } from '../enums/difficulty.enum';

export interface DifficultyConfig {
  difficulty: Difficulty;
  rows: number;
  cols: number;
  mines: number;
}
