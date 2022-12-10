import dayjs, { Dayjs } from 'dayjs';
import { MathUtils } from 'three';
import { EclipticCoordinates } from './coordinates/EclipticCoordinates';
import { EquatorialCoordinates } from './coordinates/EquatorialCoordinates';

const { atan2, asin, sin, cos, tan } = Math;
const { degToRad } = MathUtils;

export const eclipticToEquatorial = ({ λ, β }: EclipticCoordinates, date: Dayjs): EquatorialCoordinates => {
    const epoch = dayjs('2000-01-01 12:00:00.00');

    const T = date.diff(epoch, 'days', true) / 36525;

    const DE = T * (46.815 + T * (0.0006 - T * 0.00181));

    const ε = degToRad(23.439292 - (DE / 3600));

    let α = atan2(sin(λ) * cos(ε) - tan(β) * sin(ε), cos(λ));

    if (α < 0)
        α += 2 * Math.PI;

    return {
        α,
        δ: asin(sin(β) * cos(ε) + cos(β) * sin(ε) * sin(λ)),
    };
};
