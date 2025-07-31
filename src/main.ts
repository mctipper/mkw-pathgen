import './style.css';
import { syncElementToImage } from './ui/syncToBase';
import { loadTracks } from './data/tracks';
import { renderTrackIcons } from './ui/renderTrackIcons';

import type { TrackMap } from './types/track';

const trackIconLayer = document.querySelector<HTMLElement>('.track-icons-layer')!;
const mapImg = document.querySelector<HTMLImageElement>('.base-map')!;

async function init() {
  // loading in the tracks data
  let tracks: TrackMap = await loadTracks();
  console.log('Tracks loaded:', tracks);
  
  // syncing to base image size
  if (mapImg.complete) {
    syncElementToImage(trackIconLayer, mapImg);
    renderTrackIcons(tracks, trackIconLayer, mapImg);
  } else {
    mapImg.addEventListener('load', () => {
      syncElementToImage(trackIconLayer, mapImg);
      renderTrackIcons(tracks, trackIconLayer, mapImg);
    });
  }
  window.addEventListener('resize', () => {
    syncElementToImage(trackIconLayer, mapImg);
    renderTrackIcons(tracks, trackIconLayer, mapImg);
  });
}

init();