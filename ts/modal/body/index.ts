import {MODAL_BODY_ID} from './consts';
import generateTrees from './trees';
import generateCSS from './css';

import {getActiveStyle} from './trees/style';

import updateStylesheet from './trees/style/update';

import {generateEave} from './trees/nodes/actions/focus';

import type {Config} from '../../validation/types';

export default function generate({tree, userStyles, defaultStyle}: Config) {
    updateStylesheet(getActiveStyle(userStyles, defaultStyle));

    generateCSS();

    const element = document.createElement('div');

    element.id = MODAL_BODY_ID;

    element.append(
        generateTrees(tree, userStyles, defaultStyle),
        generateEave()
    );

    return element;
}
