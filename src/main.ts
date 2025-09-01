import './style.css';
import { syncElementToImage, syncElementWidthToImage, syncIconsToImage } from './ui/syncToBase';
import { renderTrackIcons } from './ui/renderTrackIcons';
import { disableGenerateButton } from './ui/toggleGenerateButton';
import { handleGenerateButtonClick } from './logic/handleGenerateButtonClick';
import { updateSingleTrackCheckboxState } from './logic/handleDropdownSelect';
import { initTrackMapStore } from './stores/TrackMapStore';
import { initRaceNameStore } from './stores/RaceNameStore';


async function init() {
  const version = __APP_VERSION__;
  console.log(version);

  // validate that all require DOM layers have loaded
  const refs = {
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
    trackIconLayer,
    mapImg,
    pathGenControls,
    generateButton,
    pathModeSelect,
    selectedTrackEndCheck,
    includeSingleTrackCheck,
  } = refs as {
    trackIconLayer: HTMLElement;
    mapImg: HTMLImageElement;
    pathGenControls: HTMLImageElement;
    generateButton: HTMLButtonElement;
    pathModeSelect: HTMLSelectElement;
    selectedTrackEndCheck: HTMLInputElement;
    includeSingleTrackCheck: HTMLInputElement;
  };

  // loading in the tracks data and race names
  await initTrackMapStore();
  await initRaceNameStore();

  // handling of button disable (with override because html was being ignored)
  disableGenerateButton();
  generateButton.addEventListener('click', () => handleGenerateButtonClick(
    pathModeSelect,
    selectedTrackEndCheck,
    includeSingleTrackCheck
  ));

  // override because html default not applying
  updateSingleTrackCheckboxState(pathModeSelect.value, includeSingleTrackCheck);
  pathModeSelect.addEventListener('change', () =>
    updateSingleTrackCheckboxState(pathModeSelect.value, includeSingleTrackCheck)
  );

  // sync to base image size
  function sync() {
    syncElementToImage(trackIconLayer, mapImg);
    syncElementWidthToImage(pathGenControls, mapImg);
    syncIconsToImage(mapImg);
  }


  // render the icons first then sync
  function render() {
    renderTrackIcons(trackIconLayer, mapImg)
    sync();
  }

  // render upon map load, then sync upon resize
  if (mapImg.complete) {
    render();
  } else {
    mapImg.addEventListener('load', render);
  }
  window.addEventListener('resize', sync);
}

init();