import { Cell } from '../models/cell.model';
import { GameState } from '../models/game-state.model';
import { GameStatus } from '../enums/game-status.enum';

export class GameEngine {
  static createGame(rows: number, cols: number, mines: number): GameState {
    const board = this.createEmptyBoard(rows, cols);

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

    if (cell.isOpen) {
      this.chord(state, row, col);
      return state;
    }

    if (cell.isFlagged) return state;

    if (state.status === GameStatus.Ready) {
      this.placeMines(state, row, col);
      this.calculateNumbers(state);
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
    const board: Cell[][] = [];

    for (let r = 0; r < rows; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < cols; c++) {
        row.push({
          row: r,
          col: c,
          isMine: false,
          isOpen: false,
          isFlagged: false,
          adjacentMines: 0,
        });
      }
      board.push(row);
    }

    return board;
  }

  private static placeMines(state: GameState, safeRow: number, safeCol: number) {
    const forbidden = new Set<string>();

    // запрещаем саму клетку
    forbidden.add(`${safeRow}-${safeCol}`);

    // запрещаем соседей
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const r = safeRow + dr;
        const c = safeCol + dc;
        if (state.board[r] && state.board[r][c]) {
          forbidden.add(`${r}-${c}`);
        }
      }
    }

    let placed = 0;

    while (placed < state.mines) {
      const r = Math.floor(Math.random() * state.rows);
      const c = Math.floor(Math.random() * state.cols);

      const key = `${r}-${c}`;

      if (forbidden.has(key)) continue;

      const cell = state.board[r][c];
      if (!cell.isMine) {
        cell.isMine = true;
        placed++;
      }
    }
  }

  private static calculateNumbers(state: GameState) {
    for (let r = 0; r < state.rows; r++) {
      for (let c = 0; c < state.cols; c++) {
        const cell = state.board[r][c];

        if (cell.isMine) continue;

        const neighbors = this.getNeighbors(state, r, c);

        cell.adjacentMines = neighbors.filter((n) => n.isMine).length;
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

  private static chord(state: GameState, row: number, col: number) {
    const cell = state.board[row][col];

    if (!cell.isOpen || cell.adjacentMines === 0) return;

    const neighbors = this.getNeighbors(state, row, col);

    const flaggedCount = neighbors.filter((n) => n.isFlagged).length;

    if (flaggedCount !== cell.adjacentMines) return;

    for (const neighbor of neighbors) {
      if (!neighbor.isOpen && !neighbor.isFlagged) {
        if (neighbor.isMine) {
          neighbor.isOpen = true;
          state.status = GameStatus.Lost;
          return;
        }

        this.floodFill(state, neighbor.row, neighbor.col);
      }
    }

    if (this.checkWin(state)) {
      state.status = GameStatus.Won;
    }
  }

  private static getNeighbors(state: GameState, row: number, col: number) {
    const neighbors: Cell[] = [];

    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;

        const nr = row + dr;
        const nc = col + dc;

        if (state.board[nr] && state.board[nr][nc]) {
          neighbors.push(state.board[nr][nc]);
        }
      }
    }

    return neighbors;
  }
}
