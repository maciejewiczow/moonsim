import { moonAnglesAndRelativeSize } from 'algorithm/moonAnglesAndRelativeSize';
import dayjs, { Dayjs } from 'dayjs';
import { makeAutoObservable } from 'mobx';

class Moon {
    minDate = dayjs().subtract(1, 'month');
    maxDate = dayjs().add(1, 'month');
    date = dayjs();
    isAutoUpdating = true;

    constructor() {
        makeAutoObservable(this);
        setInterval(() => {
            if (this.isAutoUpdating)
                this.setDateToCurrent();
        }, 1000 * 60);
    }

    setIsAutoUpdating(val: boolean) {
        this.isAutoUpdating = val;
    }

    setDateToCurrent() {
        this.date = dayjs();
    }

    setMinDate(d: Dayjs) {
        this.minDate = d;
    }

    setMaxDate(d: Dayjs) {
        this.maxDate = d;
    }

    setDate(d: Dayjs) {
        this.date = d;
    }

    get properties() {
        return moonAnglesAndRelativeSize(this.date);
    }
}

export const moon = new Moon();
