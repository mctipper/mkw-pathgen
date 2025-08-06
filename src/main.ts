import './style.css';
import { syncElementToImage, syncElementWidthToImage } from './ui/syncToBase';
import { loadTracks } from './data/tracks';
import { renderTrackIcons } from './ui/renderTrackIcons';

import type { TrackMap } from './types/track';
import { handleButtonClick } from './ui/handleButtonClick';
import { updateSingleTrackCheckboxState } from './ui/handleDropdownSelect';


async function init() {
  // validate that all require DOM layers have loaded
  const refs = {
    trackIconLayer: document.querySelector<HTMLElement>('.track-icons-layer'),
    mapImg: document.querySelector<HTMLImageElement>('.base-map'),
    pathGenControls: document.querySelector<HTMLImageElement>('.map-controls'),
    generateButton: document.querySelector<HTMLButtonElement>('.generate-button'),
    pathModeSelect: document.querySelector<HTMLSelectElement>('.path-options-dropdown'),
    includeSingleTrackCheck: document.querySelector<HTMLInputElement>('.include-single-track'),
  };

  const missingRefs = Object.entries(refs)
    .filter(([, el]) => el === null)
    .map(([key]) => key);

  if (missingRefs.length > 0) {
    const plural: string = missingRefs.length > 1 ? 's' : ''
    console.error(`Missing required DOM element${plural}: ${missingRefs.join(', ')}`);
    return;
  }

  const {
    trackIconLayer,
    mapImg,
    pathGenControls,
    generateButton,
    pathModeSelect,
    includeSingleTrackCheck,
  } = refs as {
    trackIconLayer: HTMLElement;
    mapImg: HTMLImageElement;
    pathGenControls: HTMLImageElement;
    generateButton: HTMLButtonElement;
    pathModeSelect: HTMLSelectElement;
    includeSingleTrackCheck: HTMLInputElement;
  };

  // loading in the tracks data
  const tracks: TrackMap = await loadTracks();
  console.log('Tracks loaded:', tracks);

  // handling of button disable (with override because html was being ignored)
  generateButton.disabled = true;
  generateButton.addEventListener('click', handleButtonClick);

  updateSingleTrackCheckboxState(pathModeSelect.value, includeSingleTrackCheck);
  pathModeSelect.addEventListener('change', () =>
    updateSingleTrackCheckboxState(pathModeSelect.value, includeSingleTrackCheck)
  );

  // syncing to base image size
  function render() {
    syncElementToImage(trackIconLayer, mapImg);
    syncElementWidthToImage(pathGenControls, mapImg);
    renderTrackIcons(tracks, trackIconLayer, mapImg, generateButton);
  }
  if (mapImg.complete) {
    render();
  } else {
    mapImg.addEventListener('load', render);
  }
  window.addEventListener('resize', render);
}

init();