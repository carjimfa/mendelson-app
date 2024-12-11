import { SongMetadata } from "./song.metadata";

export class Song {
    id: number;
    filePath: string;
    addedOn: Date;
    modifiedOn: Date;
    timesPlayed = 0;
    rating = 0;
    isFavorite = false;

    album?: string;
    albumArtist?: string;
    artist?: string;
    artists?: string;
    title?: string;
    trackOf?: number | null;
    trackNo?: number | null;
    year?: number;
    genre?: string;
    duration?: number;

    constructor(values: Partial<Song>) {
        Object.assign(this, values);
    }

    mapFromMetadata(metadata: SongMetadata): void {
        this.album = metadata.album;
        this.albumArtist = metadata.albumArtist;
        this.artist = metadata.artist;
        this.artists = metadata.artists?.join("##");
        this.title = metadata.title;
        this.trackOf = metadata.track?.of;
        this.trackNo = metadata.track?.no;
        this.year = metadata.year;
        this.genre = metadata.genre?.join("##");
        this.duration = metadata.duration;
    }
}