import { Dayjs } from 'dayjs';
import { moonProperies } from './moonProperies';
import { moonPositionAngle } from './moonPositionAngle';
import { sunEquitorialCoordinates, sunLongitudeAndMeanAnomaly } from './sunEquitorialCoordinates';
import { moonRelativeSize } from './moonRelativeSize';

export const moonAnglesAndRelativeSize = (date: Dayjs) => {
    const λAndM = sunLongitudeAndMeanAnomaly(date);

    const sunPos = sunEquitorialCoordinates(date, λAndM);
    const { coords: moonPos, phaseAngle, Ec, MPrimM } = moonProperies(date, λAndM);

    const positionAngle = moonPositionAngle(sunPos, moonPos);
    const relativeSize = moonRelativeSize(Ec, MPrimM);

    return {
        phaseAngle,
        positionAngle,
        relativeSize,
    };
};
