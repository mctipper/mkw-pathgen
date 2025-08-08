import type { Track, TrackMap } from '../types/track';

export async function loadTracks(): Promise<TrackMap> {
  const [trackResponse, adjacencyResponse] = await Promise.all([
    fetch(`${import.meta.env.BASE_URL}/data/tracks.json`),
    fetch(`${import.meta.env.BASE_URL}/data/adjacency.json`)
  ]);

  if (!trackResponse.ok) {
    throw new Error('Failed to load tracks.json data');
  }
  if (!adjacencyResponse.ok) {
    throw new Error('Failed to load adjacency.json data');
  }

  const rawTracks: Record<string, Omit<Track, 'id' | 'parents' | 'children'>> = await trackResponse.json();
  const adjacency: Record<string, string[]> = await adjacencyResponse.json();

  const trackMap: TrackMap = {};

  // populate track map with just the tracks data first
  for (const [id, track] of Object.entries(rawTracks)) {
    trackMap[id] = {
      id,
      ...track,
      parents: [],
      children: []
    };
  }

  // iterate over the adjacency list, populating children and then the parents of each child
  for (const [parentId, childIds] of Object.entries(adjacency)) {
    trackMap[parentId].children = childIds;
    for (const childId of childIds) {
      trackMap[childId].parents.push(parentId);
    }
  }

  return trackMap;
}