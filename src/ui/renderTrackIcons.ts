import type { TrackMap } from '../types/track';

export function renderTrackIcons(
    tracks: TrackMap,
    container: HTMLElement,
    image: HTMLImageElement
) {
    const scaleX = image.offsetWidth / image.naturalWidth;
    const scaleY = image.offsetHeight / image.naturalHeight;

    // clear previous (to render in 'new' location)
    container.innerHTML = '';


    // console.log(image.height);
    const iconSize = image.height / 10;
    const halfSize = iconSize / 2; // for centering

    // for single selected icon handling
    let selectedIcon: HTMLImageElement | null = null;

    for (const track of Object.values(tracks)) {
        const icon = document.createElement('img');
        icon.src = `${import.meta.env.BASE_URL}images/track-icons/${track.icon}`;
        icon.alt = track.names.en_gb;
        icon.style.position = 'absolute';
        icon.style.width = `${iconSize}px`;
        icon.style.height = `${iconSize}px`;
        // hacky-centering
        icon.style.left = `${track.coords.X * scaleX - halfSize}px`;
        icon.style.top = `${track.coords.Y * scaleY - halfSize}px`;

        icon.addEventListener('click', () => {
            if (selectedIcon && selectedIcon !== icon) {
                selectedIcon.classList.remove('iconSelected');
            }

            const isSelected = icon.classList.toggle('iconSelected');
            selectedIcon = isSelected ? icon : null;

            console.log('Selected:', selectedIcon);
        });

        container.appendChild(icon);
    }
}