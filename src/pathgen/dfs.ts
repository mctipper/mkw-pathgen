import type { TrackMap } from '../types/track';
import { shuffle } from './shuffleHelper';


export function dfsTraversal(
    trackMap: TrackMap,
    startId: string,
    direction: 'forward' | 'backward',
    maxLength: number,
    includeRepeat: boolean = false,
    allowRevisit: boolean = false
): string[] {
    const path: string[] = [];
    const visitedTracks = new Set<string>();
    const visitedLinks = new Set<string>();

    // simple dfs traversal
    const traverse = (currentId: string) => {
        if (path.length >= maxLength) return;

        path.push(currentId)

        const track = trackMap[currentId];
        if (!track) return;

        // allow for 'end with selected' checkbox option, and also allowRepeat add the current track to the mix
        const children = includeRepeat ? [...track.children, track.id] : track.children;
        const parents = includeRepeat ? [...track.parents, track.id] : track.parents;
        const nextIds = direction === 'forward' ? shuffle(children) : shuffle(parents);
        console.debug(currentId, nextIds)

        for (const nextId of nextIds) {
            // path found at correct length
            if (path.length >= maxLength) break;

            // no 'u-turns'
            if (path.length >= 2 && path[path.length - 2] === nextId) continue;

            // determine if next track already visited (if revist denied)
            if (!allowRevisit && visitedTracks.has(nextId)) continue;

            // determine if next path traversed already 
            // (also prevents multiple single-track events of the same track)
            const linkKey = `${currentId}->${nextId}`;
            if (visitedLinks.has(linkKey)) continue;

            // new traversal found, give it a go
            visitedTracks.add(nextId);
            visitedLinks.add(linkKey);
            traverse(nextId);
        }
    };

    // kick it off
    traverse(startId);

    return path.slice(0, maxLength);
}
