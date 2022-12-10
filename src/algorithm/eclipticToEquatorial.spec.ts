import dayjs from 'dayjs';
import { expect } from 'chai';
import { MathUtils } from 'three';
import { eclipticToEquatorial } from './eclipticToEquatorial';

const { degToRad, radToDeg } = MathUtils;

const hoursToRad = (h: number, m: number, s: number): number => {
    const base = dayjs('2022-01-01 05:00:00');

    return degToRad(
        base.add(h, 'hours').add(m, 'minutes').add(s, 'seconds').diff(base, 'hours', true) * 15.0,
    );
};

describe('eclipticToEquatorial', () => {
    it('converts the coords correctly for the example from the book', () => {
        const λ = 2.437982558;
        const β = 0.085089659;

        const { α, δ } = eclipticToEquatorial({ λ, β }, dayjs('2009-07-06'));

        expect(α).to.be.closeTo(2.508430994, 5e-5);
        expect(δ).to.be.closeTo(0.340962273, 5e-5);
    });

    it('converts the coords from moon position example correctly', () => {
        const λ = degToRad(214.8675028);
        const β = degToRad(1.716074358);

        const { α, δ } = eclipticToEquatorial({ λ, β }, dayjs('2003-09-01 00:00:00'));

        expect(radToDeg(α)).to.be.closeTo(14.21175359 * 15, 5e-3);
        expect(radToDeg(δ)).to.be.closeTo(-11.52729751, 5e-3);
    });

    [
        { λ: 0, β: 0, α: 0, δ: 0 },
        { λ: hoursToRad(1, 2, 5), β: degToRad(21.61667), α: 0.090958, δ: 0.452205 },
        { λ: hoursToRad(21, 37, 69), β: degToRad(42.125), α: 5.452385, δ: 0.460324 },
    ].forEach(({ λ, β, α: αExpected, δ: δExcpected }) => {
        it('converts the coords correctly for the date of writing this test', () => {
            const date = dayjs('2022-04-12 20:32:00');

            const { α, δ } = eclipticToEquatorial({ λ, β }, date);

            expect(α).to.be.closeTo(αExpected, 5e-5);
            expect(δ).to.be.closeTo(δExcpected, 5e-5);
        });
    });
});
