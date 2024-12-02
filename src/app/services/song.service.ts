import { Injectable } from "@angular/core";
import * as mm from 'music-metadata';
import { from, map, Observable } from "rxjs";
import { SongMetadata } from "../core/models/song.metadata";

@Injectable({
    providedIn: 'root'
})
export class SongService {
    getMetadata(file: File): Observable<SongMetadata> {
        return from(mm.parseBlob(file))
            .pipe(
                map((data) => new SongMetadata({
                    album: data.common.album,
                    albumArtist: data.common.albumartist,
                    artist: data.common.artist,
                    artists: data.common.artists,
                    fileName: file.name,
                    fileSize: file.size,
                    fileType: file.type,
                    genre: data.common.genre,
                    lastModified: file.lastModified,
                    title: data.common.title,
                    track: {
                        of: data.common.track.of,
                        no: data.common.track.no
                    },
                    year: data.common.year
                    })
                )
            );
      }
}