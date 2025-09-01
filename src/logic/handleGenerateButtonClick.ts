import { getSelectedTrack } from '../stores/SelectedTrackStore';
import { getTrackMap } from '../stores/TrackMapStore';
import { generateGrandPrix } from '../pathgen/grandprix';
import { generateKnockoutTour } from '../pathgen/knockouttour';
import { generateVSMode } from '../pathgen/vs';
import { renderPathLines } from '../ui/renderPathLines';
import { renderPathResultsList } from '../ui/renderPathResultsList';
import { debugLog, log } from '../utils/log';


export function handleGenerateButtonClick(pathModeSelect: HTMLSelectElement, selectedTrackEnd: HTMLInputElement, includeSingleTrackCheck: HTMLInputElement) {
    // safety checks first up, "should" never occur as button is disabled without a track selection
    const selectedTrack = getSelectedTrack();
    if (!selectedTrack) {
        log('No track selected');
        return;
    }

    const trackMap = getTrackMap();

    debugLog('Selected track:', selectedTrack.names.en_gb);
    debugLog('Selected path mode:', pathModeSelect.value);
    debugLog('Selected "end with":', selectedTrackEnd.checked);
    debugLog('Selected include single-track:', includeSingleTrackCheck.checked);

    // debuging running a path
    const pathModeValue = pathModeSelect.value;
    const path = (() => {
        if (pathModeValue === 'gp') {
            return generateGrandPrix(trackMap, selectedTrack.id, selectedTrackEnd.checked);
        }

        if (pathModeValue === 'kt') {
            return generateKnockoutTour(trackMap, selectedTrack.id, selectedTrackEnd.checked);
        }

        if (pathModeValue.startsWith('vs')) {
            const races: number = Number(pathModeValue.replace('vs', ''))
            return generateVSMode(trackMap, selectedTrack.id, races, selectedTrackEnd.checked, includeSingleTrackCheck.checked)
        }
        // TODO handle this (albeit unexpected) outcome better
        return ['How did you get here'];
    })();

    log(`Resulting path: ${path}`);

    // populate the list
    renderPathResultsList(pathModeValue, path);

    // draw the path on the map
    renderPathLines(path);

}
