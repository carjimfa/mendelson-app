import { Injectable } from "@angular/core";
import * as mm from 'music-metadata';
import { concatAll, filter, from, map, mergeAll, mergeMap, Observable, take } from "rxjs";
import { SongMetadata } from "../core/models/song.metadata";
import { readFile } from '@tauri-apps/plugin-fs';
import { Song } from "../core/models/song";
import { open } from '@tauri-apps/plugin-dialog';
import { ApiService } from "./api.service";

@Injectable({
    providedIn: 'root'
})
export class SongService {
    constructor(
        private readonly apiService: ApiService
    ) { }

    getMetadataFromFile(file: File): Observable<SongMetadata> {
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
                    year: data.common.year,
                    duration: data.format.duration
                })
                )
            );
    }

    getMetadataFromBuffer(file: Uint8Array): Observable<SongMetadata> {
        return from(mm.parseBuffer(file))
            .pipe(
                map(
                    (data) => new SongMetadata({
                        album: data.common.album,
                        albumArtist: data.common.albumartist,
                        artist: data.common.artist,
                        artists: data.common.artists,
                        genre: data.common.genre,
                        title: data.common.title,
                        duration: data.format.duration,
                        track: {
                            of: data.common.track.of,
                            no: data.common.track.no
                        },
                        year: data.common.year
                    })
                )
            );
    }

    analyzeSong(filePath: string): Observable<Song> {
        return from(readFile(filePath))
            .pipe(
                take(1),
                mergeMap((fileContents) => {
                    return this.getMetadataFromBuffer(fileContents)
                }),
                map((songMetadata) => {
                    const song = new Song(
                        {
                            filePath,
                            addedOn: new Date(Date.now()),
                            modifiedOn: new Date(Date.now()),
                            timesPlayed: 0,
                            rating: 0,
                            isFavorite: false
                        });

                    song.mapFromMetadata(songMetadata);
                    return song;
                })
            );
    }

    // TODO: Move to a file service where you pass only the fact that you want to select a song file type
    openFileSelectorDialog(multiple = false): void {
        const file$ = from(
            open({
                multiple,
                directory: false,
            })
        );

        const filePaths$ = file$
            .pipe(
                take(1),
                filter((filePath: unknown) => filePath !== null),
                map((filePaths) => filePaths as Array<string>)
            );

        filePaths$
            .pipe(
                map((filePaths) => filePaths.map((c) => this.analyzeSong(c))),
                concatAll(),
                mergeAll(),
                mergeMap((song) => {
                    return this.apiService.createSong(song);
                })
            )
            .subscribe((data) => console.log(data));
    }
}