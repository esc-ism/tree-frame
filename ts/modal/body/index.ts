import {MODAL_BODY_ID} from './consts';
import generateTrees from './trees';
import generateCSS from './css';

import {getActiveStyle} from './trees/style';

import updateStylesheet from './trees/style/update';

import {generateEave} from '@nodes/actions/highlight';

import type {Config} from '@types';

export default function generate({userTree, defaultTree, userStyles, defaultStyle}: Config) {
    updateStylesheet(getActiveStyle(userStyles, defaultStyle));

    generateCSS();

    const element = document.createElement('div');

    element.id = MODAL_BODY_ID;

    element.append(
        generateTrees(userTree ?? defaultTree, userStyles, defaultStyle),
        generateEave()
    );

    return element;
}
