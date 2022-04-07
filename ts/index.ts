import {PASSWORD, EVENTS} from './consts';

import validate from './validation';

import start from './modal';

export function onInit({data}) {
    const {password, ...config} = data;

    // Ignore scripts that send messages to every frame
    if (password === PASSWORD) {
        try {
            validate(config);
        } catch (error) {
            window.parent.postMessage({
                'event': EVENTS.ERROR,
                'reason': error.message
            }, '*');
        }

        window.removeEventListener('message', onInit);

        start(config);
    }
}

// TODO use window.opener?
if (window.parent === window) {
    // Show an example tree when not used as an iFrame
    start();
} else {
    window.addEventListener('message', onInit);

    // Inform the frame's parent that it's ready to receive data
    window.parent.postMessage({
        'event': EVENTS.START,
        'password': PASSWORD
    }, '*');
}
