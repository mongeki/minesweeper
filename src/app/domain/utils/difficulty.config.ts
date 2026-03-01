import { Difficulty } from '../enums/difficulty.enum';
import { DifficultyConfig } from '../models/difficulty-config.model';

export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  [Difficulty.Beginner]: {
    difficulty: Difficulty.Beginner,
    rows: 9,
    cols: 9,
    mines: 10,
  },
  [Difficulty.Intermediate]: {
    difficulty: Difficulty.Intermediate,
    rows: 16,
    cols: 16,
    mines: 40,
  },
  [Difficulty.Expert]: {
    difficulty: Difficulty.Expert,
    rows: 16,
    cols: 30,
    mines: 99,
  },
};
