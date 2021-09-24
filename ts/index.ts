import {PASSWORD, EVENTS} from './consts';

import validate from './validation';
import getExampleConfig from './example';

import start from './start';

export function onInit({data}) {
    const {password, ...config} = data;

    if (password === PASSWORD) {
        try {
            validate(config);

            start(config);
        } catch (error) {
            window.parent.postMessage({
                'event': EVENTS.ERROR,
                'reason': error.message
            }, '*');
        }
    }
}

if (window.parent === window) {
    const config = getExampleConfig();

    validate(config);

    start(config);
} else {
    window.parent.postMessage({
        'event': EVENTS.START,
        'password': PASSWORD
    }, '*');

    window.addEventListener('message', onInit);
}
