import { Injectable } from '@angular/core';
import { concatAll, filter, from, map, mergeAll, mergeMap, Observable, take } from 'rxjs';
import { open } from '@tauri-apps/plugin-dialog';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() { }

  openFileSelectorDialog(): Observable<Array<string>> {
    const file$ = from(
      open({
        multiple: true,
        directory: false,
        filters: [
          {
            name: 'Only music files',
            extensions: [
              'mp3', 'm4a'
            ]
          }
        ]
      })
    );

    return file$
      .pipe(
        take(1),
        filter((filePath: unknown) => filePath !== null),
        map((filePaths) => filePaths as Array<string>)
      );
  }
}
