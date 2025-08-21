import type { TrackMap } from '../types/track';
import { shuffle } from './shuffleHelper';
import { debugLog } from '../utils/log';

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
    // allow one repeat per track only, multi-path trap
    const usedRepeat = new Set<string>();

    // simple dfs traversal
    const traverse = (currentId: string): boolean => {
        if (path.length >= maxLength) return true;

        debugLog(`Traversing from: ${currentId}`)
        path.push(currentId);

        const track = trackMap[currentId];
        if (!track) {
            // early backtrack tarp
            path.pop();
            return false;
        };

        // allow for 'end with selected' checkbox option, and also allowRepeat add the current track to the mix
        const children = includeRepeat ? [...track.children, track.id] : track.children;
        const parents = includeRepeat ? [...track.parents, track.id] : track.parents;
        const nextIds = direction === 'forward' ? shuffle(children) : shuffle(parents);
        debugLog('raw neighbours:', currentId, nextIds);

        // prevent greedy algo, validate the nextIds
        let validatedIds: string[] = [];
        for (const nextId of nextIds) {
            const isRepeat = nextId === currentId;

            // no 'u-turns'
            if (path.length >= 2 && path[path.length - 2] === nextId) {
                debugLog(`Uturn prevented from ${currentId} back to ${nextId}`)
                continue;
            };

            // determine if next track already visited (if revisit denied)
            if (!allowRevisit && visitedTracks.has(nextId) && !isRepeat) {
                debugLog(`Revisited of ${nextId} prevented`)
                continue;
            }

            // prevent rainbow-road single-track option; avoid rainbow road overdose.
            // Occurs too often because only two paths 'out' of rainbow road when traversing
            // the graph backwards, either Peach Stadium or Rainbow Road single-track hence
            // this option is 'found' far too often. Not a true VS traversal but its tidier.
            if (includeRepeat && currentId === '21' && currentId === nextId) {
                debugLog('Rainbow Road single-track prevented purposefully');
                continue;
            }

            // determine if next path traversed already 
            // (also prevents multiple single-track events of the same track)
            const nextLinkKey = `${currentId}->${nextId}`;
            // const linkKeyRev = `${nextId}->${currentId}`; // include 'other direction'
            if (visitedLinks.has(nextLinkKey)) {
                debugLog(`Retracing link ${nextLinkKey} prevented`)
                continue;
            }
            // if (visitedLinks.has(linkKeyRev)) continue;

            // allow one repeat only
            if (isRepeat && usedRepeat.has(currentId)) {
                debugLog(`Dual repeat of ${currentId} prevented`)
                continue;
            }

            // passes screening
            validatedIds.push(nextId);
        }

        debugLog('validated neighbours:', currentId, validatedIds);

        if (validatedIds.length === 0) {
            // nowhere valid to go
            debugLog('No valid neighbours: backtracking')
            path.pop();
            return false;
        }

        for (const validatedId of validatedIds) {
            const isRepeat = validatedId === currentId;

            // new traversal found, give it a go
            if (isRepeat) {
                usedRepeat.add(currentId);
            } else {
                visitedTracks.add(validatedId);
            }

            const validatedLinkKey = `${currentId}->${validatedId}`;
            // const validatedLinkKeyRev = `${validatedId}->${currentId}`;
            visitedLinks.add(validatedLinkKey);
            // visitedLinks.add(validatedLinkKeyRev);

            const success = traverse(validatedId);
            if (success) {
                return true;
            }

            // backtrack if child traversal failed, these links and nodes may be
            // valid elsewhere in the traversal, so remove them as 'visited' for now
            visitedLinks.delete(validatedLinkKey);
            if (isRepeat) {
                usedRepeat.delete(currentId);
            } else {
                visitedTracks.delete(validatedId);
            }
        }

        path.pop();
        return false;
    };

    // kick it off
    traverse(startId);

    return path;
}
