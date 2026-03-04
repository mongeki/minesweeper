import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';
import { Cell } from '../../../../domain/models/cell.model';

@Component({
  selector: 'app-game-cell',
  standalone: true,
  templateUrl: './game-cell.html',
  styleUrls: ['./game-cell.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameCell {
  @Input({ required: true }) cell!: Cell;

  @Output() open = new EventEmitter<void>();
  @Output() flag = new EventEmitter<void>();
  @Output() autoFlag = new EventEmitter<void>();

  // UI state
  pressed = signal(false);

  private longPressTimeout?: any;
  private readonly LONG_PRESS_MS = 400;

  // =========================
  // Desktop
  // =========================

  onLeftClick() {
    if (this.cell.isOpen) {
      this.open.emit(); // chord
    } else {
      this.open.emit();
    }
  }

  onRightClick(event: MouseEvent) {
    event.preventDefault();

    if (this.cell.isOpen) {
      this.autoFlag.emit();
    } else {
      this.flag.emit();
    }
  }

  // =========================
  // Mobile (long press)
  // =========================

  onPointerDown(event: PointerEvent) {
    if (event.pointerType === 'touch') {
      this.pressed.set(true);

      this.longPressTimeout = setTimeout(() => {
        this.pressed.set(false);

        if (this.cell.isOpen) {
          this.autoFlag.emit();
        } else {
          this.flag.emit();
        }
      }, this.LONG_PRESS_MS);
    }
  }

  onPointerUp(event: PointerEvent) {
    if (event.pointerType === 'touch') {
      clearTimeout(this.longPressTimeout);

      if (this.pressed()) {
        // короткое нажатие = open
        this.open.emit();
      }

      this.pressed.set(false);
    }
  }

  onPointerLeave() {
    clearTimeout(this.longPressTimeout);
    this.pressed.set(false);
  }

  // =========================
  // Helpers
  // =========================

  get numberClass(): string {
    return `mine-${this.cell.adjacentMines}`;
  }
}
