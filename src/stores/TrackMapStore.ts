import { loadTracks } from '../data/loadTracks';
import type { Track, TrackMap } from '../types/track';

let trackMap: TrackMap | null = null;

export async function initTrackMapStore(): Promise<void> {
    if (trackMap) return;
    trackMap = await loadTracks();
}

export function getTrackMap(): TrackMap {
    if (!trackMap) {
        throw new Error('TrackMap not yet initialised. Call initTrackMapStore() first.');
    }
    return trackMap;
}

export function getTrack(trackId: string): Track {
    if (!trackMap) {
        throw new Error('TrackMap not yet initialised. Call initTrackMapStore() first.');
    }
    return trackMap[trackId];
}