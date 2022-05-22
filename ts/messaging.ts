import {EVENTS} from './consts';

let target;

export function setTarget(_target) {
    target = _target;
}

export function sendMessage(message) {
    window.parent.postMessage(message, target);
}

export function resolvePredicatePromise(response: any, resolve: Function, reject: Function) {
    if (typeof response === 'string') {
        reject(response);
    } else if (Boolean(response)) {
        resolve();
    } else {
        reject();
    }
}

let count = 0;

export function getPredicateResponse(predicateId: number, arg: any): Promise<void> {
    return new Promise((resolve, reject) => {
        const messageId = count++;

        const listener = (message) => {
            if (message.origin !== target || message.data.messageId !== messageId) {
                return;
            }

            window.removeEventListener('message', listener);

            resolvePredicatePromise(message.data.predicateResponse, resolve, reject);
        };

        window.addEventListener('message', listener);

        sendMessage({
            'event': EVENTS.PREDICATE,
            messageId,
            predicateId,
            arg,
        });
    });
}
