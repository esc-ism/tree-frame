import {Config} from './types';
import stop from './stop';

import Root from './tree/nodes/root';

function setTitle(title: string) {
    const titleElement = document.getElementById('title');

    titleElement.innerText = title;

    titleElement.title = title;
}

function loadClosers(root: Root) {
    const closeButton = document.getElementById('close');
    const backgroundElement = document.getElementById('modal-background');
    const stopBound = () => void stop(root.getDataTree());

    closeButton.addEventListener('click', stopBound);

    window.addEventListener('click', (event) => {
        if (event.target === backgroundElement) {
            stopBound();
        }
    });
}

function setupDragScrolling(trackerCount = 25) {
    const DELTA_MULTIPLIER = 4;
    const DELTA_POWER = 1.5;

    const frame = document.getElementById('object-page');

    const getTrackers = () => {
        const trackerHeight = 100 / trackerCount;
        const trackers = [];
        const trackerRadius = (trackerCount - 1) / 2;

        const getScroll = (deltaY) => {
            const normalised = deltaY / trackerCount;

            return normalised * Math.pow(Math.abs(normalised), DELTA_POWER);
        }

        for (let i = 0; i < trackerCount; i++) {
            const dragVector = getScroll((trackerRadius - i) * DELTA_MULTIPLIER);
            const tracker = document.createElement('section');

            // Store data
            tracker.setAttribute('top', `${trackerHeight * i}`);

            // Size and position
            tracker.style.position = 'absolute';
            tracker.style.height = `${trackerHeight}%`;
            tracker.style.width = '100%';
            tracker.style.top = `${tracker.getAttribute('top')}%`;

            tracker.ondragenter = () => {
                const scroll = setInterval(() => {
                    frame.scrollTop -= dragVector;
                }, 5);

                tracker.ondragleave = () => clearInterval(scroll);
            };

            trackers.push(tracker);
        }

        return trackers;
    };

    const parent = document.querySelector('#object-scroll-area');

    for (let tracker of getTrackers()) {
        parent.appendChild(tracker);
    }
}

export default function start(config: Config) {
    const root = new Root(config.tree);

    setTitle(config.title);
    loadClosers(root);
    setupDragScrolling();
}
