import { BehaviorSubject, Observable } from "rxjs";

export class Store<T> {
    states$: Observable<StoreState<T>>;
    private _states$: BehaviorSubject<StoreState<T>>;

    constructor(initialData: T) {
        this._states$ = new BehaviorSubject({ data: initialData });
        this.states$ = this._states$.asObservable();
    }

    setState(newState: StoreState<T>): void {
        const state = {
            ...this._states$.value,
            ...newState
        };

        this._states$.next(state);
    }
}

export class StoreState<T> {
    data: T;

    constructor(values: Partial<StoreState<T>>) {
        Object.assign(this, values);
    }
}