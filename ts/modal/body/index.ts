import {MODAL_BODY_ID} from './consts';
import generateTrees from './trees';
import generateCSS from './css';

import {Config} from '../../validation/types';
import {generateEave} from './trees/nodes/actions/focus';

export default function generate({dataTree, userStyleForest, devStyleTree}: Config) {
    generateCSS();

    const element = document.createElement('div');

    element.id = MODAL_BODY_ID;

    element.append(
        generateTrees(dataTree, userStyleForest, devStyleTree),
        generateEave()
    );

    return element;
}
