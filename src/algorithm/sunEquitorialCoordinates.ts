import dayjs, { Dayjs } from 'dayjs';
import { MathUtils } from 'three';
import { eclipticToEquatorial } from './eclipticToEquatorial';

const { degToRad } = MathUtils;

export interface LongitudeAndMeanAnomaly {
    λ: number;
    M: number;
}

export const sunLongitudeAndMeanAnomaly = (date: Dayjs): LongitudeAndMeanAnomaly => {
    const epoch = dayjs('2009-12-31 00:00:00');
    const εg = 279.557208; // [deg]
    const ϖg = 283.112438; // [deg]
    const e = 0.016705;

    const D = dayjs(date).diff(epoch, 'days', true);
    const N = (360 / 365.242191) * D;
    let M = (N + εg - ϖg) % 360;

    if (M < 0)
        M += 360;

    const Ec = (360 / Math.PI) * e * Math.sin(degToRad(M));

    let λ = (N + Ec + εg) % 360;

    if (λ < 0)
        λ += 360;

    return { λ, M };
};

export const sunEquitorialCoordinates = (date: Dayjs, { λ } = sunLongitudeAndMeanAnomaly(date)) => (
    eclipticToEquatorial({ λ: degToRad(λ), β: 0 }, date)
);
