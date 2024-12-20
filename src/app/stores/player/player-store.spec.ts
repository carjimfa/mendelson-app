import { TestBed } from "@angular/core/testing";
import { PlayerStore } from "./player.store";

describe('PlayerStore', () => {
    let service: PlayerStore;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: []
        });
        service = TestBed.inject(PlayerStore);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should shuffle songs', () => {
        const order = Array.from(new Array<number>(20).keys());
        const index = 12;
        const shuffleSongs = service.shuffleOrder(order, index);

        expect(shuffleSongs[0]).toBe(index);
        expect(order.length).toBe(shuffleSongs.length);
    })
});