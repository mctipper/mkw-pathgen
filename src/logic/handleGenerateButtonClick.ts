import { getSelectedTrack } from '../stores/SelectedTrackStore';
import { getTrackMap } from '../stores/TrackMapStore';
import { generateGrandPrix } from '../pathgen/grandprix';
import { generateKnockoutTour } from '../pathgen/knockouttour';


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
            return 'Not implmented';
        }
        return 'How did you get here';
    })();

    console.log(path);
}
