import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PlayerStore } from '../../../stores/player/player.store';
import { PlayerStoreData } from '../../../stores/player/player-store.data';
import { filter, from, map, mergeMap, Observable, of, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { readFile } from '@tauri-apps/plugin-fs';

@Component({
  selector: 'app-toolbar',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    CommonModule
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  standalone: true
})
export class ToolbarComponent {
  // TODO: Use signals
  playerData$: Observable<PlayerStoreData>;

  @ViewChild('audio', { static: false }) audio: ElementRef;

  constructor(playerStore: PlayerStore) {
    this.playerData$ = playerStore.states$.pipe(map((s) => s.data));

    this.playerData$
      .pipe(
        filter((d) => !!d.song?.filePath),
        mergeMap((d) => {
          if (d.song?.filePath) {
            return from(readFile(d.song?.filePath))
          } else {
            return of();
          }
        }),
        tap((fileContents: Uint8Array) => {
          const blob = new Blob([fileContents], { type: "audio/mp3" });
          this.audio.nativeElement.src = window.URL.createObjectURL(blob);
        })
      )
      .subscribe();
  }

  play(): void {
    this.audio.nativeElement.play();
  }
}
