import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject, filter, map, Observable, tap } from 'rxjs';
import { PlayerStore } from '../../../stores/player/player.store';
import { PlayerStoreData, PlayerStoreEvent } from '../../../stores/player/player-store.data';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-player',
  imports: [
    MatIconModule,
    CommonModule,
    MatButtonModule
  ],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss'
})
export class PlayerComponent {
  playerData$: Observable<PlayerStoreData>;
  whatsPlaying$: Observable<string>;
  private _playing$ = new BehaviorSubject<boolean>(false);
  playing$: Observable<boolean>;

  constructor(private readonly playerStore: PlayerStore) {
    this.playerData$ = playerStore.states$.pipe(
      untilDestroyed(this),
      map((s) => new PlayerStoreData(s.data))
    );

    this.playing$ = this._playing$.asObservable();

    this.playerStore.states$
      .pipe(
        untilDestroyed(this),
        filter((s) => [PlayerStoreEvent.play, PlayerStoreEvent.resume].includes(s.event)),
        tap(() => this._playing$.next(true))
      )
      .subscribe();

    this.playerStore.states$
      .pipe(
        untilDestroyed(this),
        filter((s) => s.event === PlayerStoreEvent.pause),
        tap(() => this._playing$.next(false))
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
}
