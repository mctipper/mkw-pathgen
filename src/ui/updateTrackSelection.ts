import { setSelectedTrack } from '../stores/SelectedTrackStore';
import { getAllTrackIcons } from '../ui/getAllTrackIcons';
import type { Track } from '../types/track';
import { disableGenerateButton, enableGenerateButton } from './toggleGenerateButton';
import { resetPathLines } from './renderPathLines'

export function updateTrackSelection(
    icon: HTMLImageElement,
    track: Track | null,
    trackSelected: HTMLElement
) {
    const allIcons = getAllTrackIcons();

    const isSelected = !!track;

    // lots of 'resetting' or setting values based on the click
    trackSelected.innerHTML = isSelected ? `${track!.names.en_gb}` : 'Select a track!';
    trackSelected.classList.toggle('track-selected-title-text', isSelected);
    setSelectedTrack(track);
    resetPathLines();
    isSelected ? enableGenerateButton() : disableGenerateButton();

    allIcons.forEach((el) => {
        if (el === icon && isSelected) {
            el.classList.add('iconSelected');
            el.classList.remove('iconNotSelected');
        } else {
            el.classList.remove('iconSelected');
            el.classList.toggle('iconNotSelected', isSelected);
        }
    });
}
