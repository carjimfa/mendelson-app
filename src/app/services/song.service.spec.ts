import { TestBed } from "@angular/core/testing";
import { SongService } from "./song.service";
import { ApiService } from "./api.service";
import { ApiMockService } from "../mocks/api-mock.service";
import metadata from "../mocks/song-metadata.json";
import { Song } from "../core/models/song";

describe('SongService', () => {
    let service: SongService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: ApiService,
                    useValue: new ApiMockService()
                }
            ]
        });
        service = TestBed.inject(SongService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should map artists', () => {
        var songMetadata = service.mapAudioMetadataToSongMetadata(metadata);
        expect(songMetadata.artists).toEqual(["3KZ"]);
    });

    it('should map codec', () => {
        var songMetadata = service.mapAudioMetadataToSongMetadata(metadata);
        expect(songMetadata.codec).toEqual("ALAC");
    });

    it('should map codec in song', () => {
        var songMetadata = service.mapAudioMetadataToSongMetadata(metadata);
        const song = new Song(
            {
                addedOn: new Date(Date.now()),
                modifiedOn: new Date(Date.now()),
                timesPlayed: 0,
                rating: 0,
                isFavorite: false
            });

        song.mapFromMetadata(songMetadata);

        expect(song.codec).toEqual("ALAC");
    });
});