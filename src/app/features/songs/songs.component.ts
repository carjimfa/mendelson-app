import { Component, signal } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ApiServicesFactory } from '../../services/api-services.factory';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Song } from '../../core/models/song';
import { map, take, tap, timer } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { PlayerStore } from '../../stores/player/player.store';
import { SongStore } from './song.store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { SongStoreEvent } from './song-store-data';
import { CommonModule } from '@angular/common';

@UntilDestroy()
@Component({
  selector: 'app-songs',
  imports: [
    CommonModule,
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
  selected = signal<number | undefined>(undefined);
  selectedOnDoubleClick = false;
  playing = signal<number | undefined>(undefined);

  isPlaying(id: number): boolean {
    return this.playing() === id;
  }

  isSelected(id: number): boolean {
    return this.selected() === id;
  }

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

    this.playerStore.playerData$
      .pipe(
        untilDestroyed(this),
        map((d) => d.nowPlaying?.id),
        tap((id) => {
          this.playing.set(id);
        })
      )
      .subscribe();
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

  select(song: Song): void {
    const clearSelection$ = timer(500).pipe(take(1), tap(() => this.selectedOnDoubleClick = false));

    if (this.selected() === song.id && this.selectedOnDoubleClick) {
      this.playSong(song);
    } else {
      this.selected.set(song.id);
      this.selectedOnDoubleClick = true;
      clearSelection$.subscribe();
    }
  }
}
