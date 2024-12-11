import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { SongsComponent } from './features/songs/songs.component';
import { AlbumsComponent } from './features/albums/albums.component';
import { ArtistsComponent } from './features/artists/artists.component';
import { RecentlyAddedComponent } from './features/recently-added/recently-added.component';

export enum AppRoutes {
    Home = 'home',
    Songs = 'songs',
    Albums = 'albums',
    Artists = 'artists',
    RecentlyAdded = 'recently-added'
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
        path: AppRoutes.Albums,
        component: AlbumsComponent
    },
    {
        path: AppRoutes.Artists,
        component: ArtistsComponent
    },
    {
        path: AppRoutes.RecentlyAdded,
        component: RecentlyAddedComponent
    },
    {
        path: '',
        redirectTo: AppRoutes.Home,
        pathMatch: 'full'
    }
];
