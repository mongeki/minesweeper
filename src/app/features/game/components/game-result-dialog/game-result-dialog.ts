import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GameStatus } from '../../../../domain/enums/game-status.enum';

@Component({
  selector: 'app-game-result-dialog',
  imports: [],
  templateUrl: './game-result-dialog.html',
  styleUrl: './game-result-dialog.scss',
})
export class GameResultDialog {
  data = inject(MAT_DIALOG_DATA) as {
    status: GameStatus;
    time: number;
  };

  isWin = this.data.status === GameStatus.Won;
}
