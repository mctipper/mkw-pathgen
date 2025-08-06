import type { Track } from '../types/track';

function isTrack(obj: any): obj is Track {
    // ts was of typesafety without explicit casting
    return (
        obj &&
        typeof obj === 'object' &&
        typeof obj.names?.en_gb === 'string'
    );
}

export function handleGenerateButtonClick(selectedTrackStore: HTMLElement, pathModeSelect: HTMLSelectElement, selectedTrackEnd: HTMLInputElement, includeSingleTrackCheck: HTMLInputElement) {
    // safety checks first up, "should" never occur as button is disabled without a track selection
    const raw = selectedTrackStore.textContent?.trim();
    if (!raw) {
        console.log('No track selected');
        return;
    }

    // parse it out
    const track = JSON.parse(raw);
    try {
        if (!isTrack(track)) {
            console.warn('Parsed data is not a valid Track:', track);
            return;
        }
    } catch (err) {
        console.error('Failed to parse track from store:', err);
        return;
    }

    console.log('Selected track:', track.names.en_gb);
    console.log('Selected path mode:', pathModeSelect.value);
    console.log('Selected "end with":', selectedTrackEnd.checked);
    console.log('Selected include single-track:', includeSingleTrackCheck.checked);
}
