import {MODAL_BACKGROUND_ID, MODAL_ID} from './consts';
import generateCSS from './css';

import generateHeader from './header';
import generateBody from './body';

import {Config} from '@types';

export default function generate(config: Config) {
    generateCSS();

    const background = document.createElement('div');
    const foreground = document.createElement('div');

    background.id = MODAL_BACKGROUND_ID;

    foreground.id = MODAL_ID;

    background.append(foreground);
    document.body.append(background);

    foreground.append(generateHeader(config));
    foreground.append(generateBody(config));
}
