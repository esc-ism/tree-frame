import BUTTON from './button';
import {ACTION_ID, HOTKEY} from './consts';
import generateCSS from './css';

import {bindAction} from '../button';

import {ROOTS, setActive} from '@/modal/body';

let _isActive = false;

export function isActive() {
	return _isActive;
}

function doAction() {
	_isActive = !_isActive;
	
	setActive(BUTTON, ACTION_ID, _isActive);
}

export default function generate(): HTMLElement {
	generateCSS(Math.max(...Object.values(ROOTS).map(({height}) => height)));
	
	bindAction(BUTTON, doAction, HOTKEY);
	
	return BUTTON;
}
