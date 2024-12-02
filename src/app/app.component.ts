import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ToolbarComponent } from './shared/components/toolbar/toolbar.component';
import { SidebarComponent } from "./shared/components/sidebar/sidebar.component";
import { SongService } from './services/song.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatSidenavModule,
    ToolbarComponent,
    SidebarComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true
})
export class AppComponent {
  title = 'mendelson-app';
  showFiller = false;

  constructor(private readonly songService: SongService) {}

  analyze(file: File) {
    this.songService.getMetadata(file).subscribe((song) => console.log(song));
  }

  onFileSelected(event: any): void {
    const files = event.target.files as FileList;

    for(let i = 0; i<files.length; i++) {
      const file = files.item(i);

      if (file !== null) {
        this.analyze(file);
      }
    }
  }
}
