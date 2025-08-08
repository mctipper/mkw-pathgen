export function updateSingleTrackCheckboxState(pathModeValue: string, includeSingleTrackCheck: HTMLInputElement) {
    const isVSMode = pathModeValue.startsWith('vs');
    includeSingleTrackCheck.disabled = !isVSMode;
    if (!isVSMode) includeSingleTrackCheck.checked = false;
}
