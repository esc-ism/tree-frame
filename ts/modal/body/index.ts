import {MODAL_BODY_ID} from './consts';
import generateTrees from './trees';
import generateCSS from './css';

import {getActiveStyle} from './trees/style';
import {setTree} from './trees/data';

import updateStylesheet from './trees/style/update';

import {generateEave} from '@nodes/actions/highlight';

import {EVENTS} from '@/consts';
import {isEventMessage} from '@/messaging';
import type {Config} from '@types';

export default function generate({userTree, defaultTree, userStyles, defaultStyle}: Config) {
    updateStylesheet(getActiveStyle(userStyles, defaultStyle));

    generateCSS();

    const element = document.createElement('div');

    element.id = MODAL_BODY_ID;

    element.append(
        generateTrees(userTree ?? defaultTree, userStyles, defaultStyle),
        generateEave(),
    );

    window.addEventListener('message', (message) => {
        if (!isEventMessage(message, EVENTS.RESET)) {
            return;
        }

        setTree(defaultTree);
    });

    return element;
}
