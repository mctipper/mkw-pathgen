import type { Track, TrackMap } from '../types/track';

export async function loadTracks(): Promise<TrackMap> {
  const response = await fetch(`${import.meta.env.BASE_URL}/data/tracks.json`)
  if (!response.ok) {
    throw new Error(`Failed to load tracks: ${response.status}`);
  }

  const rawMap: Record<string, Omit<Track, 'id'>> = await response.json();

  const trackMap: TrackMap = Object.entries(rawMap).reduce((acc, [id, track]) => {
    acc[id] = { id, ...track };
    return acc;
  }, {} as TrackMap);

  return trackMap;
}