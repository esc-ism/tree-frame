import BUTTON from './button';
import {ACTION_ID, HOTKEY} from './consts';
import generateCSS from './css';

import {bindAction} from '../button';

import {setActive} from '@/modal/body/trees';

import {reset as resetFocus} from '@nodes/actions/focus';
import {reset as resetEdit} from '@nodes/actions/edit';
import {reset as resetMove} from '@nodes/actions/buttons/move';

let isActive = false;

function doAction() {
	isActive = !isActive;
	
	setActive(BUTTON, ACTION_ID, isActive);
	
	resetFocus();
	resetEdit();
	resetMove();
	
	// Reset tab index
	document.body.focus();
}

export default function generate(): HTMLElement {
	generateCSS();
	
	bindAction(BUTTON, doAction, HOTKEY);
	
	return BUTTON;
}
