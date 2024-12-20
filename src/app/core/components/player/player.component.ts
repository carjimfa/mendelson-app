import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { distinctUntilChanged, filter, map, tap } from 'rxjs';
import { PlayerStore } from '../../../stores/player/player.store';
import { PlayerStoreEvent } from '../../../stores/player/player-store.data';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { environment } from '../../../../environments/environment';

@UntilDestroy()
@Component({
  selector: 'app-player',
  imports: [
    MatIconModule,
    CommonModule,
    MatButtonModule,
    MatSliderModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss'
})
export class PlayerComponent {
  playing$ = signal<boolean>(false);
  onRepeat = signal<boolean>(false);
  shuffled = signal<boolean>(false);
  duration = signal<number>(0);
  currentTime = 0;
  featureFlags = environment.featureFlags;

  constructor(public readonly playerStore: PlayerStore) {
    this.playerStore.states$
      .pipe(
        untilDestroyed(this),
        filter((s) => [PlayerStoreEvent.play, PlayerStoreEvent.resume].includes(s.event)),
        tap(() => this.playing$.set(true))
      )
      .subscribe();

    this.playerStore.states$
      .pipe(
        untilDestroyed(this),
        filter((s) => s.event === PlayerStoreEvent.pause),
        tap(() => this.playing$.set(false))
      )
      .subscribe();

    this.playerStore.states$
      .pipe(
        untilDestroyed(this),
        map((s) => s.data.onRepeat),
        distinctUntilChanged(),
        tap((s) => this.onRepeat.set(s))
      )
      .subscribe();

    this.playerStore.playerData$
      .pipe(
        untilDestroyed(this),
        map((s) => s.shuffle),
        distinctUntilChanged(),
        tap((s) => this.shuffled.set(s))
      )
      .subscribe();

    this.playerStore.playerData$
      .pipe(
        untilDestroyed(this),
        map((s) => s.nowPlaying?.duration),
        distinctUntilChanged(),
        tap((s) => {
          if (s) {
            this.duration.set(Math.floor(s))
          }
        })
      )
      .subscribe();

    this.playerStore.playerData$
      .pipe(
        untilDestroyed(this),
        map((s) => {
          return s.currentTime
        }),
        distinctUntilChanged(),
        tap((s) => {
          if (s) {
            this.currentTime = Math.floor(s);
          }
        })
      )
      .subscribe();
  }

  play(): void {
    this.playerStore.resume();
  }

  pause(): void {
    this.playerStore.pause();
  }

  next(): void {
    this.playerStore.next();
  }

  previous(): void {
    this.playerStore.previous();
  }

  toggleRepeat(): void {
    this.playerStore.toggleRepeat();
  }

  toggleShuffle(): void {
    this.playerStore.toggleShuffle();
  }
}
