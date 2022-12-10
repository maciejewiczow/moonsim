export function* linspace(start: number, stop: number, num: number, endpoint = true) {
    if (num <= 1) {
        yield stop;
        return;
    }

    const step = endpoint ? (stop - start) / (num - 1) : (stop - start) / num;

    for (let i = 0; i < num; i++)
        yield start + step * i;
}
