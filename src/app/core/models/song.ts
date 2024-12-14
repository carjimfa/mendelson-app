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
    codec?: string;

    get genres(): Array<string> {
        return this.genre?.split('##') ?? [];
    }

    get artistsList(): Array<string> {
        return this.artists?.split('##') ?? [];
    }

    get durationFormated(): string {
        if (this.duration) {
            const minutes = Math.floor(this.duration / 60);
            const rawSeconds = this.duration - minutes * 60;
            const seconds = rawSeconds < 10 ? `0${Math.floor(rawSeconds)}` : `${Math.floor(rawSeconds)}`;
            return `${minutes}:${seconds}`;
        }

        return '0:00';
    }

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
        this.codec = metadata.codec;
    }
}