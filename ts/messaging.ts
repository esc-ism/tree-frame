import {EVENTS, PASSWORD} from './consts';

let target;
let targetId = (new URLSearchParams(window.location.search)).get('id');

export function setTarget(_target) {
	target = _target;
}

export function isEventMessage({origin, 'data': {password, event, id}}, targetEvent) {
	return (!target || origin === target) && id === targetId && password === PASSWORD && event === targetEvent;
}

export function sendMessage(message) {
	window.parent.postMessage({...message, id: targetId}, target ?? '*');
}

export function resolvePredicatePromise(response: any, resolve: Function, reject: Function) {
	if (typeof response === 'string') {
		reject(response);
	} else if (response) {
		resolve();
	} else {
		reject();
	}
}

let nextMessageId = 0;

export function getPredicateResponse(predicateId: number, arg: any): Promise<void> {
	return new Promise((resolve, reject) => {
		const messageId = nextMessageId++;
		
		const listener = (message) => {
			if (!isEventMessage(message, EVENTS.PREDICATE) || message.data.messageId !== messageId) {
				return;
			}
			
			window.removeEventListener('message', listener);
			
			resolvePredicatePromise(message.data.predicateResponse, resolve, reject);
		};
		
		window.addEventListener('message', listener);
		
		sendMessage({
			event: EVENTS.PREDICATE,
			messageId,
			predicateId,
			arg,
		});
	});
}
