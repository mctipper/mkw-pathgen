import { getTrackMap } from "../stores/TrackMapStore";
import { generateRaceName } from '../stores/RaceNameStore';
import { popToNewTab } from "../ui/popPathToNewTab";


export function resetPathResultsList() {
    const pathResultsText = document.querySelector('.path-results-text');
    if (!pathResultsText) return;
    pathResultsText.innerHTML = ''
}


export function renderPathResultsList(pathModeValue: string, path: string[]) {
    resetPathResultsList();
    const pathResultsText = document.querySelector('.path-results-text');
    if (!pathResultsText) return;

    if (path.length === 0) {
        // if a path could not be found (i.e. Rainbow Road selected without 'end with selected')
        pathResultsText.innerHTML = 'No Path Found from Selected Track'
    }

    // generate a title
    const title = document.createElement('div');
    title.className = 'path-results-title';
    const titleText = document.createElement('h1')
    if (pathModeValue === 'gp') {
        // special condition for Grand Prix / Cup
        titleText.innerText = generateRaceName('4gp');
    } else if (pathModeValue === 'kt') {
        // special condition for Rally
        titleText.innerText = generateRaceName('6rally');
    } else {
        titleText.innerText = generateRaceName((path.length - 1).toString())
    }
    title.appendChild(titleText);

    // new-tab-icon
    const popIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    popIcon.setAttribute('width', '20');
    popIcon.setAttribute('height', '20');
    popIcon.setAttribute('viewBox', '0 0 24 24');
    popIcon.style.cursor = 'pointer';
    popIcon.innerHTML = `
  <path fill="currentColor" d="M14,3H21V10H19V6.41L10.41,15L9,13.59L17.59,5H14V3M5,5H13V7H7V17H17V11H19V19A2,2 0 0,1 17,21H5A2,2 0 0,1 3,19V7A2,2 0 0,1 5,5Z" />
`;
    popIcon.onclick = popToNewTab;
    title.appendChild(popIcon);

    pathResultsText.appendChild(title);

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
