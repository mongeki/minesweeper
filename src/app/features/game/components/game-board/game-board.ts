import { Component } from '@angular/core';
import { GameService } from '../../services/game';
import { GameCell } from '../game-cell/game-cell';

@Component({
  selector: 'app-game-board',
  standalone: true,
  templateUrl: './game-board.html',
  styleUrl: './game-board.scss',
  imports: [GameCell],
})
export class GameBoard {
  constructor(public game: GameService) {}

  onOpen(row: number, col: number) {
    this.game.open(row, col);
  }

  onFlag(row: number, col: number) {
    this.game.toggleFlag(row, col);
  }

  onAutoFlag(row: number, col: number) {
    this.game.autoFlag(row, col);
  }
}
