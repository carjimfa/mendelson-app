import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { FileService } from './file.service';
import { concatAll, map, mergeAll, mergeMap, Observable, of, take, tap } from 'rxjs';
import { SongService } from './song.service';
import { SongStore } from '../features/songs/song.store';
import { Song } from '../core/models/song';

@Injectable({
  providedIn: 'root'
})
export class ImportService {
  constructor(
    private readonly apiService: ApiService,
    private readonly fileService: FileService,
    private readonly songService: SongService,
    private readonly songStore: SongStore
  ) { }

  importSongsWithDialog(): Observable<Array<Song>> {
    return this.fileService.openFileSelectorDialog()
      .pipe(
        take(1),
        map((filePaths) => filePaths.map((c) => this.songService.analyzeSong(c))),
        concatAll(),
        mergeAll(),
        mergeMap((song) => {
          return this.apiService.songExists(song)
            .pipe(map((isDuplicate) => isDuplicate ? null : song))
        }),
        mergeMap((song) => {
          if (song) {
            return this.apiService.createSong(song);
          }

          return of(null);
        }),
        mergeMap((qr) =>
          this.apiService.getSongs()
            .pipe(
              tap((songs) => {
                this.songStore.setState({ data: { songs } });
              })
            )
        )
      );
  }
}
