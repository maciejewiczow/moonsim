import dayjs, { Dayjs } from 'dayjs';
import { MathUtils } from 'three';
import { sunLongitudeAndMeanAnomaly } from './sunEquitorialCoordinates';
import { eclipticToEquatorial } from './eclipticToEquatorial';

const { sin, cos, asin, atan2 } = Math;
const { degToRad, radToDeg } = MathUtils;

export const moonProperies = (date: Dayjs, { M, λ: λSun } = sunLongitudeAndMeanAnomaly(date)) => {
    const epoch = dayjs('2009-12-31 00:00:00');

    const D = date.diff(epoch, 'days', true);

    const l0 = 91.929336; // degrees
    const P0 = 130.143076; // degrees
    const N0 = 291.682547; // degrees
    const i = 5.145396; // degrees

    const Lm = (13.1763966 * D + l0) % 360;
    const Mm = (Lm - 0.1114041 * D - P0) % 360;
    const N = (N0 - 0.0529539 * D) % 360;

    const Ev = 1.2739 * sin(degToRad(2 * (Lm - λSun) - Mm));
    const Ae = 0.1858 * sin(M);
    const A3 = 0.37 * sin(M);
    const MPrimM = Mm + Ev - Ae - A3;

    const Ec = 6.2886 * sin(degToRad(MPrimM));
    const A4 = 0.214 * sin(2 * degToRad(MPrimM));
    const LPrim = Lm + Ev + Ec - Ae + A4;

    const V = 0.6583 * sin(2 * degToRad(LPrim - λSun));
    const LPrimPrim = LPrim + V;
    const Nd = N - 0.16 * sin(M);
    const u = degToRad(LPrimPrim - Nd);

    const y = sin(u) * cos(degToRad(i));
    const x = cos(u);

    const λ = (radToDeg(atan2(y, x)) + Nd) % 360;
    const β = asin(sin(u) * sin(degToRad(i)));

    return {
        coords: eclipticToEquatorial({ λ: degToRad(λ), β }, date),
        phaseAngle: degToRad(λ - λSun),
        MPrimM,
        Ec,
    };
};
