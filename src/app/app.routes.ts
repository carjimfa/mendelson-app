import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { SongsComponent } from './features/songs/songs.component';

export enum AppRoutes {
    Home = 'home',
    Songs = 'songs'
}

export const routes: Routes = [
    {
        path: AppRoutes.Home,
        component: HomeComponent
    },
    {
        path: AppRoutes.Songs,
        component: SongsComponent
    },
    {
        path: '',
        redirectTo: AppRoutes.Home,
        pathMatch: 'full'
    }
];
