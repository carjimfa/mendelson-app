import { from, map, mergeMap, Observable, take, tap } from "rxjs";
import { Song } from "../core/models/song";
import Database, { QueryResult } from "@tauri-apps/plugin-sql";
import { Album } from "../core/models/album";
import { DbQueryBuilder } from "../core/db-query-builder";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    getSongs(): Observable<Array<Song>> {
        const db$ = from(Database.load("sqlite:test.db"));

        const queryBuilder = new DbQueryBuilder();
        queryBuilder.select('songs');

        return db$.pipe(
            take(1),
            mergeMap((db) => {
                return from(db.select<Song[]>(queryBuilder.build()));
            }),
            map((songs) => songs.map((s) => new Song(s)))
        );
    }

    songExists(song: Song): Observable<boolean> {
        const db$ = from(Database.load("sqlite:test.db"));
        const queryBuilder = new DbQueryBuilder();

        queryBuilder
            .select('songs', ['id'])
            .where('title', 'LIKE', song.title)
            .where('album', 'LIKE', song.album)
            .where('albumArtist', 'LIKE', song.albumArtist)
            .build();

        return db$.pipe(
            take(1),
            mergeMap((db) => {
                return from(db.select<Song[]>(queryBuilder.query));
            }),
            map((songs) => !!songs && songs.length > 0)
        );
    }

    createSong(song: Song): Observable<QueryResult> {
        const db$ = from(Database.load("sqlite:test.db"));

        const queryBuilder = new DbQueryBuilder();
        queryBuilder.insert(
            'songs',
            [
                'filePath',
                'addedOn',
                'modifiedOn',
                'timesPlayed',
                'rating',
                'isFavorite',
                'album',
                'albumArtist',
                'artist',
                'artists',
                'title',
                'trackOf',
                'trackNo',
                'year',
                'genre',
                'duration',
                'codec'
            ]
        );

        const inputValues = [
            song.filePath,
            song.addedOn,
            song.modifiedOn,
            song.timesPlayed,
            song.rating,
            song.isFavorite,
            song.album,
            song.albumArtist,
            song.artist,
            song.artists,
            song.title,
            song.trackOf,
            song.trackNo,
            song.year,
            song.genre,
            song.duration,
            song.codec
        ];

        console.log(inputValues)

        return db$.pipe(
            take(1),
            mergeMap((db) => {
                return from(
                    db.execute(
                        queryBuilder.build(),
                        inputValues
                    )
                );
            })
        );
    }

    getAlbums(): Observable<Array<Album>> {
        const db$ = from(Database.load("sqlite:test.db"));

        const builder = new DbQueryBuilder();

        builder.select('songs', ['album as title', 'MAX(albumArtist) as albumArtist'])
            .groupBy('album');

        return db$.pipe(
            take(1),
            mergeMap((db) => {
                return from(db.select<Album[]>("SELECT album as title, MAX(albumArtist) as albumArtist FROM songs GROUP BY album"));
            })
        );
    }
}