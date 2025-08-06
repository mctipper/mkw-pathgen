import type { Track } from '../types/track';

function isTrack(obj: any): obj is Track {
    return (
        obj &&
        typeof obj === 'object' &&
        typeof obj.names?.en_gb === 'string'
    );
}

export function handleButtonClick() {
    // safety checks first up
    const store = document.getElementById('selected-track-store');
    if (!store) {
        console.warn('selected-track-store element not found');
        return;
    }

    const raw = store.textContent?.trim();
    if (!raw) {
        console.log('No track selected');
        return;
    }

    // parse it out
    try {
        const parsed = JSON.parse(raw);
        if (isTrack(parsed)) {
            console.log('Selected track:', parsed.names.en_gb);
        } else {
            console.warn('Parsed data is not a valid Track:', parsed);
        }
    } catch (err) {
        console.error('Failed to parse track from store:', err);
    }
}
