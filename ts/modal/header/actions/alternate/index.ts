import BUTTON from './button';
import {ACTION_ID} from './consts';
import generateCSS from './css';

import {bindAction} from '../button';

import {setActive} from '@/modal/body';

import {getDocument, getWindow} from '@/modal';

let _isActive = false;
let toggledOn = false;

export function isActive() {
	return _isActive;
}

export function doAction(doActivate = !_isActive) {
	setActive(BUTTON, ACTION_ID, doActivate);
	
	_isActive = doActivate;
}

export default function generate(): HTMLElement {
	generateCSS();
	
	bindAction(BUTTON, () => {
		toggledOn = !toggledOn;
		
		doAction(toggledOn);
	});
	
	BUTTON.title += ' (Ctrl)';
	
	const target = getDocument();
	
	target.addEventListener('keydown', (event) => {
		if (event.key === 'Control' && !toggledOn) {
			doAction(true);
		}
	});
	
	target.addEventListener('keyup', (event) => {
		if (event.key === 'Control' && !toggledOn) {
			doAction(false);
		}
	});
	
	getWindow().addEventListener('blur', () => {
		if (!toggledOn) {
			doAction(false);
		}
	});
	
	return BUTTON;
}
