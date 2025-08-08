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

    const animateLine = async (
        x1: number, y1: number, x2: number, y2: number,
        stroke: string, width: string, dashArray?: string
    ) => {
        if (isCancelled()) return;
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const d = `M ${x1} ${y1} L ${x2} ${y2}`;
        path.setAttribute('d', d);
        path.setAttribute('stroke', stroke);
        path.setAttribute('stroke-width', width);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-linecap', 'round');
        if (dashArray) path.setAttribute('stroke-dasharray', dashArray);

        const length = path.getTotalLength();
        path.setAttribute('stroke-dasharray', dashArray ?? length.toString());
        path.setAttribute('stroke-dashoffset', length.toString());

        svg.appendChild(path);

        return path.animate([
            { strokeDashoffset: length },
            { strokeDashoffset: 0 }
        ], {
            duration: 500,
            easing: 'ease-out',
            fill: 'forwards'
        }).finished;
    };

    const animateCircleOverlay = async (x: number, y: number) => {
        if (isCancelled()) return;

        const radius = mapImg.height / 15;

        const createCircle = (stroke: string, width: number, dash?: string, opacity?: number): SVGCircleElement => {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', x.toString());
            circle.setAttribute('cy', y.toString());
            circle.setAttribute('r', radius.toString());
            circle.setAttribute('stroke', stroke);
            circle.setAttribute('stroke-width', width.toString());
            circle.setAttribute('fill', 'none');
            if (dash) circle.setAttribute('stroke-dasharray', dash);
            if (opacity !== undefined) circle.style.opacity = opacity.toString();
            return circle;
        };

        const animateStrokeReveal = async (circle: SVGCircleElement) => {
            const circumference = 2 * Math.PI * radius;
            circle.setAttribute('stroke-dasharray', circumference.toString());
            circle.setAttribute('stroke-dashoffset', circumference.toString());
            svg.appendChild(circle);

            const animation = circle.animate([
                { strokeDashoffset: circumference },
                { strokeDashoffset: 0 }
            ], {
                duration: 500,
                easing: 'ease-out',
                fill: 'forwards'
            });

            return animation.finished;
        };

        // looks better on the circles
        const animateFadeIn = async (circle: SVGCircleElement) => {
            if (isCancelled()) return;
            svg.appendChild(circle);
            const animation = circle.animate([
                { opacity: 0 },
                { opacity: 1 }
            ], {
                duration: 500,
                easing: 'ease-out',
                fill: 'forwards'
            });

            return animation.finished;
        };

        const thickBlack = createCircle('black', 16);
        const white = createCircle('white', 10);
        const dashedBlack = createCircle('black', 2, '6,4', 0);

        await Promise.all([
            animateStrokeReveal(thickBlack),
            animateStrokeReveal(white)
        ]);
        await animateFadeIn(dashedBlack);
    };

    // main loop to draw the path links
    for (let i = 0; i < path.length - 1; i++) {
        if (isCancelled()) return;
        const fromEl = document.getElementById(path[i]);
        const toEl = document.getElementById(path[i + 1]);
        if (!fromEl || !toEl) continue;

        const [x1, y1] = getCenter(fromEl);
        const [x2, y2] = getCenter(toEl);

        if (path[i] === path[i + 1]) {
            // single-track, draw a circle
            await animateCircleOverlay(x1, y1);
        } else {
            // intermission, draw the link
            await Promise.all([
                animateLine(x1, y1, x2, y2, 'black', '16'),
                animateLine(x1, y1, x2, y2, 'white', '10')
            ]);
            await animateLine(x1, y1, x2, y2, 'black', '2', '6,4');
        }
    }
}
