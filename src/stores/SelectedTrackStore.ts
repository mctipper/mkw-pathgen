import type { Track } from '../types/track';

let selectedTrack: Track | null = null;

export function setSelectedTrack(track: Track | null): void {
    selectedTrack = track;
}

export function getSelectedTrack(): Track | null {
    return selectedTrack;
}
