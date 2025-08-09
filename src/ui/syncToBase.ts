import { getAllTrackIcons } from "./getAllTrackIcons";
import { updateIconPosition } from "./renderTrackIcons";

export function syncElementToImage(
    element: HTMLElement,
    image: HTMLImageElement
) {
    requestAnimationFrame(() => {
        const rect = image.getBoundingClientRect();

        element.style.width = `${rect.width}px`;
        element.style.height = `${rect.height}px`;
        element.style.left = `${rect.left + window.scrollX}px`;
        // element.style.top = `${rect.top + window.scrollY}px`; // top is offset because of header
    });
}


export function syncElementWidthToImage(
    element: HTMLElement,
    image: HTMLImageElement
) {
    requestAnimationFrame(() => {
        const rect = image.getBoundingClientRect();
        element.style.width = `${rect.width}px`;
    });
}


export function syncIconsToImage(
    image: HTMLImageElement,
) {
    const scaleX = image.offsetWidth / image.naturalWidth;
    const scaleY = image.offsetHeight / image.naturalHeight;
    const iconSize = image.height / 8;
    const halfSize = iconSize / 2;

    // if icons already exist, just move them rather than re-render
    let currentIcons = getAllTrackIcons();

    if (currentIcons.length > 0) {
        for (let icon of currentIcons) {
            updateIconPosition(icon, iconSize, halfSize, scaleX, scaleY);
        }
        return;
    }
}