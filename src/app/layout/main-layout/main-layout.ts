import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { Sidebar } from '../sidebar/sidebar';
import { Header } from '../header/header';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, MatSidenavModule, MatToolbarModule, MatIconModule, Sidebar, Header],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss'],
})
export class MainLayout {
  private breakpointObserver = inject(BreakpointObserver);

  isMobile = toSignal(
    this.breakpointObserver.observe([Breakpoints.Handset]).pipe(map((result) => result.matches)),
    { initialValue: false },
  );

  sidenavOpened = signal(true);

  toggle() {
    this.sidenavOpened.update((v) => !v);
  }

  closeIfMobile() {
    if (this.isMobile()) {
      this.sidenavOpened.set(false);
    }
  }
}
