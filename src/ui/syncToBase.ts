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