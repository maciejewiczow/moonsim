/* eslint-disable no-mixed-operators */
/* eslint-disable no-constant-condition */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-properties */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-const */
import { Dayjs } from 'dayjs';

const RAD_TO_DEG = 180.0 / Math.PI;
const DEG_TO_RAD = 1.0 / RAD_TO_DEG;
const AU = 149597870.691;
const EARTH_RADIUS = 6378.1366;
const TWO_PI = 2.0 * Math.PI;
const PI_OVER_TWO = Math.PI / 2.0;
const JULIAN_DAYS_PER_CENTURY = 36525.0;
const SECONDS_PER_DAY = 86400;
const J2000 = 2451545.0;

export enum TWILIGHT {
    ASTRONOMICAL = 4,
    CIVIL = 2,
    HORIZON_34arcmin = 1,
    NAUTICAL = 3,
}

export enum EVENT {
    RISE,
    SET,
    TRANSIT,
}

export const body = {
    EMB: [2, 0],
    jupiter: [4, 71492],
    mars: [3, 3396.19],
    mercury: [0, 2439.7],
    moon: [-2, 1737.4],
    neptune: [7, 24764],
    saturn: [5, 60268],
    sun: [-1, 696000],
    uranus: [6, 25559],
    venus: [1, 6051.8],
};

type TBody = typeof body;

const eqBodyRadius = (val: TBody[keyof TBody]) => val[1];

class Ephemeris {
    constructor(
        public angR = 0,
        public azimuth = 0,
        public declination = 0,
        public distance = 0,
        public eclipticLatitude = 0,
        public eclipticLongitude = 0,
        public elevation = 0,
        public illuminationPhase = 100,
        public rightAscension = 0,
        public rise = 0,
        public set = 0,
        public transit = 0,
        public transitElevation = 0,
    ) { }
}

const toJulianDay = (date: Dayjs) => {
    let julian = false;

    // eslint-disable-next-line no-mixed-operators
    if (date.year() < 1582 || date.year() === 1582 && date.month() < 10 || date.year() === 1582 && date.month() === 10 && date.day() < 15)
        julian = true;

    const D = date.day();
    let M = date.month();
    let Y = date.year();

    if (M < 3) {
        Y -= 1;
        M += 12;
    }

    const A = Math.floor(Y / 100);

    let B;
    if (julian === true)
        B = 0;
    else
        B = 2 - A + A / 4;

    B = Math.floor(B);
    const dayFraction = (date.hour() + (date.minute() + date.second() / 60.0) / 60.0) / 24.0;
    return dayFraction + Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + D + B - 1524.5;
};

function normalizeRadians(r: number) {
    if (r < 0 && r >= -TWO_PI)
        return r + TWO_PI;

    if (r >= TWO_PI && r < 2 * TWO_PI)
        return r - TWO_PI;

    if (r >= 0 && r < TWO_PI)
        return r;

    r -= TWO_PI * Math.floor(r / TWO_PI);

    if (r < 0.0)
        r += TWO_PI;

    return r;
}

const sunElements = [
    [403406.0, 0.0, 4.721964, 1.621043],
    [195207.0, -97597.0, 5.937458, 62830.348067],
    [119433.0, -59715.0, 1.115589, 62830.821524],
    [112392.0, -56188.0, 5.781616, 62829.634302],
    [3891.0, -1556.0, 5.5474, 125660.5691],
    [2819.0, -1126.0, 1.512, 125660.9845],
    [1721.0, -861.0, 4.1897, 62832.4766],
    [0.0, 941.0, 1.163, 0.813],
    [660.0, -264.0, 5.415, 125659.31],
    [350.0, -163.0, 4.315, 57533.85],
    [334.0, 0.0, 4.553, -33.931],
    [314.0, 309.0, 5.198, 777137.715],
    [268.0, -158.0, 5.989, 78604.191],
    [242.0, 0.0, 2.911, 5.412],
    [234.0, -54.0, 1.423, 39302.098],
    [158.0, 0.0, 0.061, -34.861],
    [132.0, -93.0, 2.317, 115067.698],
    [129.0, -20.0, 3.193, 15774.337],
    [114.0, 0.0, 2.828, 5296.67],
    [99.0, -47.0, 0.52, 58849.27],
    [93.0, 0.0, 4.65, 5296.11],
    [86.0, 0.0, 4.35, -3980.7],
    [78.0, -33.0, 2.75, 52237.69],
    [72.0, -32.0, 4.5, 55076.47],
    [68.0, 0.0, 3.23, 261.08],
    [64.0, -10.0, 1.22, 15773.85],
    [46.0, -16.0, 0.14, 188491.03],
    [38.0, 0.0, 3.44, -7756.55],
    [37.0, 0.0, 4.37, 264.89],
    [32.0, -24.0, 1.14, 117906.27],
    [29.0, -13.0, 2.84, 55075.75],
    [28.0, 0.0, 5.96, -7961.39],
    [27.0, -9.0, 5.09, 188489.81],
    [27.0, 0.0, 1.72, 2132.19],
    [25.0, -17.0, 2.56, 109771.03],
    [24.0, -11.0, 1.92, 54868.56],
    [21.0, 0.0, 0.09, 25443.93],
    [21.0, 31.0, 5.98, -55731.43],
    [20.0, -10.0, 4.03, 60697.74],
    [18.0, 0.0, 4.27, 2132.79],
    [17.0, -12.0, 0.79, 109771.63],
    [14.0, 0.0, 4.24, -7752.82],
    [13.0, -5.0, 2.01, 188491.91],
    [13.0, 0.0, 2.65, 207.81],
    [13.0, 0.0, 4.98, 29424.63],
    [12.0, 0.0, 0.93, -7.99],
    [10.0, 0.0, 2.21, 46941.14],
    [10.0, 0.0, 3.59, -68.29],
    [10.0, 0.0, 1.5, 21463.25],
    [10.0, -9.0, 2.55, 157208.4],
];

function computeGeometricElevation(alt: number) {
    let Ps; let Ts; let altDeg; let r; let
        refr;
    Ps = 1010;
    Ts = 10 + 273.15;
    altDeg = alt * RAD_TO_DEG;
    r = DEG_TO_RAD * Math.abs(Math.tan(PI_OVER_TWO - (altDeg + 7.31 / (altDeg + 4.4)) * DEG_TO_RAD)) / 60.0;
    refr = r * ((0.28 * Ps) / Ts);
    return Math.min(alt - refr, PI_OVER_TWO);
}

function refraction(alt: number) {
    let altIn; let altOut; let niter; let
        prevAlt;

    if (alt <= -3 * DEG_TO_RAD)
        return alt;

    altIn = alt;
    niter = 0;
    prevAlt = alt;

    while (true) {
        altOut = computeGeometricElevation(alt);
        alt = altIn - (altOut - alt);
        niter += 1;

        if (Math.abs(prevAlt - alt) < 0.001 * DEG_TO_RAD)
            break;

        prevAlt = alt;

        if (niter < 8)
            break;
    }

    return alt;
}

export class SunMoonCalculator {
    private TTminusUT = 0;
    private twilight = TWILIGHT.HORIZON_34arcmin;
    private jd_UT = 0;
    private t = 0;
    private nutLon = 0;
    private nutObl = 0;
    private meanObliquity = 0;
    private lst = 0;
    private td = 0;

    public sun = new Ephemeris();
    public moon = new Ephemeris();
    public mMoonAge = 0;

    get moonAge() {
        return this.mMoonAge;
    }

    private set moonAge(val: number) {
        this.mMoonAge = val;
    }

    constructor(
        private date: Dayjs,
        private obsLon: number,
        private obsLat: number,
        private obsAlt: number,
    ) {
        const jd = toJulianDay(this.date);

        if (this.date.year() > -600 && this.date.year() < 2200) {
            const x = this.date.year() + (this.date.month() - 1 + this.date.day() / 30.0) / 12.0;
            const x2 = x * x;
            const x3 = x2 * x;
            const x4 = x3 * x;

            if (this.date.year() < 1600)
                // eslint-disable-next-line max-len
                this.TTminusUT = 10535.328003 - 9.9952386275 * x + 0.00306730763 * x2 - 7.7634069836e-06 * x3 + 3.1331045394e-09 * x4 + 8.2255308544e-12 * x2 * x3 - 7.4861647156e-15 * x4 * x2 + 1.936246155e-18 * x4 * x3 - 8.4892249378e-23 * x4 * x4;
            else
                // eslint-disable-next-line max-len
                this.TTminusUT = -1027175.3477559977 + 2523.256625418965 * x - 1.885686849058459 * x2 + 5.869246227888417e-05 * x3 + 3.3379295816475025e-07 * x4 + 1.7758961671447929e-10 * x2 * x3 - 2.7889902806153024e-13 * x2 * x4 + 1.0224295822336825e-16 * x3 * x4 - 1.2528102370680435e-20 * x4 * x4;
        }

        this.setUTDate(jd);
    }

    setTwilight(t: TWILIGHT) {
        this.twilight = t;
    }

    private setUTDate(jd: number) {
        this.jd_UT = jd;
        this.t = (jd + this.TTminusUT / SECONDS_PER_DAY - J2000) / JULIAN_DAYS_PER_CENTURY;
        const M1 = (124.9 - 1934.134 * this.t + 0.002063 * this.t * this.t) * DEG_TO_RAD;
        const M2 = (201.11 + 72001.5377 * this.t + 0.00057 * this.t * this.t) * DEG_TO_RAD;
        this.nutLon = (-0.0047785 * Math.sin(M1) - 0.0003667 * Math.sin(M2)) * DEG_TO_RAD;
        this.nutObl = (0.002558 * Math.cos(M1) - 0.00015339 * Math.cos(M2)) * DEG_TO_RAD;
        const t2 = this.t / 100.0;
        let tmp = t2 * (27.87 + t2 * (5.79 + t2 * 2.45));
        tmp = t2 * (-249.67 + t2 * (-39.05 + t2 * (7.12 + tmp)));
        tmp = t2 * (-1.55 + t2 * (1999.25 + t2 * (-51.38 + tmp)));
        tmp = (t2 * (-4680.93 + tmp)) / 3600.0;
        this.meanObliquity = (23.4392911111111 + tmp) * DEG_TO_RAD;
        const jd0 = Math.floor(this.jd_UT - 0.5) + 0.5;
        const T0 = (jd0 - J2000) / JULIAN_DAYS_PER_CENTURY;
        const secs = (this.jd_UT - jd0) * SECONDS_PER_DAY;
        let gmst = ((-6.2e-06 * T0 + 0.093104) * T0 + 8640184.812866) * T0 + 24110.54841;
        const msday = 1.0 + ((-1.86e-05 * T0 + 0.186208) * T0 + 8640184.812866) / (SECONDS_PER_DAY * JULIAN_DAYS_PER_CENTURY);
        gmst = (gmst + msday * secs) * (15.0 / 3600.0) * DEG_TO_RAD;
        this.lst = normalizeRadians(gmst + this.obsLon + this.nutLon * Math.cos(this.meanObliquity + this.nutObl));
    }

    calcSunAndMoon() {
        const jd = this.jd_UT;
        this.sun = this.doCalc(this.getSun(), false);
        const niter = 15;
        this.sun.rise = this.obtainAccurateRiseSetTransit(this.sun.rise, EVENT.RISE, niter, true);
        this.sun.set = this.obtainAccurateRiseSetTransit(this.sun.set, EVENT.SET, niter, true);
        this.sun.transit = this.obtainAccurateRiseSetTransit(this.sun.transit, EVENT.TRANSIT, niter, true);

        if (this.sun.transit === -1) {
            this.sun.transitElevation = 0;
        } else {
            this.setUTDate(this.sun.transit);
            this.sun.transitElevation = this.doCalc(this.getSun(), false).transitElevation;
        }

        this.setUTDate(jd);
        this.moon = this.doCalc(this.getMoon(), false);
        this.moon.rise = this.obtainAccurateRiseSetTransit(this.moon.rise, EVENT.RISE, niter, false);
        this.moon.set = this.obtainAccurateRiseSetTransit(this.moon.set, EVENT.SET, niter, false);
        this.moon.transit = this.obtainAccurateRiseSetTransit(this.moon.transit, EVENT.TRANSIT, niter, false);

        if (this.moon.transit === -1) {
            this.moon.transitElevation = 0;
        } else {
            this.setUTDate(this.moon.transit);
            this.moon.transitElevation = this.doCalc(this.getMoon(), false).transitElevation;
        }

        this.setUTDate(jd);
        this.getIlluminationPhase(this.moon);
    }

    getSun() {
        let L; let Lp; let R; let aberration; let array; let deltat; let dlon; let lon; let sdistance; let slatitude; let slongitude; let t2; let t2p; let u; let up; let v; let
            vp;
        L = 0.0;
        R = 0.0;
        t2 = this.t * 0.01;
        Lp = 0.0;
        deltat = 0.5;
        t2p = (this.t + deltat / JULIAN_DAYS_PER_CENTURY) * 0.01;

        for (let i = 0, _pj_a = sunElements.length; i < _pj_a; i += 1) {
            v = sunElements[i][2] + sunElements[i][3] * t2;
            u = normalizeRadians(v);
            L += sunElements[i][0] * Math.sin(u);
            R += sunElements[i][1] * Math.cos(u);
            vp = sunElements[i][2] + sunElements[i][3] * t2p;
            up = normalizeRadians(vp);
            Lp += sunElements[i][0] * Math.sin(up);
        }

        lon = normalizeRadians(4.9353929 + normalizeRadians(62833.196168 * t2) + L / 10000000.0) * RAD_TO_DEG;
        sdistance = 1.0001026 + R / 10000000.0;
        dlon = ((Lp - L) / 10000000.0 + 62833.196168 * (t2p - t2)) / deltat;
        aberration = dlon * sdistance * 0.00577551833109;
        lon -= aberration * RAD_TO_DEG;
        slongitude = lon * DEG_TO_RAD;
        slatitude = 0;
        array = [slongitude, slatitude, sdistance, Math.atan(eqBodyRadius(body.sun) / (AU * sdistance))];
        return array;
    }

    getMoon() {
        let A; let B; let C; let E; let E2; let M1; let M2; let M3; let M4; let M5; let M6; let NA; let Psin; let S1; let S2; let S3; let S4; let W1; let W2; let anomaly; let array; let distance; let l; let latitude; let longitude; let node; let p; let phase; let qd; let sanomaly; let
            td2;
        this.td = this.t + 1;
        td2 = this.t * this.t;
        qd = this.td * JULIAN_DAYS_PER_CENTURY * 360.0;
        M1 = qd / 27.32158213;
        M2 = qd / 365.2596407;
        M3 = qd / 27.55455094;
        M4 = qd / 29.53058868;
        M5 = qd / 27.21222039;
        M6 = qd / 6798.363307;
        l = normalizeRadians((270.434164 + M1 - (0.001133 - 1.9e-06 * this.td) * td2) * DEG_TO_RAD);
        sanomaly = normalizeRadians((358.475833 + M2 - (0.00015 + 3.3e-06 * this.td) * td2) * DEG_TO_RAD);
        anomaly = normalizeRadians((296.104608 + M3 + (0.009192 + 1.44e-05 * this.td) * td2) * DEG_TO_RAD);
        phase = normalizeRadians((350.737486 + M4 - (0.001436 - 1.9e-06 * this.td) * td2) * DEG_TO_RAD);
        node = normalizeRadians((11.250889 + M5 - (0.003211 + 3e-07 * this.td) * td2) * DEG_TO_RAD);
        NA = normalizeRadians((259.183275 - M6 + (0.002078 + 2.2e-06 * this.td) * td2) * DEG_TO_RAD);
        A = DEG_TO_RAD * (51.2 + 20.2 * this.td);
        S1 = Math.sin(A);
        S2 = Math.sin(NA);
        B = 346.56 + (132.87 - 0.0091731 * this.td) * this.td;
        S3 = 0.003964 * Math.sin(DEG_TO_RAD * B);
        C = NA + DEG_TO_RAD * (275.05 - 2.3 * this.td);
        S4 = Math.sin(C);
        l = l * RAD_TO_DEG + (0.000233 * S1 + S3 + 0.001964 * S2);
        sanomaly -= 0.001778 * S1 * DEG_TO_RAD;
        anomaly += (0.000817 * S1 + S3 + 0.002541 * S2) * DEG_TO_RAD;
        node += (S3 - 0.024691 * S2 - 0.004328 * S4) * DEG_TO_RAD;
        phase += (0.002011 * S1 + S3 + 0.001964 * S2) * DEG_TO_RAD;
        E = 1 - (0.002495 + 7.52e-06 * this.td) * this.td;
        E2 = E * E;
        l += 6.28875 * Math.sin(anomaly) + 1.274018 * Math.sin(2 * phase - anomaly) + 0.658309 * Math.sin(2 * phase);
        l += 0.213616 * Math.sin(2 * anomaly) - E * 0.185596 * Math.sin(sanomaly) - 0.114336 * Math.sin(2 * node);
        l += 0.058793 * Math.sin(2 * phase - 2 * anomaly) + 0.057212 * E * Math.sin(2 * phase - anomaly - sanomaly) + 0.05332 * Math.sin(2 * phase + anomaly);
        l += 0.045874 * E * Math.sin(2 * phase - sanomaly) + 0.041024 * E * Math.sin(anomaly - sanomaly) - 0.034718 * Math.sin(phase) - E * 0.030465 * Math.sin(sanomaly + anomaly);
        l += 0.015326 * Math.sin(2 * (phase - node)) - 0.012528 * Math.sin(2 * node + anomaly) - 0.01098 * Math.sin(2 * node - anomaly) + 0.010674 * Math.sin(4 * phase - anomaly);
        l += 0.010034 * Math.sin(3 * anomaly) + 0.008548 * Math.sin(4 * phase - 2 * anomaly);
        l += -E * 0.00791 * Math.sin(sanomaly - anomaly + 2 * phase) - E * 0.006783 * Math.sin(2 * phase + sanomaly) + 0.005162 * Math.sin(anomaly - phase) + E * 0.005 * Math.sin(sanomaly + phase);
        l += 0.003862 * Math.sin(4 * phase) + E * 0.004049 * Math.sin(anomaly - sanomaly + 2 * phase) + 0.003996 * Math.sin(2 * (anomaly + phase)) + 0.003665 * Math.sin(2 * phase - 3 * anomaly);
        l += E * 0.002695 * Math.sin(2 * anomaly - sanomaly) + 0.002602 * Math.sin(anomaly - 2 * (node + phase));
        l += E * 0.002396 * Math.sin(2 * (phase - anomaly) - sanomaly) - 0.002349 * Math.sin(anomaly + phase);
        l += E * E * 0.002249 * Math.sin(2 * (phase - sanomaly)) - E * 0.002125 * Math.sin(2 * anomaly + sanomaly);
        l += -E * E * 0.002079 * Math.sin(2 * sanomaly) + E * E * 0.002059 * Math.sin(2 * (phase - sanomaly) - anomaly);
        l += -0.001773 * Math.sin(anomaly + 2 * (phase - node)) - 0.001595 * Math.sin(2 * (node + phase));
        l += E * 0.00122 * Math.sin(4 * phase - sanomaly - anomaly) - 0.00111 * Math.sin(2 * (anomaly + node));
        l += 0.000892 * Math.sin(anomaly - 3 * phase) - E * 0.000811 * Math.sin(sanomaly + anomaly + 2 * phase);
        l += E * 0.000761 * Math.sin(4 * phase - sanomaly - 2 * anomaly);
        l += E2 * 0.000704 * Math.sin(anomaly - 2 * (sanomaly + phase));
        l += E * 0.000693 * Math.sin(sanomaly - 2 * (anomaly - phase));
        l += E * 0.000598 * Math.sin(2 * (phase - node) - sanomaly);
        l += 0.00055 * Math.sin(anomaly + 4 * phase) + 0.000538 * Math.sin(4 * anomaly);
        l += E * 0.000521 * Math.sin(4 * phase - sanomaly) + 0.000486 * Math.sin(2 * anomaly - phase);
        l += E2 * 0.000717 * Math.sin(anomaly - 2 * sanomaly);
        longitude = l * DEG_TO_RAD;
        Psin = 29.530588853;

        if (this.sun !== null)
            this.moonAge = (normalizeRadians(longitude - this.sun.eclipticLongitude) * Psin) / TWO_PI;
        else
            this.moonAge = (phase * Psin) / TWO_PI;

        p = 0.950724 + 0.051818 * Math.cos(anomaly) + 0.009531 * Math.cos(2 * phase - anomaly);
        p += 0.007843 * Math.cos(2 * phase) + 0.002824 * Math.cos(2 * anomaly);
        p += 0.000857 * Math.cos(2 * phase + anomaly) + E * 0.000533 * Math.cos(2 * phase - sanomaly);
        p += E * 0.000401 * Math.cos(2 * phase - anomaly - sanomaly) + E * 0.00032 * Math.cos(anomaly - sanomaly) - 0.000271 * Math.cos(phase);
        p += -E * 0.000264 * Math.cos(sanomaly + anomaly) - 0.000198 * Math.cos(2 * node - anomaly);
        p += 0.000173 * Math.cos(3 * anomaly) + 0.000167 * Math.cos(4 * phase - anomaly);
        p += -E * 0.000111 * Math.cos(sanomaly) + 0.000103 * Math.cos(4 * phase - 2 * anomaly);
        p += -8.4e-05 * Math.cos(2 * anomaly - 2 * phase) - E * 8.3e-05 * Math.cos(2 * phase + sanomaly);
        p += 7.9e-05 * Math.cos(2 * phase + 2 * anomaly) + 7.2e-05 * Math.cos(4 * phase);
        p += E * 6.4e-05 * Math.cos(2 * phase - sanomaly + anomaly) - E * 6.3e-05 * Math.cos(2 * phase + sanomaly - anomaly);
        p += E * 4.1e-05 * Math.cos(sanomaly + phase) + E * 3.5e-05 * Math.cos(2 * anomaly - sanomaly);
        p += -3.3e-05 * Math.cos(3 * anomaly - 2 * phase) - 3e-05 * Math.cos(anomaly + phase);
        p += -2.9e-05 * Math.cos(2 * (node - phase)) - E * 2.9e-05 * Math.cos(2 * anomaly + sanomaly);
        p += E2 * 2.6e-05 * Math.cos(2 * (phase - sanomaly)) - 2.3e-05 * Math.cos(2 * (node - phase) + anomaly);
        p += E * 1.9e-05 * Math.cos(4 * phase - sanomaly - anomaly);
        distance = 1.0 / Math.sin(p * DEG_TO_RAD);
        l = 5.128189 * Math.sin(node) + 0.280606 * Math.sin(node + anomaly) + 0.277693 * Math.sin(anomaly - node);
        l += 0.173238 * Math.sin(2 * phase - node) + 0.055413 * Math.sin(2 * phase + node - anomaly);
        l += 0.046272 * Math.sin(2 * phase - node - anomaly) + 0.032573 * Math.sin(2 * phase + node);
        l += 0.017198 * Math.sin(2 * anomaly + node) + 0.009267 * Math.sin(2 * phase + anomaly - node);
        l += 0.008823 * Math.sin(2 * anomaly - node) + E * 0.008247 * Math.sin(2 * phase - sanomaly - node) + 0.004323 * Math.sin(2 * (phase - anomaly) - node);
        l += 0.0042 * Math.sin(2 * phase + node + anomaly) + E * 0.003372 * Math.sin(node - sanomaly - 2 * phase);
        l += E * 0.002472 * Math.sin(2 * phase + node - sanomaly - anomaly);
        l += E * 0.002222 * Math.sin(2 * phase + node - sanomaly);
        l += E * 0.002072 * Math.sin(2 * phase - node - sanomaly - anomaly);
        l += E * 0.001877 * Math.sin(node - sanomaly + anomaly) + 0.001828 * Math.sin(4 * phase - node - anomaly);
        l += -E * 0.001803 * Math.sin(node + sanomaly) - 0.00175 * Math.sin(3 * node);
        l += E * 0.00157 * Math.sin(anomaly - sanomaly - node) - 0.001487 * Math.sin(node + phase);
        l += -E * 0.001481 * Math.sin(node + sanomaly + anomaly) + E * 0.001417 * Math.sin(node - sanomaly - anomaly);
        l += E * 0.00135 * Math.sin(node - sanomaly) + 0.00133 * Math.sin(node - phase);
        l += 0.001106 * Math.sin(node + 3 * anomaly) + 0.00102 * Math.sin(4 * phase - node);
        l += 0.000833 * Math.sin(node + 4 * phase - anomaly) + 0.000781 * Math.sin(anomaly - 3 * node);
        l += 0.00067 * Math.sin(node + 4 * phase - 2 * anomaly) + 0.000606 * Math.sin(2 * phase - 3 * node);
        l += 0.000597 * Math.sin(2 * (phase + anomaly) - node);
        l += E * 0.000492 * Math.sin(2 * phase + anomaly - sanomaly - node) + 0.00045 * Math.sin(2 * (anomaly - phase) - node);
        l += 0.000439 * Math.sin(3 * anomaly - node) + 0.000423 * Math.sin(node + 2 * (phase + anomaly));
        l += 0.000422 * Math.sin(2 * phase - node - 3 * anomaly) - E * 0.000367 * Math.sin(sanomaly + node + 2 * phase - anomaly);
        l += -E * 0.000353 * Math.sin(sanomaly + node + 2 * phase) + 0.000331 * Math.sin(node + 4 * phase);
        l += E * 0.000317 * Math.sin(2 * phase + node - sanomaly + anomaly);
        l += E2 * 0.000306 * Math.sin(2 * (phase - sanomaly) - node) - 0.000283 * Math.sin(anomaly + 3 * node);
        W1 = 0.0004664 * Math.cos(NA);
        W2 = 7.54e-05 * Math.cos(C);
        latitude = l * DEG_TO_RAD * (1.0 - W1 - W2);
        array = [longitude, latitude, distance * EARTH_RADIUS / AU, Math.atan(eqBodyRadius(body.moon) / (distance * EARTH_RADIUS))];
        return array;
    }

    doCalc(pos: number[], geocentric: boolean) {
        let alt; let ang_hor; let angh; let azi; let azx; let azy; let celestialHoursToEarthTime; let cl; let correction; let cosDec; let cosEcl; let cosLat; let dec; let dist; let geocLat; let geocR; let h; let jdToday; let out; let ra; let radiusAU; let rise; let riseToday2; let rise_time; let rise_time1; let rise_time2; let set; let setToday2; let set_time; let set_time1; let set_time2; let siderealDayLength; let sinDec; let sinEcl; let sinLat; let tmp; let transit; let transitToday2; let transit_alt; let transit_time; let transit_time1; let transit_time2; let x; let xtopo; let y; let ytopo; let z; let
            ztopo;
        pos[0] += this.nutLon;
        pos[1] += this.nutObl;
        cl = Math.cos(pos[1]);
        x = pos[2] * Math.cos(pos[0]) * cl;
        y = pos[2] * Math.sin(pos[0]) * cl;
        z = pos[2] * Math.sin(pos[1]);
        sinEcl = Math.sin(this.meanObliquity);
        cosEcl = Math.cos(this.meanObliquity);
        tmp = y * cosEcl - z * sinEcl;
        z = y * sinEcl + z * cosEcl;
        y = tmp;
        xtopo = x;
        ytopo = y;
        ztopo = z;

        if (geocentric === false) {
            geocLat = this.obsLat - 0.1925 * Math.sin(2 * this.obsLat) * DEG_TO_RAD;
            sinLat = Math.sin(geocLat);
            cosLat = Math.cos(geocLat);
            geocR = 1.0 - Math.pow(Math.sin(this.obsLat), 2) / 298.257;
            radiusAU = (geocR * EARTH_RADIUS + this.obsAlt * 0.001) / AU;
            correction = [radiusAU * cosLat * Math.cos(this.lst), radiusAU * cosLat * Math.sin(this.lst), radiusAU * sinLat];
            xtopo -= correction[0];
            ytopo -= correction[1];
            ztopo -= correction[2];
        }

        ra = 0.0;
        dec = PI_OVER_TWO;

        if (ztopo < 0.0)
            dec = -dec;

        if (ytopo !== 0.0 || xtopo !== 0.0) {
            ra = Math.atan2(ytopo, xtopo);
            dec = Math.atan2(ztopo / Math.hypot(xtopo, ytopo), 1.0);
        }

        dist = Math.sqrt(xtopo * xtopo + ytopo * ytopo + ztopo * ztopo);
        angh = this.lst - ra;
        sinLat = Math.sin(this.obsLat);
        cosLat = Math.cos(this.obsLat);
        sinDec = Math.sin(dec);
        cosDec = Math.cos(dec);
        h = sinLat * sinDec + cosLat * cosDec * Math.cos(angh);
        alt = Math.asin(h);
        azy = Math.sin(angh);
        azx = Math.cos(angh) * sinLat - sinDec * cosLat / cosDec;
        azi = Math.PI + Math.atan2(azy, azx);

        if (geocentric === true)
            return new Ephemeris(azi, alt, -1, -1, -1, -1, normalizeRadians(ra), dec, dist, pos[0], pos[1], pos[3]);

        alt = refraction(alt);

        if (this.twilight === TWILIGHT.HORIZON_34arcmin)
            tmp = -(34.0 / 60.0) * DEG_TO_RAD - pos[3];

        if (this.twilight === TWILIGHT.CIVIL)
            tmp = -6 * DEG_TO_RAD;

        if (this.twilight === TWILIGHT.NAUTICAL)
            tmp = -12 * DEG_TO_RAD;

        if (this.twilight === TWILIGHT.ASTRONOMICAL)
            tmp = -18 * DEG_TO_RAD;

        tmp = (Math.sin(tmp) - sinLat * sinDec) / (cosLat * cosDec);
        siderealDayLength = 1.0027378119113546;
        celestialHoursToEarthTime = 1.0 / (siderealDayLength * TWO_PI);
        transit_time1 = celestialHoursToEarthTime * normalizeRadians(ra - this.lst);
        transit_time2 = celestialHoursToEarthTime * (normalizeRadians(ra - this.lst) - TWO_PI);
        transit_alt = Math.asin(sinDec * sinLat + cosDec * cosLat);
        transit_alt = refraction(transit_alt);
        transit_time = transit_time1;
        jdToday = Math.floor(this.jd_UT - 0.5) + 0.5;
        transitToday2 = Math.floor(this.jd_UT + transit_time2 - 0.5) + 0.5;

        if (jdToday === transitToday2 && Math.abs(transit_time2) < Math.abs(transit_time1))
            transit_time = transit_time2;

        transit = this.jd_UT + transit_time;
        rise = -1;
        set = -1;

        if (Math.abs(tmp) <= 1.0) {
            ang_hor = Math.abs(Math.acos(tmp));
            rise_time1 = celestialHoursToEarthTime * normalizeRadians(ra - ang_hor - this.lst);
            set_time1 = celestialHoursToEarthTime * normalizeRadians(ra + ang_hor - this.lst);
            rise_time2 = celestialHoursToEarthTime * (normalizeRadians(ra - ang_hor - this.lst) - TWO_PI);
            set_time2 = celestialHoursToEarthTime * (normalizeRadians(ra + ang_hor - this.lst) - TWO_PI);
            rise_time = rise_time1;
            riseToday2 = Math.floor(this.jd_UT + rise_time2 - 0.5) + 0.5;

            if (jdToday === riseToday2 && Math.abs(rise_time2) < Math.abs(rise_time1))
                rise_time = rise_time2;

            set_time = set_time1;
            setToday2 = Math.floor(this.jd_UT + set_time2 - 0.5) + 0.5;

            if (jdToday === setToday2 && Math.abs(set_time2) < Math.abs(set_time1))
                set_time = set_time2;

            rise = this.jd_UT + rise_time;
            set = this.jd_UT + set_time;
        }

        out = new Ephemeris(azi, alt, rise, set, transit, transit_alt, normalizeRadians(ra), dec, dist, pos[0], pos[1], pos[3]);
        return out;
    }

    getIlluminationPhase(celestialBody: Ephemeris) {
        let DPH; let RE; let RO; let RP; let cosElong; let
            dlon;
        dlon = celestialBody.rightAscension - this.sun.rightAscension;
        cosElong = Math.sin(this.sun.declination) * Math.sin(celestialBody.declination) + Math.cos(this.sun.declination) * Math.cos(celestialBody.declination) * Math.cos(dlon);
        RE = this.sun.distance;
        RO = celestialBody.distance;
        RP = Math.sqrt(-(cosElong * 2.0 * RE * RO - RE * RE - RO * RO));
        DPH = (RP * RP + RO * RO - RE * RE) / (2.0 * RP * RO);
        celestialBody.illuminationPhase = 100 * (1.0 + DPH) * 0.5;
    }

    obtainAccurateRiseSetTransit(riseSetJD: number, index: number, niter: number, sun: boolean) {
        let i; let out; let step; let
            val;
        step = -1;
        i = 0;

        while (i < niter) {
            if (riseSetJD === -1)
                return riseSetJD;

            this.setUTDate(riseSetJD);
            out = Ephemeris;
            out = null;

            if (sun)
                out = this.doCalc(this.getSun(), false);
            else
                out = this.doCalc(this.getMoon(), false);

            val = out.rise;

            if (index === EVENT.SET)
                val = out.set;

            if (index === EVENT.TRANSIT)
                val = out.transit;

            step = Math.abs(riseSetJD - val);
            riseSetJD = val;

            if (step <= 1.0 / SECONDS_PER_DAY)
                break;

            i += 1;
        }

        if (step > 1.0 / SECONDS_PER_DAY)
            return -1;

        return riseSetJD;
    }

    getMoonPhaseTime(phase: number) {
        let accuracy; let age; let moonAge; let oldJD; let oldMoonAge; let out; let
            refPhase;
        accuracy = 10 / (30 * SECONDS_PER_DAY);
        refPhase = phase;
        oldJD = this.jd_UT;
        oldMoonAge = this.moonAge;

        while (true) {
            age = normalizeRadians(this.getMoon()[0] - this.getSun()[0]) / TWO_PI - refPhase;

            if (age < 0)
                age += 1;

            if (age < accuracy || age > 1 - accuracy)
                break;

            if (age < 0.5)
                this.jd_UT -= age;
            else
                this.jd_UT += 1 - age;

            this.setUTDate(this.jd_UT);
        }

        out = this.jd_UT;
        this.setUTDate(oldJD);
        moonAge = oldMoonAge;
        return out;
    }
}
