import { dfsTraversal } from './dfs';
import type { TrackMap } from '../types/track';

export function generateKnockoutTour(
    trackMap: TrackMap,
    selectedId: string,
    endWithSelected: boolean,
): string[] {
    const direction = endWithSelected ? 'backward' : 'forward';
    const dfsPathLength = 6;
    const includeRepeat = false;
    const allowRevisit = false;
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
