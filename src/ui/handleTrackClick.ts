import type { Track } from '../types/track';

export function handleTrackClick(
    icon: HTMLImageElement,
    track: Track,
    selectedIcon: HTMLImageElement | null,
    trackSelected: HTMLElement,
    store: HTMLElement
): {
    newSelectedIcon: HTMLImageElement | null;
    newSelectedTrack: Track | null;
} {
    if (selectedIcon && selectedIcon !== icon) {
        selectedIcon.classList.remove('iconSelected');
    }

    const isSelected = icon.classList.toggle('iconSelected');
    const newSelectedIcon = isSelected ? icon : null;
    const newSelectedTrack = isSelected ? track : null;

    store.textContent = isSelected ? JSON.stringify(track) : '';
    trackSelected.innerHTML = isSelected ? track.names.en_gb : 'Select a track!';
    trackSelected.classList.toggle('track-selected', isSelected);

    return { newSelectedIcon, newSelectedTrack };
}
