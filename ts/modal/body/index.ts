import {MODAL_BODY_ID} from './consts';
import generateTrees from './trees';
import generateCSS from './css';

import {Config} from '../../validation/types';
import {generateEave} from './trees/nodes/actions/focus';
import updateStylesheet from './trees/style/update';
import {getActiveStyle} from './trees/style';

export default function generate({dataTree, userStyleForest, devStyleTree}: Config) {
    updateStylesheet(getActiveStyle(devStyleTree ? [...userStyleForest, devStyleTree] : userStyleForest));

    generateCSS();

    const element = document.createElement('div');

    element.id = MODAL_BODY_ID;

    element.append(
        generateTrees(dataTree, userStyleForest, devStyleTree),
        generateEave()
    );

    return element;
}
