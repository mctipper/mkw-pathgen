import './style.css';
import { syncElementToImage, syncElementWidthToImage } from './ui/syncToBase';
import { renderTrackIcons } from './ui/renderTrackIcons';

import { handleGenerateButtonClick } from './ui/handleGenerateButtonClick';
import { updateSingleTrackCheckboxState } from './ui/handleDropdownSelect';
import { initTrackMapStore } from './state/trackMapStore';


async function init() {
  // validate that all require DOM layers have loaded
  const refs = {
    trackMapStore: document.querySelector<HTMLElement>('#track-map-store'),
    selectedTrackStore: document.querySelector<HTMLElement>('#selected-track-store'),
    trackIconLayer: document.querySelector<HTMLElement>('.track-icons-layer'),
    mapImg: document.querySelector<HTMLImageElement>('.base-map'),
    pathGenControls: document.querySelector<HTMLImageElement>('.map-controls'),
    generateButton: document.querySelector<HTMLButtonElement>('.generate-button'),
    pathModeSelect: document.querySelector<HTMLSelectElement>('.path-options-dropdown'),
    selectedTrackEnd: document.querySelector<HTMLInputElement>('.selected-track-end'),
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

  // allow to pass the same elements to each listener
  const {
    trackMapStore,
    selectedTrackStore,
    trackIconLayer,
    mapImg,
    pathGenControls,
    generateButton,
    pathModeSelect,
    selectedTrackEnd,
    includeSingleTrackCheck,
  } = refs as {
    trackMapStore: HTMLElement
    selectedTrackStore: HTMLElement;
    trackIconLayer: HTMLElement;
    mapImg: HTMLImageElement;
    pathGenControls: HTMLImageElement;
    generateButton: HTMLButtonElement;
    pathModeSelect: HTMLSelectElement;
    selectedTrackEnd: HTMLInputElement;
    includeSingleTrackCheck: HTMLInputElement;
  };

  // loading in the tracks data
  const tracks: TrackMap = await loadTracks();
  console.log('Tracks loaded:', tracks);

  // handling of button disable (with override because html was being ignored)
  generateButton.disabled = true;
  generateButton.addEventListener('click', () => handleGenerateButtonClick(
    selectedTrackStore,
    pathModeSelect,
    selectedTrackEnd,
    includeSingleTrackCheck
  ));

  // override because html default not applying
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