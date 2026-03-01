import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { GameService } from '../../services/game';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Difficulty } from '../../../../domain/enums/difficulty.enum';

@Component({
  selector: 'app-game-toolbar',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './game-toolbar.html',
  styleUrl: './game-toolbar.scss',
})
export class GameToolbar {
  Difficulty = Difficulty;
  minesLeft = 10;
  time = 0;
  constructor(public game: GameService) {}

  newGame() {
    console.log('New Game');
  }
}
