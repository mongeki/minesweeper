import { Injectable, signal, computed, effect } from '@angular/core';
import { GameEngine } from '../../../domain/utils/game-engine';
import { GameState } from '../../../domain/models/game-state.model';
import { GameStatus } from '../../../domain/enums/game-status.enum';
import { Difficulty } from '../../../domain/enums/difficulty.enum';
import { DIFFICULTY_CONFIG } from '../../../domain/utils/difficulty.config';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  difficulty = signal<Difficulty>(Difficulty.Beginner);
  private _state = signal<GameState>(this.createInitialGame());

  state = this._state.asReadonly();
  status = computed(() => this._state().status);

  private createInitialGame(): GameState {
    const config = DIFFICULTY_CONFIG[this.difficulty()];
    return GameEngine.createGame(config.rows, config.cols, config.mines);
  }

  private _time = signal(0);
  time = this._time.asReadonly();

  private intervalId: any = null;

  constructor() {
    effect(() => {
      const status = this.status();

      if (status === GameStatus.Playing && !this.intervalId) {
        this.startTimer();
      }

      if (status === GameStatus.Won || status === GameStatus.Lost) {
        this.stopTimer();
      }
    });
  }

  minesLeft = computed(() => {
    const state = this._state();
    const flagged = state.board.flat().filter((c) => c.isFlagged).length;
    return state.mines - flagged;
  });

  newGame() {
    const config = DIFFICULTY_CONFIG[this.difficulty()];
    const seed = Date.now();

    this._state.set(GameEngine.createGame(config.rows, config.cols, config.mines, seed));

    this._time.set(0);
  }

  autoFlag(row: number, col: number) {
    const updated = GameEngine.reduce(this._state(), {
      type: 'auto-flag',
      row,
      col,
    });

    this._state.set(updated);
  }

  setDifficulty(difficulty: Difficulty) {
    this.difficulty.set(difficulty);
    this.newGame();
  }

  open(row: number, col: number) {
    const updated = GameEngine.reduce(this._state(), {
      type: 'open',
      row,
      col,
    });

    this._state.set(updated);
  }

  toggleFlag(row: number, col: number) {
    const updated = GameEngine.reduce(this._state(), {
      type: 'flag',
      row,
      col,
    });

    this._state.set(updated);
  }

  private startTimer() {
    this.intervalId = setInterval(() => {
      this._time.update((t) => t + 1);
    }, 1000);
  }

  private stopTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
