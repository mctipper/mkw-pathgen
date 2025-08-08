import type { Track } from '../types/track';

export function handleTrackClick(
    icon: HTMLImageElement,
    track: Track,
    selectedIcon: HTMLImageElement | null,
    trackSelected: HTMLElement,
    selectedTrackStore: HTMLElement,
    generateButton: HTMLButtonElement
): {
    newSelectedIcon: HTMLImageElement | null;
    newSelectedTrack: Track | null;
} {
    // all icons on the page
    const allIcons = Array.from(document.querySelectorAll<HTMLImageElement>('.track-icon'));

    // remove selection from previously selected icon (if existed)
    if (selectedIcon && selectedIcon !== icon) {
        selectedIcon.classList.remove('iconSelected');
    }

    // the newly selected icon
    const isSelected = icon.classList.toggle('iconSelected');
    const newSelectedIcon = isSelected ? icon : null;
    const newSelectedTrack = isSelected ? track : null;

    // update state
    selectedTrackStore.textContent = isSelected ? JSON.stringify(track) : '';
    trackSelected.innerHTML = isSelected ? track.names.en_gb : 'Select a track!';
    trackSelected.classList.toggle('track-selected-title-text', isSelected);
    generateButton.disabled = !isSelected;

    // update selected class for each icon
    if (isSelected) {
        // when an icon was selected, set the others as 'not selected'
        allIcons.forEach((el) => {
            if (el !== icon) {
                el.classList.add('iconNotSelected');
            } else {
                // remove from the selected one
                el.classList.remove('iconNotSelected');
            }
        });
    } else {
        // when an icon is deselected, remove the 'not selected' class
        allIcons.forEach((el) => {
            el.classList.remove('iconNotSelected');
        });
    }

    return { newSelectedIcon, newSelectedTrack };
}
