import BUTTON from './button';
import {ACTION_ID, HOTKEY} from './consts';

import {bindAction} from '../button';

import {setActive} from '@/modal/body';

let _isActive = false;

export function isActive() {
	return _isActive;
}

function doAction() {
	_isActive = !_isActive;
	
	setActive(BUTTON, ACTION_ID, _isActive);
}

export default function generate(): HTMLElement {
	bindAction(BUTTON, doAction, HOTKEY);
	
	BUTTON.click();
	
	return BUTTON;
}
