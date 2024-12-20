import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { PlayerComponent } from "../player/player.component";
import { AudioComponent } from "../audio/audio.component";

@Component({
  selector: 'app-toolbar',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    CommonModule,
    PlayerComponent,
    AudioComponent
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  standalone: true
})
export class ToolbarComponent {

}
