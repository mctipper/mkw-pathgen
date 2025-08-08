export function shuffle<T>(array: T[]): T[] {
    const result = [...array];
    // simple swapsies shuffling done a few times
    for (let m = 0; m < 3; m++) {
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
    }
    return result;
}
