import Config from './types';

function setTitle(title: string) {
    const titleElement = document.getElementById('title');

    titleElement.innerText = title;
}

function loadClosers(root) {
    const closeButton = document.getElementById('close');
    const backgroundElement = document.getElementById('modal-background');
    const doPost = () => postMessage('close', root.sub.map(tree => tree.getValueTree()));

    closeButton.onclick = doPost;

    window.onclick = (event) => {
        if (event.target === backgroundElement) {
            doPost();
        }
    };
}

function setupNodeCreation() {
    const getParentalValidityArrays = (nodes) => {
        const valid = [];
        const invalid = [];
        const getArrays = RootNode.instance.getParentalValidityArrays.bind(RootNode.instance);

        for (let node of nodes) {
            const arrays = getArrays(node);

            valid.push(...arrays.valid);
            invalid.push(...arrays.invalid);
        }

        return {valid, invalid};
    };

    objectCreator.parentElement.ondragstart = function(event) {
        event.stopPropagation();

        const defaultNodes = defaultTrees.map((tree, i) => new KeyNode(tree, undefined, i + 1));
        const parentalValidityArrays = getParentalValidityArrays(defaultNodes);
        let connectedDefaultNode;

        objectCreator.classList.add('empty');

        for (let reject of parentalValidityArrays.invalid) {
            reject.element.ondragenter = (event) => {
                handleEnter(event, false);

                AdviceManager.instance.notify('reject');
            };

            reject.element.ondragover = (event) => handleEnter(event, false);
        }

        for (let parent of parentalValidityArrays.valid) {
            parent.element.ondragover = (event) => handleEnter(event, true);

            parent.element.ondragenter = function(event) {
                handleEnter(event, true);

                // Remove old branch
                if (connectedDefaultNode !== undefined) {
                    connectedDefaultNode.disconnect();
                }

                // Connect new branch
                connectedDefaultNode = defaultNodes[parent.depth];
                parent.addChild(connectedDefaultNode, 0);

                // Special case for pinning a newly added child if it's the first branch to be added to the root
                if (parent.depth === 0 && parent.sub.length === 1) {
                    connectedDefaultNode.pin();
                }

                // Remove old editor interface. Not necessary but seems like a good UX feature to me
                clickHandler.unclick();

                AdviceManager.instance.notify('create');
            };
        }

        objectCreator.parentElement.ondragend = () => {
            objectCreator.classList.remove('empty');
        };
    };
}

function setupNodeDestruction() {
    const destroyedFile = objectDestroyer.querySelector('#recycled-file');
    let enterCount = 0;

    objectDestroyer.addEventListener('drop', function() {
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

            tracker.ondragenter = function() {
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
