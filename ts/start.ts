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

export default function start(config: Config) {
    const root = new Root(config.tree);

    setTitle(config.title);
    loadClosers(root);
}
