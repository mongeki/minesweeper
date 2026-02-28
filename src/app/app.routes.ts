import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { AuthLayout } from './layout/auth-layout/auth-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'game',
        loadChildren: () => import('./features/game/game.routes').then((m) => m.GAME_ROUTES),
      },
      //  {
      //    path: 'leaderboard',
      //    loadChildren: () =>
      //      import('./features/leaderboard/leaderboard.routes')
      //        .then(m => m.LEADERBOARD_ROUTES)
      //  },
      //  {
      //    path: 'profile',
      //    loadChildren: () =>
      //      import('./features/profile/profile.routßes')
      //        .then(m => m.PROFILE_ROUTES)
      //  }
    ],
  },
  {
    path: 'auth',
    component: AuthLayout,
    //loadChildren: () =>
    //import('./features/auth/auth.routes')
    //    .then(m => m.AUTH_ROUTES)
  },
];
