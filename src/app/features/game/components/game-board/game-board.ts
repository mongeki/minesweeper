import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { GameService } from '../../services/game';

@Component({
  selector: 'app-game-board',
  imports: [NgClass],
  templateUrl: './game-board.html',
  styleUrl: './game-board.scss',
})
export class GameBoard {
  constructor(public game: GameService) {}

  onLeftClick(row: number, col: number) {
    this.game.open(row, col);
  }

  onRightClick(event: MouseEvent, row: number, col: number) {
    event.preventDefault();
    this.game.toggleFlag(row, col);
  }
}
