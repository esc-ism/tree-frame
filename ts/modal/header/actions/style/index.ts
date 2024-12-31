import BUTTON from './button';
import {ACTION_ID, HOTKEY} from './consts';
import generateCSS from './css';

import {bindAction} from '../button';

import {setActive, element as scrollElement} from '@/modal/body';

import {reset as resetFocus} from '@nodes/actions/focus';
import {reset as resetButtons} from '@nodes/actions/buttons/position';

let isActive = false;

function doAction() {
	isActive = !isActive;
	
	setActive(BUTTON, ACTION_ID, isActive);
	
	scrollElement.scrollTop = 0;
	
	resetFocus();
	resetButtons();
	
	// Reset tab index & highlight
	scrollElement.focus();
}

export default function generate(): HTMLElement {
	generateCSS();
	
	bindAction(BUTTON, doAction, HOTKEY);
	
	return BUTTON;
}
