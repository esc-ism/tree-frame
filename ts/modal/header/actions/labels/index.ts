import BUTTON from './button';
import {ACTION_ID, HOTKEY} from './consts';
import generateCSS from './css';

import {bindAction} from '../button';

import {setActive} from '@/modal/body';

let isActive = false;

function doAction() {
	isActive = !isActive;
	
	setActive(BUTTON, ACTION_ID, isActive);
}

export default function generate(): HTMLElement {
	generateCSS();
	
	bindAction(BUTTON, doAction, HOTKEY);
	
	BUTTON.click();
	
	return BUTTON;
}
