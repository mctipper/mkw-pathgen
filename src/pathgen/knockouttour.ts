import { dfsTraversal } from './dfs';
import type { TrackMap } from '../types/track';
import { debugLog, log } from '../utils/log';

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
    debugLog(`Traversed Knockout Tour: ${path}`)

    if (endWithSelected) path = path.reverse();
    debugLog(`Resulting Knockout Tour: ${path}`)

    // if no path can be found, return empty - handled elsewhere
    if (path.length < dfsPathLength) {
        const adjective: string = endWithSelected ? 'to' : 'from';
        log(`No Knockout Tour found ${adjective} ${trackMap[selectedId].names.en_gb}`)
        return []
    }
    return path;
}
