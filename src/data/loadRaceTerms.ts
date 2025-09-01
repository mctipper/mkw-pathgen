import type { RaceTermsMap, MarioTermsList } from '../types/race';

export async function loadRaceTerms(): Promise<{
    raceTerms: RaceTermsMap;
    marioTerms: MarioTermsList;
}> {
    const [raceResponse, marioResponse] = await Promise.all([
        fetch(`${import.meta.env.BASE_URL}/data/race_terms.json`),
        fetch(`${import.meta.env.BASE_URL}/data/mario_terms.json`)
    ]);

    if (!raceResponse.ok) {
        throw new Error('Failed to load race_terms.json data');
    }
    if (!marioResponse.ok) {
        throw new Error('Failed to load mario_terms.json data');
    }

    const raceTerms: RaceTermsMap = await raceResponse.json();
    const marioTerms: MarioTermsList = await marioResponse.json();

    return {
        raceTerms,
        marioTerms
    };
}
