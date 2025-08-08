import { getTrackMap } from "../stores/TrackMapStore";

export function resetPathResultsList() {
    const pathResultsText = document.querySelector('.path-results-text');
    if (!pathResultsText) return;
    pathResultsText.innerHTML = ''
}


export function renderPathResultsList(path: string[]) {
    resetPathResultsList();
    const pathResultsText = document.querySelector('.path-results-text');
    if (!pathResultsText) return;

    if (path.length === 0) {
        // if a path could not be found (i.e. Rainbow Road selected without 'end with selected')
        pathResultsText.innerHTML = 'No Path Found from Selected Track'
    }

    const trackMap = getTrackMap();

    const list = document.createElement('ul');
    list.className = 'path-results-list';

    const arrows = document.createElement('span')
    arrows.innerHTML = ">>>"

    // purposefully starting at 2nd item
    for (let i = 1; i < path.length; i++) {
        const prevId = path[i - 1];
        const currId = path[i]
        const listItem = document.createElement('li');
        if (prevId === currId) {
            listItem.className = 'path-list-item single-track-row'
            const singleTrackSpan = document.createElement('span');
            singleTrackSpan.className = 'single-track-text'
            singleTrackSpan.textContent = `${trackMap[currId].names.en_gb} (3 laps)`;
            listItem.appendChild(singleTrackSpan);
        } else {
            listItem.className = 'path-list-item'
            const left = document.createElement('span');
            left.className = 'track-left';
            left.textContent = trackMap[prevId].names.en_gb;

            const arrow = document.createElement('span');
            arrow.className = 'track-arrow';
            arrow.textContent = '>>>';

            const right = document.createElement('span');
            right.className = 'track-right';
            right.textContent = trackMap[currId].names.en_gb;

            listItem.appendChild(left);
            listItem.appendChild(arrow);
            listItem.appendChild(right);
        }

        list.appendChild(listItem);

    }
    pathResultsText.appendChild(list);
}
