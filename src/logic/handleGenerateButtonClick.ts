import { getSelectedTrack } from '../stores/SelectedTrackStore';
import { getTrackMap } from '../stores/TrackMapStore';
import { generateGrandPrix } from '../pathgen/grandprix';
import { generateKnockoutTour } from '../pathgen/knockouttour';
import { generateVSMode } from '../pathgen/vs';
import { drawPathLines } from '../ui/drawPathLines';
import { renderPathResultsList } from '../ui/renderPathResultsList';


export function handleGenerateButtonClick(pathModeSelect: HTMLSelectElement, selectedTrackEnd: HTMLInputElement, includeSingleTrackCheck: HTMLInputElement) {
    // safety checks first up, "should" never occur as button is disabled without a track selection
    const selectedTrack = getSelectedTrack();
    if (!selectedTrack) {
        console.log('No track selected');
        return;
    }

    const trackMap = getTrackMap();

    console.log('Selected track:', selectedTrack.names.en_gb);
    console.log('Selected path mode:', pathModeSelect.value);
    console.log('Selected "end with":', selectedTrackEnd.checked);
    console.log('Selected include single-track:', includeSingleTrackCheck.checked);

    // debuging running a path
    const path = (() => {
        const pathModeValue = pathModeSelect.value;
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
        return ['How did you get here'];
    })();

    console.log(path);

    // populate the list
    renderPathResultsList(path);

    // draw the path on the map
    drawPathLines(path);

}
