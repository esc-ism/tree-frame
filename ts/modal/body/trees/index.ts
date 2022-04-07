import {TREE_CONTAINER_ID} from './consts';
import generateStyleTree from './style';
import generateDataTree from './data';
import generateCSS from './css';

import Root from './nodes/root';

import {Root as RootJSON, Child as ChildJSON} from '../../../validation/types';
import {BUTTON_ACTIVE_CLASS} from '../../consts';

export const ROOTS = {};

const TREE_CONTAINER = document.createElement('div');

export function setActive(button, actionId, doActivate = true) {
    if (doActivate) {
        button.classList.add(BUTTON_ACTIVE_CLASS);

        TREE_CONTAINER.classList.add(actionId);
    } else {
        button.classList.remove(BUTTON_ACTIVE_CLASS);

        TREE_CONTAINER.classList.remove(actionId);
    }
}

export function generateTree(data: RootJSON, id: string) {
    if (ROOTS[id]) {
        throw new Error(`Attempted to instantiate second tree with id '${id}'.`);
    }

    const root = new Root(data);

    root.element.elementContainer.id = id;

    ROOTS[id] = root;

    return root.element.elementContainer;
}

export default function generate(data: RootJSON, userStyles: Array<ChildJSON>, devStyle?: ChildJSON) {
    generateCSS();

    TREE_CONTAINER.id = TREE_CONTAINER_ID;

    TREE_CONTAINER.append(generateDataTree(data));
    TREE_CONTAINER.append(generateStyleTree(userStyles, devStyle));

    return TREE_CONTAINER;
}
