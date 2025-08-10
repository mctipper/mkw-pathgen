import { dfsTraversal } from './dfs';
import type { TrackMap } from '../types/track';
import { debugLog, log } from '../utils/log';

export function generateGrandPrix(
    trackMap: TrackMap,
    selectedId: string,
    endWithSelected: boolean,
): string[] {
    const direction = endWithSelected ? 'backward' : 'forward';
    const dfsPathLength = 4;
    const includeRepeat = false;
    const allowRevisit = false;
    let path = dfsTraversal(trackMap, selectedId, direction, dfsPathLength, includeRepeat, allowRevisit);
    debugLog(`Traversed Grand Prix: ${path}`)

    if (endWithSelected) {
        path = path.reverse();
    }
    // for grand prix, first race is always a single-track
    path.unshift(path[0])
    debugLog(`Resulting Grand Prix: ${path}`)

    // '5' is used because of unshift use of generating a single-track race before 3x intermissions
    const gpPathLength = 5;
    // if no path can be found, return empty - handled elsewhere
    if (path.length < gpPathLength) {
        const adjective: string = endWithSelected ? 'to' : 'from';
        log(`No Grand Prix found ${adjective} ${trackMap[selectedId].names.en_gb}`)
        return []
    }
    return path;
}
