const generateButton: HTMLButtonElement = (() => {
    const gb = document.querySelector<HTMLButtonElement>('.generate-button');
    if (!gb) {
        throw new Error('Generate button not found');
    }
    return gb;
})();

export function disableGenerateButton(): void {
    generateButton.disabled = true;
}

export function enableGenerateButton(): void {
    generateButton.disabled = false;
}
