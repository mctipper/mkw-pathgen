import { dfsTraversal } from './dfs';
import type { TrackMap } from '../types/track';
import { debugLog, log } from '../utils/log';

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
    debugLog(`Traversed VS (${races} races): ${path}`)

    if (endWithSelected) path = path.reverse();
    debugLog(`Resulting VS (${races} races): ${path}`)

    // if no path can be found, return empty - handled elsewhere
    if (path.length < dfsPathLength) {
        const adjective: string = endWithSelected ? 'to' : 'from';
        log(`No VS (${races} races) found ${adjective} ${trackMap[selectedId].names.en_gb}`)
        return []
    }
    return path;
}
