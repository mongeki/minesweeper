import { Cell } from '../models/cell.model';
import { GameState } from '../models/game-state.model';
import { GameStatus } from '../enums/game-status.enum';
import { GameAction } from '../models/game-action';

export class GameEngine {
  static createGame(
    rows: number,
    cols: number,
    mines: number,
    seed: number = Date.now(),
  ): GameState {
    const board = this.createEmptyBoard(rows, cols);

    return {
      rows,
      cols,
      mines,
      board,
      status: GameStatus.Ready,
      openedCount: 0,
      seed,
    };
  }

  static reduce(state: GameState, action: GameAction): GameState {
    switch (action.type) {
      case 'open':
        return this.openCell(state, action.row, action.col);

      case 'flag':
        return this.toggleFlag(state, action.row, action.col);

      case 'chord':
        return this.openCell(state, action.row, action.col);

      default:
        return state;
    }
  }

  static openCell(state: GameState, row: number, col: number): GameState {
    if (state.status === GameStatus.Won || state.status === GameStatus.Lost) {
      return state;
    }

    const newBoard = this.cloneBoard(state.board);
    let newState: GameState = { ...state, board: newBoard };

    const cell = newBoard[row][col];

    if (cell.isOpen) {
      return this.chord(newState, row, col);
    }

    if (cell.isFlagged) {
      return state;
    }

    if (state.status === GameStatus.Ready) {
      this.placeMines(newState, row, col);
      this.calculateNumbers(newState);
      newState.status = GameStatus.Playing;
    }

    if (cell.isMine) {
      cell.isOpen = true;

      return {
        ...newState,
        status: GameStatus.Lost,
      };
    }

    this.floodFill(newState, row, col);

    if (this.checkWin(newState)) {
      return {
        ...newState,
        status: GameStatus.Won,
      };
    }

    return newState;
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

  private static cloneBoard(board: Cell[][]): Cell[][] {
    return board.map((row) => row.map((cell) => ({ ...cell })));
  }

  private static mulberry32(seed: number) {
    return function () {
      let t = (seed += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

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
    const random = this.mulberry32(state.seed);

    const forbidden = new Set<string>();

    forbidden.add(`${safeRow}-${safeCol}`);

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
      const r = Math.floor(random() * state.rows);
      const c = Math.floor(random() * state.cols);

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

  private static floodFill(state: GameState, startRow: number, startCol: number) {
    const queue: Array<[number, number]> = [[startRow, startCol]];

    while (queue.length > 0) {
      const [row, col] = queue.shift()!;
      const cell = state.board[row][col];

      if (cell.isOpen || cell.isFlagged) continue;

      cell.isOpen = true;
      state.openedCount++;

      if (cell.adjacentMines > 0) continue;

      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;

          const r = row + dr;
          const c = col + dc;

          if (state.board[r] && state.board[r][c]) {
            queue.push([r, c]);
          }
        }
      }
    }
  }

  private static checkWin(state: GameState): boolean {
    return state.openedCount === state.rows * state.cols - state.mines;
  }

  private static chord(state: GameState, row: number, col: number): GameState {
    const cell = state.board[row][col];

    if (!cell.isOpen || cell.adjacentMines === 0) {
      return state;
    }

    const neighbors = this.getNeighbors(state, row, col);

    const flaggedCount = neighbors.filter((n) => n.isFlagged).length;

    if (flaggedCount !== cell.adjacentMines) {
      return state;
    }

    let newState = state;

    for (const neighbor of neighbors) {
      if (neighbor.isOpen || neighbor.isFlagged) continue;

      if (neighbor.isMine) {
        neighbor.isOpen = true;

        return {
          ...newState,
          status: GameStatus.Lost,
        };
      }

      this.floodFill(newState, neighbor.row, neighbor.col);
    }

    if (this.checkWin(newState)) {
      return {
        ...newState,
        status: GameStatus.Won,
      };
    }

    return newState;
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
