import BUTTON from './button';
import {ACTION_ID} from './consts';
import generateCSS from './css';

import {bindAction} from '../button';

import {setActive} from '@/modal/body';

import {getSocket} from '@/modal';

let _isActive = false;
let keyHeld = false;

export function isActive() {
	return _isActive;
}

function doAction(doActivate = !_isActive) {
	setActive(BUTTON, ACTION_ID, doActivate);
	
	_isActive = doActivate;
}

export default function generate(): HTMLElement {
	generateCSS();
	
	bindAction(BUTTON, doAction);
	
	BUTTON.title += ' (Ctrl)';
	
	const {ownerDocument: target} = getSocket();
	
	target.addEventListener('keydown', (event) => {
		if (event.key === 'Control') {
			keyHeld = true;
			
			doAction(true);
		}
	});
	
	target.addEventListener('keyup', (event) => {
		if (event.key === 'Control') {
			keyHeld = false;
			
			doAction(false);
		}
	});
	
	target.addEventListener('blur', () => {
		if (keyHeld) {
			keyHeld = false;
			
			doAction(false);
		}
	});
	
	return BUTTON;
}
