export const moonRelativeSize = (Ec: number, MPrimM: number) => {
    const e = 0.0549;
    return (1 - e ** 2) / (1 + e * Math.cos(MPrimM + Ec));
};
