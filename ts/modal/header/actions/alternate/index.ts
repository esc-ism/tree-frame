import BUTTON from './button';
import {ACTION_ID} from './consts';
import generateCSS from './css';

import {bindAction} from '../button';

import {setActive} from '@/modal/body/trees';

let _isActive = false;
let keyHeld = false;

export function isActive() {
	return _isActive;
}

function doAction(doActivate = !_isActive) {
	setActive(BUTTON, ACTION_ID, doActivate);
	
	_isActive = doActivate;
}

export default function generate() {
	generateCSS();
	
	bindAction(BUTTON, doAction);
	
	BUTTON.title += ' (Ctrl)';
	
	window.addEventListener('keydown', (event) => {
		if (event.key === 'Control') {
			keyHeld = true;
			
			doAction(true);
		}
	});
	
	window.addEventListener('keyup', (event) => {
		if (event.key === 'Control') {
			keyHeld = false;
			
			doAction(false);
		}
	});
	
	window.addEventListener('blur', () => {
		if (keyHeld) {
			doAction(false);
		}
	});
	
	return BUTTON;
}
