import { Injectable, signal, effect } from '@angular/core';

export type AppTheme = 'light-theme' | 'dark-theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private storageKey = 'app-theme';

  theme = signal<AppTheme>('light-theme');

  constructor() {
    const saved = localStorage.getItem(this.storageKey) as AppTheme | null;

    if (saved) {
      this.theme.set(saved);
    }

    effect(() => {
      const current = this.theme();

      document.body.classList.remove('light-theme', 'dark-theme');
      document.body.classList.add(current);

      localStorage.setItem(this.storageKey, current);
    });
  }

  toggleTheme() {
    this.theme.update((t) => (t === 'light-theme' ? 'dark-theme' : 'light-theme'));
  }

  setTheme(theme: AppTheme) {
    this.theme.set(theme);
  }
}
