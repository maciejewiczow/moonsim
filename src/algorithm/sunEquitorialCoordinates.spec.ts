import dayjs from 'dayjs';
import { expect } from 'chai';
import { MathUtils } from 'three';
import { sunEquitorialCoordinates } from './sunEquitorialCoordinates';

const { radToDeg } = MathUtils;

describe('sunEquitorialCoordinates', () => {
    it('calculates the coordinates correctly for the example from the book', () => {
        const date = dayjs('2003-07-27');

        const { α, δ } = sunEquitorialCoordinates(date);

        expect(radToDeg(α)).to.be.closeTo(125.8905256, 5e-3);
        expect(radToDeg(δ)).to.be.closeTo(19.35398081, 5e-3);
    });
});
