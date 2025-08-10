import { getAllTrackIcons } from "./getAllTrackIcons";

// global draw gen id
let currentDrawId = 0;

export function resetPathIcons(path: string[]) {
    // remove previous
    let allIcons = getAllTrackIcons();
    allIcons.forEach(icon => {
        icon.classList.remove('path')
    })
    // apply new
    path.forEach(id => {
        const el = document.getElementById(id);
        if (el && !el.classList.contains('path')) {
            el.classList.add('path');
        }
    });
}

export function resetPathLines() {
    // just call renderPathLines with an empty array to reset AND interupt
    renderPathLines([]);
}

export function scaleCircle(mapImg: HTMLImageElement): number {
    return mapImg.height / 15;
}

export async function renderPathLines(path: string[]) {
    // invalidate previous (if any)
    const drawId = ++currentDrawId;
    const svg = document.querySelector('.path-lines-layer') as SVGSVGElement;
    if (!svg) return;

    const mapImg = document.querySelector<HTMLImageElement>('.base-map')
    if (!mapImg) return;

    // reset all previous
    svg.innerHTML = '';
    resetPathIcons(path);

    // centre of each icon, using the images to ensure scaling issues are handled
    const getCenter = (el: HTMLElement): [number, number] => {
        const rect = el.getBoundingClientRect();
        const svgRect = svg.getBoundingClientRect();
        return [
            rect.left + rect.width / 2 - svgRect.left,
            rect.top + rect.height / 2 - svgRect.top
        ];
    };

    const isCancelled = () => drawId !== currentDrawId;

    const animateStrokeReveal = async (el: SVGGeometryElement, fallbackLength: number) => {
        const dashArray = el.getAttribute('stroke-dasharray');
        const length = dashArray ?? fallbackLength.toString();

        el.setAttribute('stroke-dasharray', length);
        el.setAttribute('stroke-dashoffset', length);

        svg.appendChild(el);

        const animation = el.animate([
            { strokeDashoffset: parseFloat(length) },
            { strokeDashoffset: 0 }
        ], {
            duration: 500,
            easing: 'ease-out',
            fill: 'forwards'
        });

        return animation.finished;
    };

    const drawLineInstant = (
        x1: number, y1: number, x2: number, y2: number,
        stroke: string, width: string, opacity: string
    ) => {
        if (isCancelled()) return;
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M ${x1} ${y1} L ${x2} ${y2}`);
        path.setAttribute('stroke', stroke);
        path.setAttribute('stroke-width', width);
        path.setAttribute('opacity', opacity);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-linecap', 'round');
        svg.appendChild(path);
    };

    const createAnimatedLine = (
        x1: number, y1: number, x2: number, y2: number,
        stroke: string, width: string, dashArray?: string
    ): SVGPathElement => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M ${x1} ${y1} L ${x2} ${y2}`);
        path.setAttribute('stroke', stroke);
        path.setAttribute('stroke-width', width);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-linecap', 'round');
        if (dashArray) path.setAttribute('stroke-dasharray', dashArray);
        return path;
    };

    const createAnimatedCircle = (
        x: number, y: number,
        stroke: string, width: number, dashArray?: string
    ): SVGCircleElement => {
        const radius = mapImg.height / 15;
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x.toString());
        circle.setAttribute('cy', y.toString());
        circle.setAttribute('r', radius.toString());
        circle.setAttribute('stroke', stroke);
        circle.setAttribute('stroke-width', width.toString());
        circle.setAttribute('fill', 'none');
        if (dashArray) circle.setAttribute('stroke-dasharray', dashArray);
        return circle;
    };

    // main loop to draw the path links

    // draw all solid black lines instantly
    const solidLineOpacity: string = '0.8';
    for (let i = 0; i < path.length - 1; i++) {
        if (isCancelled()) return;
        const fromEl = document.getElementById(path[i]);
        const toEl = document.getElementById(path[i + 1]);
        if (!fromEl || !toEl) continue;

        const [x1, y1] = getCenter(fromEl);
        const [x2, y2] = getCenter(toEl);

        if (path[i] === path[i + 1]) {
            const radius = mapImg.height / 15;
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', x1.toString());
            circle.setAttribute('cy', y1.toString());
            circle.setAttribute('r', radius.toString());
            circle.setAttribute('stroke', 'black');
            circle.setAttribute('stroke-width', '16');
            circle.setAttribute('fill', 'none');
            circle.setAttribute('opacity', solidLineOpacity);
            svg.appendChild(circle);
        } else {
            drawLineInstant(x1, y1, x2, y2, 'black', '16', solidLineOpacity);
        }
    }

    // animate white and dashed black lines sequentially
    for (let i = 0; i < path.length - 1; i++) {
        if (isCancelled()) return;
        const fromEl = document.getElementById(path[i]);
        const toEl = document.getElementById(path[i + 1]);
        if (!fromEl || !toEl) continue;

        const [x1, y1] = getCenter(fromEl);
        const [x2, y2] = getCenter(toEl);

        if (path[i] === path[i + 1]) {
            // single-track, draw a circle
            const white = createAnimatedCircle(x1, y1, 'white', 10);
            const dashed = createAnimatedCircle(x1, y1, 'black', 2, '6,4');
            const radius = mapImg.height / 15;
            const length = 2 * Math.PI * radius;

            await Promise.all([
                animateStrokeReveal(white, length),
                animateStrokeReveal(dashed, length)
            ]);
        } else {
            // intermission, draw the link
            const white = createAnimatedLine(x1, y1, x2, y2, 'white', '10');
            const dashed = createAnimatedLine(x1, y1, x2, y2, 'black', '2', '6,4');
            const length = white.getTotalLength();

            await Promise.all([
                animateStrokeReveal(white, length),
                animateStrokeReveal(dashed, length)
            ]);
        }
    }
}
