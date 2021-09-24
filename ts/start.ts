import {Config} from './types';
import stop from './stop';

import Root from './tree/nodes/root';

function setTitle(title: string) {
    const titleElement = document.getElementById('title');

    titleElement.innerText = title;
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

function setupDragScrolling(trackerCount = 20) {
    const scroller = Root.instance.element.parentElement.parentElement;

    const getTrackers = () => {
        const trackerHeight = 100 / trackerCount;
        const trackers = [];

        for (let i = 0; i < trackerCount; i++) {
            const yVector = (trackerCount - 1) / 2 - i;
            const dragVector = (yVector * Math.pow(Math.abs(yVector), 2)) / (trackerCount * 2);
            const tracker = document.createElement('section');

            // Store data
            tracker.setAttribute('top', `${trackerHeight * i}`);
            tracker.setAttribute('yVector', `${yVector}`);

            // Size and position
            tracker.style.position = 'absolute';
            tracker.style.height = `${trackerHeight}%`;
            tracker.style.width = '100%';
            tracker.style.top = `${tracker.getAttribute('top')}%`;

            tracker.ondragenter = function () {
                const scroll = setInterval(() => {
                    scroller.scrollTop -= dragVector;
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
