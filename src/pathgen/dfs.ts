import type { TrackMap } from '../types/track';
import { shuffle } from './shuffleHelper';

export function dfsTraversal(
    trackMap: TrackMap,
    startId: string,
    direction: 'forward' | 'backward',
    maxLength: number,
    includeRepeat: boolean = false
): string[] {
    const visited = new Set<string>();
    const path: string[] = [];

    const addTrack = (id: string) => {
        if (!visited.has(id)) {
            path.push(id);
            visited.add(id);
        } else if (includeRepeat && path[path.length - 1] !== id) {
            // specifically for vs* mode, allow one 'repeat' which will be translated as a single-track race
            path.push(id);
        }
    };

    // simple dfs traversal
    const traverse = (currentId: string) => {
        if (path.length >= maxLength) return;

        const track = trackMap[currentId];
        if (!track) return;

        addTrack(currentId);

        // allow for 'end with selected' checkbox option
        const nextIds = direction === 'forward' ? shuffle(track.children) : shuffle(track.parents);
        for (const nextId of nextIds) {
            if (path.length >= maxLength) break;
            // recursion in the browser...
            traverse(nextId);
        }
    };

    // kick it off
    traverse(startId);

    return path.slice(0, maxLength);
}
