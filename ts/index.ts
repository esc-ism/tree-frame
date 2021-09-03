import {Config} from './types';
import stop from './stop';

function setTitle(title: string) {
    const titleElement = document.getElementById('title');

    titleElement.innerText = title;
}

function loadClosers(root) {
    const closeButton = document.getElementById('close');
    const backgroundElement = document.getElementById('modal-background');
    const stopBound = () => stop(root.sub.map(tree => tree.getValueTree()));

    closeButton.addEventListener('click', stopBound);

    window.addEventListener('click', (event) => {
        if (event.target === backgroundElement) {
            stopBound();
        }
    });
}

function setupNodeCreation(root) {
    objectCreator.parentElement.ondragstart = function (event) {
        event.stopPropagation();

        objectCreator.classList.add('empty');

        root.forEach()

        objectCreator.parentElement.ondragend = () => {
            objectCreator.classList.remove('empty');
        };
    };
}

function setupNodeDestruction() {
    const destroyedFile = objectDestroyer.querySelector('#recycled-file');
    let enterCount = 0;

    objectDestroyer.addEventListener('drop', function () {
        enterCount = 0;

        destroyedFile.classList.add('empty');
    });

    objectDestroyer.ondragenter = (event) => {
        handleEnter(event, true);

        enterCount++;

        destroyedFile.classList.remove('empty');

        objectDestroyer.ondragleave = () => {
            enterCount--;

            if (enterCount === 0) {
                destroyedFile.classList.add('empty');
            }
        };
    };

    objectDestroyer.ondragover = (event) => handleEnter(event, true);
}

function setupDragScrolling(trackerCount = 20) {
    const scroller = RootNode.instance.element.parentElement.parentElement;

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
    const root = new RootNode(config.tree);

    setTitle(title);
    loadClosers(root);

    if (defaultTrees) {
        setupNodeCreation(defaultTrees);
        setupNodeDestruction();
        setupDragScrolling();
    } else {
        document.getElementById('object-page').classList.add('fixed');
    }
}
