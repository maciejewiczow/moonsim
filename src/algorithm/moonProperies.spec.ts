import dayjs from 'dayjs';
import { expect } from 'chai';
import { MathUtils } from 'three';
import { moonProperies } from './moonProperies';

const { radToDeg } = MathUtils;

describe('moonProperies', () => {
    it('calculates the moon coordinates correctly for the example from the book', () => {
        const date = dayjs('2003-09-01 00:00:00');

        const { coords } = moonProperies(date);

        const { α, δ } = coords;

        expect(radToDeg(α)).to.be.closeTo(213.17614932634103, 5e-3);
        expect(radToDeg(δ)).to.be.closeTo(-11.52729751, 5e-3);
    });
});
