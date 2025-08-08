import { dfsTraversal } from './dfs';
import type { TrackMap } from '../types/track';

export function generateVSMode(
    trackMap: TrackMap,
    selectedId: string,
    races: number,
    endWithSelected: boolean,
    includeRepeat: boolean
): string[] {
    const direction = endWithSelected ? 'backward' : 'forward';
    const dfsPathLength = races + 1; // length of path is actually number of tracks + 1
    const allowRevisit = true;
    let path = dfsTraversal(trackMap, selectedId, direction, dfsPathLength, includeRepeat, allowRevisit);
    console.debug(`First: ${path}`)

    if (endWithSelected) path = path.reverse();
    console.debug(`Second: ${path}`)

    // if no path can be found, return empty - handled elsewhere
    if (path.length < dfsPathLength) {
        return []
    }
    return path;
}
