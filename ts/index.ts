import {PASSWORD, EVENTS} from './consts';

import validate from './validation';

// Dynamic imports for smaller bundles

function start(config) {
    import(/* webpackPrefetch: true */ './modal').then(({default: _start}) => {
        _start(config);
    });
}

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
    import('./modal/body/trees/data/examples').then(async ({default: getConfig}) => {
        // Show an example tree when not used as an iFrame
        getConfig().then(({default: config}) => start(config));
    });
} else {
    window.addEventListener('message', onInit);

    // Inform the frame's parent that it's ready to receive data
    window.parent.postMessage({
        'event': EVENTS.START,
        'password': PASSWORD
    }, '*');
}
