import { getTrackMap } from '../stores/TrackMapStore';
import type { TrackMap } from '../types/track';
import { handleTrackClick } from '../logic/handleTrackClick';

export function renderTrackIcons(
    container: HTMLElement,
    image: HTMLImageElement,
) {
    const scaleX = image.offsetWidth / image.naturalWidth;
    const scaleY = image.offsetHeight / image.naturalHeight;

    container.innerHTML = '';

    const iconSize = image.height / 8;
    const halfSize = iconSize / 2;

    const trackSelectedText = document.querySelector<HTMLElement>('.selected-track-text')!;
    let selectedIcon: HTMLImageElement | null = null;

    const trackMap: TrackMap = getTrackMap();

    for (const track of Object.values(trackMap)) {
        const icon = document.createElement('img');
        icon.className = 'track-icon';
        icon.id = track.id;
        icon.src = `${import.meta.env.BASE_URL}images/track-icons/${track.icon}`;
        icon.alt = track.names.en_gb;
        icon.style.position = 'absolute';
        icon.style.width = `${iconSize}px`;
        icon.style.height = `${iconSize}px`;
        icon.style.left = `${track.coords.X * scaleX - halfSize}px`;
        icon.style.top = `${track.coords.Y * scaleY - halfSize}px`;

        // listen to clicks to see if that icon was clicked (or not!)
        icon.addEventListener('click', () => {
            const result = handleTrackClick(icon, track, selectedIcon, trackSelectedText);
            selectedIcon = result.newSelectedIcon;
        });

        container.appendChild(icon);
    }
}
