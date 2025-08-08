import { loadTracks } from '../data/loadTracks';
import type { TrackMap } from '../types/track';

let trackMap: TrackMap | null = null;

export async function initTrackMapStore(trackMapStore: HTMLElement): Promise<void> {
    if (trackMap) return;
    trackMap = await loadTracks();
    trackMapStore.textContent = JSON.stringify(trackMap);
}

export function getTrackMap(): TrackMap {
    if (!trackMap) {
        throw new Error('TrackMap not yet initialised. Call initTrackMapStore() first.');
    }
    return trackMap;
}
