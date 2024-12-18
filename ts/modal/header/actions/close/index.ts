import BUTTON from './button';
import {HOTKEY} from './consts';
import generateCSS from './css';

import {bindAction} from '../button';

import {getSaveData} from '@/modal/body/data';
import {getUserStyles} from '@/modal/body/style';

import {reset as resetEdit} from '@nodes/actions/edit';
import {reset as resetButtons} from '@nodes/actions/buttons';
import {reset as resetHighlight} from '@nodes/actions/highlight';

let callback: Function;

export function setCallback(_callback: Function) {
	callback = _callback;
}

// TODO Maybe add a white, 0.5 opacity foreground over everything with a loading symbol.
//  Do the same when waiting for a config.
//  Prevent interaction during loading by adding a stopPropagation click listener to the foreground.
function doAction() {
	resetEdit();
	resetButtons();
	resetHighlight();
	
	callback?.({...getSaveData(), styles: getUserStyles()});
	
	callback = undefined;
}

export default function generate(background: HTMLElement): HTMLElement {
	generateCSS();
	
	bindAction(BUTTON, doAction, HOTKEY);
	
	background.addEventListener('click', (event) => {
		if (background.isSameNode(event.target as Node)) {
			doAction();
		}
	});
	
	return BUTTON;
}
