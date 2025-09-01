import { loadRaceTerms } from '../data/loadRaceTerms';
import type { RaceTermsMap, MarioTermsList } from '../types/race';

let raceTerms: RaceTermsMap | null = null;
let marioTerms: MarioTermsList | null = null;

export async function initRaceNameStore(): Promise<void> {
    if (raceTerms && marioTerms) return;

    const data = await loadRaceTerms();
    raceTerms = data.raceTerms;
    marioTerms = data.marioTerms;
}

export function generateRaceName(raceKey: string): string {
    if (!raceTerms || !marioTerms) {
        throw new Error('RaceNameStore not initialized. Call initRaceNameStore() first.');
    }

    const raceOptions = raceTerms[raceKey];
    if (!raceOptions || raceOptions.length === 0) {
        throw new Error(`No race terms found for: ${raceKey}`);
    }

    const firstHalf = marioTerms[Math.floor(Math.random() * marioTerms.length)];
    const secondHalf = raceOptions[Math.floor(Math.random() * raceOptions.length)];

    return `${firstHalf} ${secondHalf}`;
}
