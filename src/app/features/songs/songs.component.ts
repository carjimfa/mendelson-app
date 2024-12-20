import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ApiServicesFactory } from '../../services/api-services.factory';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Song } from '../../core/models/song';
import { map, take, tap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { PlayerStore } from '../../stores/player/player.store';
import { PlayerStoreData, PlayerStoreEvent } from '../../stores/player/player-store.data';
import { SongStore } from './song.store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { SongStoreEvent } from './song-store-data';

@UntilDestroy()
@Component({
  selector: 'app-songs',
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule
  ],
  providers: [
    {
      provide: ApiService,
      useFactory: ApiServicesFactory
    }
  ],
  templateUrl: './songs.component.html',
  styleUrl: './songs.component.scss'
})
export class SongsComponent {
  data: Array<Song>;
  displayedColumns: string[] = ['title', 'albumArtist', 'album', 'duration'];

  constructor(
    private readonly apiService: ApiService,
    private readonly playerStore: PlayerStore,
    private readonly songStore: SongStore
  ) {
    this.songStore.states$
      .pipe(
        untilDestroyed(this),
        map((songStoreStata) => songStoreStata.data.songs),
        tap((songs) => {
          this.data = songs;
        })
      )
      .subscribe();

    this.getSongs();
  }

  getSongs(): void {
    this.apiService.getSongs().pipe(take(1)).subscribe((songs) => {
      this.songStore.setState(
        SongStoreEvent.loadSongs,
        {
          songs
        }
      );
    });
  }

  playSong(song: Song) {
    const songIndex = this.data.findIndex((s) => s.id === song.id);
    this.playerStore.play(this.data, songIndex);
  }
}
