import type { TrackMap } from '../types/track';

export async function loadTracks(): Promise<TrackMap> {
  const response = await fetch('/data/tracks.json');
  if (!response.ok) {
    throw new Error(`Failed to load tracks: ${response.status}`);
  }
  return await response.json();
}