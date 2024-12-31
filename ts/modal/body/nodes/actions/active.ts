import * as highlight from './highlight';
import * as focus from './focus';
import * as position from './buttons/position';

import {getSocket} from '@/modal';

export function reset() {
	for (const action of [position, focus, highlight]) {
		if (action.isActive()) {
			action.reset();
			
			return true;
		}
	}
	
	return false;
}

export function onMount() {
	getSocket().addEventListener('keydown', (event) => {
		if ((event.key === 'Escape' || event.key === 'Backspace') && reset()) {
			event.stopImmediatePropagation();
		}
	});
}
