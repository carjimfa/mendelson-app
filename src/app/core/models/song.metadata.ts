export class SongMetadata {
    fileName: string;
    fileType: string;
    fileSize: number;
    filePath: string;
    lastModified: number;

    album?: string;
    albumArtist?: string;
    artist?: string;
    artists?: Array<string>;
    title?: string;
    track?: Track;
    year?: number;
    genre?: Array<string>;
    duration?: number;

    constructor(values: Partial<SongMetadata>) {
        Object.assign(this, values);
    }
}

export class Track {
    no: number | null;
    of: number | null;
}
