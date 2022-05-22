import generateCloser from './close';
import generateLabelToggle from './labels';
import generateLeafToggle from './leaves';
import generateStyler from './style';
import generateHider from './hide';
import generateCSS from './css';

import {BUTTON_CONTAINER_ID} from './consts';

export default function generate() {
    generateCSS();

    const element = document.createElement('span');

    element.id = BUTTON_CONTAINER_ID;

    element.append(generateHider());
    element.append(generateLeafToggle());
    element.append(generateLabelToggle());
    element.append(generateStyler());
    element.append(generateCloser());

    return element;
}
