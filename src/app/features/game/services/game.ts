import { Injectable, signal, computed, effect } from '@angular/core';
import { GameEngine } from '../../../domain/utils/game-engine';
import { GameState } from '../../../domain/models/game-state.model';
import { GameStatus } from '../../../domain/enums/game-status.enum';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private initialRows = 9;
  private initialCols = 9;
  private initialMines = 10;

  private _state = signal<GameState>(
    GameEngine.createGame(this.initialRows, this.initialCols, this.initialMines),
  );

  state = this._state.asReadonly();
  status = computed(() => this._state().status);

  // 🔥 ТАЙМЕР
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
    this.stopTimer();
    this._time.set(0);

    this._state.set(GameEngine.createGame(this.initialRows, this.initialCols, this.initialMines));
  }

  open(row: number, col: number) {
    const updated = GameEngine.openCell(this._state(), row, col);
    this._state.set({ ...updated });
  }

  toggleFlag(row: number, col: number) {
    const updated = GameEngine.toggleFlag(this._state(), row, col);
    this._state.set({ ...updated });
  }

  // -----------------------
  // TIMER METHODS
  // -----------------------

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
