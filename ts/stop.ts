import {EVENTS} from './consts';

import {onInit} from './index';

const event = EVENTS.STOP;

export default function stop(tree) {
    window.removeEventListener('message', onInit);

    window.parent.postMessage({event, tree}, '*');
}
