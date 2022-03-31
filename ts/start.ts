import {Config} from './types';
import stop from './stop';

import Root from './tree/nodes/root';

function setTitle(title: string) {
    const titleElement = document.getElementById('title');

    titleElement.innerText = title;
    // In case the text is too long to fit
    titleElement.title = title;
}

function setupLabelToggle() {
    const root = document.getElementById('object-tree');
    const button = document.getElementById('toggle-labels');

    let isActive = false;

    button.addEventListener('click', () => {
        if (isActive) {
            button.classList.remove('active');
            root.classList.remove('locked');
        } else {
            button.classList.add('active');
            root.classList.add('locked');
        }

        isActive = !isActive;
    });
}

function setupExit(root: Root) {
    const button = document.getElementById('close');
    const background = document.getElementById('modal-background');
    const doExit = () => {
        stop(root.getDataTree());
    }

    button.addEventListener('click', doExit);

    window.addEventListener('click', (event) => {
        if (event.target === background) {
            doExit();
        }
    });
}

export default function start(config: Config) {
    const root = new Root(config.tree);

    setTitle(config.title);

    // TODO Maybe set up a button for hiding leaves? ScrollIntoView focused node on toggle

    setupLabelToggle();

    setupExit(root);
}
