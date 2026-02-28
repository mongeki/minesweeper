import { Component, effect, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { GameToolbar } from '../../components/game-toolbar/game-toolbar';
import { GameBoard } from '../../components/game-board/game-board';
import { MatDialog } from '@angular/material/dialog';
import { GameService } from '../../services/game';
import { GameStatus } from '../../../../domain/enums/game-status.enum';
import { GameResultDialog } from '../../components/game-result-dialog/game-result-dialog';

@Component({
  selector: 'app-game-page',
  imports: [MatCardModule, GameToolbar, GameBoard],
  templateUrl: './game-page.html',
  styleUrl: './game-page.scss',
})
export class GamePage {
  private dialog = inject(MatDialog);
  private game = inject(GameService);

  constructor() {
    effect(() => {
      const status = this.game.status();

      if (status === GameStatus.Won || status === GameStatus.Lost) {
        this.openDialog(status);
      }
    });
  }
  private openDialog(status: GameStatus) {
    const dialogRef = this.dialog.open(GameResultDialog, {
      width: '320px',
      data: {
        status,
        time: this.game.time(),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'restart') {
        this.game.newGame();
      }
    });
  }
}
