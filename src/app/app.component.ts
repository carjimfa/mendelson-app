import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ToolbarComponent } from './core/components/toolbar/toolbar.component';
import { SidebarComponent } from "./core/components/sidebar/sidebar.component";
import { SongService } from './services/song.service';
import { ApiService } from './services/api.service';
import { SongDbModel } from './core/models/song';
import { ApiServicesFactory } from './services/api-services.factory';
import { open } from '@tauri-apps/plugin-dialog';
import { readFile } from '@tauri-apps/plugin-fs';
import { filter, from, map, mergeMap, Observable, take, tap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { QueryResult } from '@tauri-apps/plugin-sql';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatSidenavModule,
    ToolbarComponent,
    SidebarComponent,
    MatButtonModule
  ],
  providers: [
    {
      provide: ApiService,
      useFactory: ApiServicesFactory
    }
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true
})
export class AppComponent {
  title = 'mendelson-app';
  showFiller = false;

  constructor(
    private readonly songService: SongService,
    private readonly apiService: ApiService
  ) {}

  openFileSelectorDialog(): void {
    const file$ = from(
      open({
        multiple: false,
        directory: false,
      })
    );

    file$
      .pipe(
        take(1),
        filter((filePath) => filePath !== null),
        mergeMap((file) => this.analyze(file)),
        mergeMap((song) => this.apiService.createSong(song))
      )
      .subscribe();
  }

  analyze(filePath:string): Observable<SongDbModel> {
    return from(readFile(filePath))
      .pipe(
        take(1),
        mergeMap((fileContents) => {
          console.log("about to read metadata")
          return this.songService.getMetadataFromBuffer(filePath, fileContents)
        }),
        map((song) => {
          const songDbModel = new SongDbModel(
            {
              ...song,
              addedOn: new Date(Date.now()),
              modifiedOn: new Date(Date.now()),
              timesPlayed: 0,
              rating: 0,
              isFavorite: false,
              genreNormalized: ''
            }
          );

          console.log(songDbModel);

          return songDbModel;
        })
      );
  }
}
