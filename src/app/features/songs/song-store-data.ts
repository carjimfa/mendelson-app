import { Song } from "../../core/models/song";

export class SongStoreData {
    songs: Array<Song>;
}

export enum SongStoreEvent {
    initialized = 'initialized',
    loadSongs = 'load-songs'
}