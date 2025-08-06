import './style.css';
import { syncElementToImage, syncElementWidthToImage } from './ui/syncToBase';
import { loadTracks } from './data/tracks';
import { renderTrackIcons } from './ui/renderTrackIcons';

import type { TrackMap } from './types/track';
import { handleButtonClick } from './ui/handleButtonClick';

const trackIconLayer = document.querySelector<HTMLElement>('.track-icons-layer')!;
const mapImg = document.querySelector<HTMLImageElement>('.base-map')!;
const mapControls = document.querySelector<HTMLImageElement>('.map-controls')!;
const generateButton = document.querySelector<HTMLButtonElement>('.generate-button')!;

async function init() {
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
    syncElementWidthToImage(mapControls, mapImg);
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