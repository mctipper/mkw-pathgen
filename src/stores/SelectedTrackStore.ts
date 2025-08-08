import type { Track } from '../types/track';


function getStoreElement(): HTMLElement {
    const storeEl = document.querySelector<HTMLElement>('#selected-track-store');
    if (!storeEl) {
        throw new Error('SelectedTrackStore: #selected-track-store element not found');
    }
    return storeEl;
}

export function setSelectedTrack(track: Track | null): void {
    let storeEl = getStoreElement()
    storeEl.textContent = track ? JSON.stringify(track) : '';
}

export function getSelectedTrack(): Track | null {
    let storeEl = getStoreElement()

    const raw = storeEl.textContent;
    if (!raw) return null;

    try {
        return JSON.parse(raw) as Track;
    } catch {
        console.warn('SelectedTrackStore: Failed to parse stored track JSON');
        return null;
    }
}
