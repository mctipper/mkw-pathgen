import './style.css';
import { syncElementToImage, syncElementWidthToImage } from './ui/syncToBase';
import { renderTrackIcons } from './ui/renderTrackIcons';
import { disableGenerateButton } from './ui/toggleGenerateButton';
import { handleGenerateButtonClick } from './logic/handleGenerateButtonClick';
import { updateSingleTrackCheckboxState } from './logic/handleDropdownSelect';
import { initTrackMapStore } from './stores/TrackMapStore';


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
    selectedTrackEndCheck: document.querySelector<HTMLInputElement>('.selected-track-end'),
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
    selectedTrackEndCheck,
    includeSingleTrackCheck,
  } = refs as {
    trackMapStore: HTMLElement
    selectedTrackStore: HTMLElement;
    trackIconLayer: HTMLElement;
    mapImg: HTMLImageElement;
    pathGenControls: HTMLImageElement;
    generateButton: HTMLButtonElement;
    pathModeSelect: HTMLSelectElement;
    selectedTrackEndCheck: HTMLInputElement;
    includeSingleTrackCheck: HTMLInputElement;
  };

  // loading in the tracks data
  await initTrackMapStore(trackMapStore);

  // handling of button disable (with override because html was being ignored)
  disableGenerateButton();
  generateButton.addEventListener('click', () => handleGenerateButtonClick(
    selectedTrackStore,
    pathModeSelect,
    selectedTrackEndCheck,
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
    renderTrackIcons(trackIconLayer, mapImg);
  }

  // upon load or resize
  if (mapImg.complete) {
    render();
  } else {
    mapImg.addEventListener('load', render);
  }
  window.addEventListener('resize', render);
}

init();