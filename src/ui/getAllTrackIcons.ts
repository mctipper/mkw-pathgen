export function getAllTrackIcons(): HTMLImageElement[] {
    return Array.from(document.querySelectorAll<HTMLImageElement>('.track-icon'));
}
