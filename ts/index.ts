import {PASSWORD, EVENTS} from './consts';

import validate from './validation';
import {setTarget, sendMessage, isEventMessage} from './messaging';

// Dynamic imports for smaller bundles

function start(config) {
	import(/* webpackPrefetch: true */ './modal').then(({default: _start}) => {
		_start(config);
	});
}

async function onInit(message) {
	if (!isEventMessage(message, EVENTS.START)) {
		return;
	}
	
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const {password, event, id, ...config} = message.data;
	
	setTarget(message.origin);
	
	try {
		try {
			await validate(config);
			
			// Config is valid
			sendMessage({
				event: EVENTS.START,
				tree: config.userTree ?? config.defaultTree,
			});
		} catch (error) {
			if (config.userTree) {
				delete config.userTree;
				
				await validate(config);
				
				// Config is valid with userTree removed
				sendMessage({
					event: EVENTS.RESET,
					tree: config.defaultTree,
					reason: error.message,
				});
			} else {
				throw error;
			}
		}
	} catch (error) {
		// Config is invalid (fatal)
		sendMessage({
			event: EVENTS.ERROR,
			reason: error.message,
		});
		
		return;
	}
	
	window.removeEventListener('message', onInit);
	
	start(config);
}

if (window.parent === window) {
	import('./modal/body/trees/data/examples').then(({default: getConfig}) => {
		// Show an example tree when not used as an iFrame
		getConfig().then(({default: config}) => start(config));
	});
} else {
	window.addEventListener('message', onInit);
	
	// Inform the frame's parent that it's ready to receive data
	sendMessage({
		events: EVENTS,
		password: PASSWORD,
	});
}
