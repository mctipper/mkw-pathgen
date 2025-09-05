import { getTrackMap } from '../stores/TrackMapStore';
import type { Track, TrackMap } from '../types/track';
import { handleTrackClick } from '../logic/handleTrackClick';
// import { resetPathResultsList } from './renderPathResultsList';
// import { resetPathLines } from './renderPathLines';

export function updateIconPosition(
    track: Track,
    icon: HTMLImageElement,
    iconSize: number,
    halfSize: number,
    scaleX: number,
    scaleY: number
) {
    // preserve aspect ratio of the original icon (rainbow road is rectangle, rest are square)
    const naturalRatio = icon.naturalHeight / icon.naturalWidth;
    icon.style.height = `${iconSize * naturalRatio}px`;
    icon.style.width = `${iconSize}px`;
    icon.style.left = `${track.coords.X * scaleX - halfSize}px`;
    icon.style.top = `${track.coords.Y * scaleY - halfSize}px`;
}


export function renderTrackIcons(
    container: HTMLElement,
    image: HTMLImageElement,
) {
    const scaleX = image.offsetWidth / image.naturalWidth;
    const scaleY = image.offsetHeight / image.naturalHeight;
    const iconSize = image.height / 7;
    const halfSize = iconSize / 2;

    const trackSelectedText = document.querySelector<HTMLElement>('.selected-track-text')!;
    let selectedIcon: HTMLImageElement | null = null;

    const trackMap: TrackMap = getTrackMap();
    container.innerHTML = '';

    // reset all previous
    // decided to remove this as mobile scrolling triggers "resize" when address bar is removed.
    // the lines will appear misaligned if resize after drawing them, but meh can live with that
    // resetPathLines();
    // resetPathResultsList();

    for (const track of Object.values(trackMap)) {
        const icon = document.createElement('img');
        icon.className = 'track-icon';
        icon.id = track.id;
        icon.src = `${import.meta.env.BASE_URL}images/track-icons/${track.icon}`;
        icon.alt = track.names.en_gb;
        icon.style.position = 'absolute';
        updateIconPosition(track, icon, iconSize, halfSize, scaleX, scaleY);

        // listen to clicks to see if that icon was clicked (or not!)
        icon.addEventListener('click', () => {
            const result = handleTrackClick(icon, track, selectedIcon, trackSelectedText);
            selectedIcon = result.newSelectedIcon;
        });

        container.appendChild(icon);
    }
}
