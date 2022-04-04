import mountActions from './actions';
import example from './example';
import {TREE_CONTAINER, ROOT_ID} from './consts';

import Root from './tree/nodes/root';

import {Config} from '../validation/types';

function setTitle(title: string) {
    const titleElement = document.getElementById('title');

    titleElement.innerText = title;
    // In case the text is too long to fit
    titleElement.title = title;
}

function getRoot(data) {
    const root = new Root(data);

    root.element.elementContainer.id = ROOT_ID;

    TREE_CONTAINER.appendChild(root.element.elementContainer);

    return root;
}

export default function start({title, data, style}: Config = example) {
    setTitle(title);

    mountActions(getRoot(data), style);
}
