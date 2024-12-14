import { Injectable } from "@angular/core";
import { Store } from "../../stores/store";
import { SongStoreData } from "./song-store-data";

@Injectable({
    providedIn: 'root'
})
export class SongStore extends Store<SongStoreData> {
    constructor() {
        const initialData = {
            songs: []
        };

        super(initialData);
    }
}