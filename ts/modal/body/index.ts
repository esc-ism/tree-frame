import {MODAL_BODY_ID} from './consts';
import generateTrees from './trees';
import generateCSS from './css';

import {Config} from '../../validation/types';

export default function generate({data, userStyles, devStyle}: Config) {
    generateCSS();

    const element = document.createElement('div');

    element.id = MODAL_BODY_ID;

    element.append(generateTrees(data, userStyles, devStyle));

    return element;
}
