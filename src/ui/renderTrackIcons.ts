import type { TrackMap } from '../types/track';
import { handleTrackClick } from './handleTrackClick';

export function renderTrackIcons(
    tracks: TrackMap,
    container: HTMLElement,
    image: HTMLImageElement
) {
    const scaleX = image.offsetWidth / image.naturalWidth;
    const scaleY = image.offsetHeight / image.naturalHeight;

    container.innerHTML = '';

    const iconSize = image.height / 10;
    const halfSize = iconSize / 2;

    const trackSelected = document.querySelector<HTMLElement>('.selected-track')!;
    const store = document.getElementById('selected-track-store')!;

    let selectedIcon: HTMLImageElement | null = null;
    let selectedTrack: TrackMap[keyof TrackMap] | null = null;

    for (const track of Object.values(tracks)) {
        const icon = document.createElement('img');
        icon.src = `${import.meta.env.BASE_URL}images/track-icons/${track.icon}`;
        icon.alt = track.names.en_gb;
        icon.style.position = 'absolute';
        icon.style.width = `${iconSize}px`;
        icon.style.height = `${iconSize}px`;
        icon.style.left = `${track.coords.X * scaleX - halfSize}px`;
        icon.style.top = `${track.coords.Y * scaleY - halfSize}px`;

        icon.addEventListener('click', () => {
            const result = handleTrackClick(icon, track, selectedIcon, trackSelected, store);
            selectedIcon = result.newSelectedIcon;
            selectedTrack = result.newSelectedTrack;
        });

        container.appendChild(icon);
    }
}
