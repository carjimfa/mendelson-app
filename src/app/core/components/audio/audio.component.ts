import { Component, ElementRef, ViewChild } from '@angular/core';
import { readFile } from '@tauri-apps/plugin-fs';
import { map, filter, mergeMap, from, of, tap, Observable, combineLatest, distinctUntilChanged, pairwise, take } from 'rxjs';
import { PlayerStore } from '../../../stores/player/player.store';
import { PlayerStoreData, PlayerStoreEvent } from '../../../stores/player/player-store.data';
import { CommonModule } from '@angular/common';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-audio',
  imports: [
    CommonModule],
  templateUrl: './audio.component.html',
  styleUrl: './audio.component.scss'
})
export class AudioComponent {
  @ViewChild('audio', { static: false }) audio: ElementRef;
  playerData$: Observable<PlayerStoreData>;

  constructor(private readonly playerStore: PlayerStore) {
    this.playerData$ = playerStore.states$.pipe(
      untilDestroyed(this),
      filter((s) => !!s.data),
      map((s) => new PlayerStoreData(s.data))
    );

    this.playerStore.states$
      .pipe(
        untilDestroyed(this),
        filter(
          (s) => [
            PlayerStoreEvent.play,
            PlayerStoreEvent.next,
            PlayerStoreEvent.previous
          ].includes(s.event)
        ),
        map((s) => new PlayerStoreData(s.data)),
        filter((d) => !!d.nowPlaying?.filePath),
        map((data) => data.nowPlaying?.filePath),
        distinctUntilChanged(),
        mergeMap((filePath) => {
          if (filePath) {
            return combineLatest([readFile(filePath), this.playerData$.pipe(take(1))]);
          } else {
            return of();
          }
        }),
        tap(([fileContents, data]) => {
          console.log('setting up the audio')
          const extension = data.nowPlaying?.extension;
          const blob = new Blob([fileContents], { type: `audio/${extension}` });
          this.audio.nativeElement.src = window.URL.createObjectURL(blob);
          this.audio.nativeElement.play();
        })
      )
      .subscribe();

    this.playerStore.states$
      .pipe(
        untilDestroyed(this),
        filter((s) => s.event === PlayerStoreEvent.resume),
        map((s) => new PlayerStoreData(s.data)),
        filter((s) => s && s.nowPlaying?.filePath && this.audio?.nativeElement),
        tap((isPlaying) => {
          console.log('isPlaying');
          console.log(isPlaying);
          console.log(this.audio?.nativeElement);
          this.audio.nativeElement.play();
        })
      )
      .subscribe();

    this.playerStore.states$
      .pipe(
        untilDestroyed(this),
        filter((s) => s.event === PlayerStoreEvent.pause),
        map((s) => new PlayerStoreData(s.data)),
        filter((s) => s && s.nowPlaying?.filePath && this.audio?.nativeElement),
        tap((isPlaying) => {
          console.log('isPlaying');
          console.log(isPlaying);
          console.log(this.audio?.nativeElement);
          this.audio.nativeElement.pause();
        })
      )
      .subscribe();
  }

  next(): void {
    this.playerStore.next();
  }
}
