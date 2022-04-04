import BUTTON from './button';
import {BUTTON_POSITION, ACTION_ID, ROOT_ID} from './consts';

import {addActionButton} from '../button';

import {BUTTON_CLASS_ACTIVE, TREE_CONTAINER} from '../../consts';

import Root from '../../tree/nodes/root';

import StyleRoot from '../../../validation/style';
import type * as dataTypes from '../../../validation/types';

let isActive = false;

function doAction(styleRoot: Root) {
    if (isActive) {
        BUTTON.classList.remove(BUTTON_CLASS_ACTIVE);

        TREE_CONTAINER.classList.remove(ACTION_ID);
    } else {
        BUTTON.classList.add(BUTTON_CLASS_ACTIVE);

        TREE_CONTAINER.classList.add(ACTION_ID);

        const newStyle = styleRoot.getDataTree();

        // TODO Apply the new style
    }

    isActive = !isActive;
}

function getRoot(data) {
    const root = new Root(data);

    root.element.elementContainer.id = ROOT_ID;

    TREE_CONTAINER.appendChild(root.element.elementContainer);

    return root;
}

export default function mount(style?: dataTypes.Child) {
    if (style) {
        StyleRoot.children.unshift(style);
    }

    addActionButton(BUTTON, BUTTON_POSITION, doAction.bind(null, getRoot(StyleRoot)));
}
