import { action, makeObservable, observable } from 'mobx';

class Moon {
    @observable
    angle = Math.PI;

    constructor() {
        makeObservable(this);
    }

    @action
    setAngle = (a: number) => { this.angle = a; };
}

export const moon = new Moon();
