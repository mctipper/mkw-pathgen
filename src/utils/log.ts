// spezial log during dev work
export function debugLog(...args: unknown[]) {
    if (import.meta.env.MODE === 'development') {
        console.debug(...args);
    }
}

// for completeness
export function log(...args: unknown[]) {
    console.log(...args);
}