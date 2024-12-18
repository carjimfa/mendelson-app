import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { PlayerStore } from '../../../stores/player/player.store';
import { PlayerStoreData } from '../../../stores/player/player-store.data';
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
  isPlaying$: Observable<boolean>;
  whatsPlaying$: Observable<string>;
  playing$ = new BehaviorSubject<boolean>(false);

  constructor(private readonly playerStore: PlayerStore) {
    this.playerData$ = playerStore.states$.pipe(
      untilDestroyed(this),
      map((s) => new PlayerStoreData(s.data))
    );

    playerStore.states$.subscribe((data) => console.log(data));
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
