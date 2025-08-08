import { updateTrackSelection } from '../ui/updateTrackSelection';
import type { Track } from '../types/track';
import { resetPathLines } from '../ui/drawPathLines';
import { resetPathResultsList } from '../ui/renderPathResultsList';

export function handleTrackClick(
    icon: HTMLImageElement,
    track: Track,
    selectedIcon: HTMLImageElement | null,
    trackSelected: HTMLElement
): {
    newSelectedIcon: HTMLImageElement | null;
    newSelectedTrack: Track | null;
} {
    resetPathLines(); // reset draw
    resetPathResultsList(); // reset path list

    if (selectedIcon && selectedIcon !== icon) {
        selectedIcon.classList.remove('iconSelected');
    }

    const isSelected = icon.classList.toggle('iconSelected');
    const newSelectedIcon = isSelected ? icon : null;
    const newSelectedTrack = isSelected ? track : null;

    updateTrackSelection(
        icon,
        newSelectedTrack,
        trackSelected
    );

    return { newSelectedIcon, newSelectedTrack };
}
