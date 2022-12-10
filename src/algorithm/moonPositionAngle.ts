import { EquatorialCoordinates } from './coordinates/EquatorialCoordinates';

const { atan2, cos, sin } = Math;

export const moonPositionAngle = (sun: EquatorialCoordinates, moon: EquatorialCoordinates): number => (
    atan2(
        sin(sun.δ) * sin(sun.α - moon.α),
        cos(moon.δ) * sin(sun.δ) - sin(moon.δ) * cos(sun.δ) * cos(sun.α - moon.α),
    )
);
