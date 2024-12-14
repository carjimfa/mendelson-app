import { Injectable } from "@angular/core";
import * as mm from 'music-metadata';
import { from, map, mergeMap, Observable, take } from "rxjs";
import { SongMetadata } from "../core/models/song.metadata";
import { readFile } from '@tauri-apps/plugin-fs';
import { Song } from "../core/models/song";
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
                map((data) => {
                    console.log('raw data');
                    console.log(data)
                    return new SongMetadata({
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
                        duration: data.format.duration,
                        codec: data.format.codec
                    })
                }
                )
            );
    }

    getMetadataFromBuffer(file: Uint8Array): Observable<SongMetadata> {
        return from(mm.parseBuffer(file))
            .pipe(
                map(
                    (data) => {
                        console.log('raw data');
                        console.log(data)

                        return this.mapAudioMetadataToSongMetadata(data);
                    }
                )
            );
    }

    mapAudioMetadataToSongMetadata(audioMetadata: any): SongMetadata {
        return new SongMetadata({
            album: audioMetadata.common.album,
            albumArtist: audioMetadata.common.albumartist,
            artist: audioMetadata.common.artist,
            artists: audioMetadata.common.artists,
            genre: audioMetadata.common.genre,
            title: audioMetadata.common.title,
            track: {
                of: audioMetadata.common.track.of,
                no: audioMetadata.common.track.no
            },
            year: audioMetadata.common.year,
            duration: audioMetadata.format.duration,
            codec: audioMetadata.format.codec
        })
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
}