export class Song {
    fileName: string;
    fileType: string;
    fileSize: number;
    lastModified: number;

    album?: string;
    albumArtist?: string;
    artist?: string;
    artists?: Array<string>;
    title?: string;
    track?: Track;
    year?: number;
    genre?: Array<string>;

    constructor(values: Partial<Song>) {
        Object.assign(this, values);
    }
}

export class Track {
    no: number | null;
    of: number | null;
}