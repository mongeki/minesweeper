import { Cell } from '../models/cell.model';
import { GameState } from '../models/game-state.model';
import { GameStatus } from '../enums/game-status.enum';

export class GameEngine {
  static createGame(rows: number, cols: number, mines: number): GameState {
    const board = this.createEmptyBoard(rows, cols);
    this.placeMines(board, mines);
    this.calculateAdjacents(board);

    return {
      rows,
      cols,
      mines,
      board,
      status: GameStatus.Ready,
      openedCount: 0,
    };
  }

  static openCell(state: GameState, row: number, col: number): GameState {
    if (state.status === GameStatus.Won || state.status === GameStatus.Lost) {
      return state;
    }

    const cell = state.board[row][col];

    if (cell.isOpen || cell.isFlagged) return state;

    if (state.status === GameStatus.Ready) {
      state.status = GameStatus.Playing;
    }

    if (cell.isMine) {
      cell.isOpen = true;
      state.status = GameStatus.Lost;
      return state;
    }

    this.floodFill(state, row, col);

    if (this.checkWin(state)) {
      state.status = GameStatus.Won;
    }

    return state;
  }

  static toggleFlag(state: GameState, row: number, col: number): GameState {
    const cell = state.board[row][col];

    if (cell.isOpen) return state;

    cell.isFlagged = !cell.isFlagged;
    return state;
  }

  // ------------------------
  // PRIVATE METHODS
  // ------------------------

  private static createEmptyBoard(rows: number, cols: number): Cell[][] {
    return Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (_, c) => ({
        row: r,
        col: c,
        isMine: false,
        isOpen: false,
        isFlagged: false,
        adjacentMines: 0,
      })),
    );
  }

  private static placeMines(board: Cell[][], mines: number) {
    const rows = board.length;
    const cols = board[0].length;

    let placed = 0;

    while (placed < mines) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);

      if (!board[r][c].isMine) {
        board[r][c].isMine = true;
        placed++;
      }
    }
  }

  private static calculateAdjacents(board: Cell[][]) {
    const directions = [-1, 0, 1];

    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[0].length; c++) {
        if (board[r][c].isMine) continue;

        let count = 0;

        for (let dr of directions) {
          for (let dc of directions) {
            if (dr === 0 && dc === 0) continue;

            const nr = r + dr;
            const nc = c + dc;

            if (board[nr] && board[nr][nc] && board[nr][nc].isMine) {
              count++;
            }
          }
        }

        board[r][c].adjacentMines = count;
      }
    }
  }

  private static floodFill(state: GameState, row: number, col: number) {
    const stack: [number, number][] = [[row, col]];

    while (stack.length) {
      const [r, c] = stack.pop()!;
      const cell = state.board[r][c];

      if (cell.isOpen || cell.isFlagged) continue;

      cell.isOpen = true;
      state.openedCount++;

      if (cell.adjacentMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;

            if (state.board[nr] && state.board[nr][nc]) {
              stack.push([nr, nc]);
            }
          }
        }
      }
    }
  }

  private static checkWin(state: GameState): boolean {
    return state.openedCount === state.rows * state.cols - state.mines;
  }
}
