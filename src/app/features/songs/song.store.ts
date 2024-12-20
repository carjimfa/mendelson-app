import { Injectable } from "@angular/core";
import { Store } from "../../stores/store";
import { SongStoreData, SongStoreEvent } from "./song-store-data";

@Injectable({
    providedIn: 'root'
})
export class SongStore extends Store<SongStoreEvent, SongStoreData> {
    constructor() {
        const initialData = {
            songs: []
        };

        super(SongStoreEvent.initialized, initialData);
    }
}