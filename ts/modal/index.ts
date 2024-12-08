import {MODAL_BACKGROUND_ID, MODAL_ID} from './consts';
import generateCSS from './css';

import generateHeader from './header';
import generateBody from './body';

import {generateEave} from '@nodes/actions/highlight';

import {Page} from '@types';

let socket: HTMLElement;

export function getSocket(): HTMLElement {
	return socket;
}

export default function generate(config: Page, _socket: HTMLElement) {
	socket = _socket;
	
	generateCSS();
	
	const background = document.createElement('div');
	const foreground = document.createElement('div');
	
	background.id = MODAL_BACKGROUND_ID;
	
	foreground.id = MODAL_ID;
	
	background.append(foreground);
	socket.append(background);
	
	foreground.append(generateBody(config), generateEave());
	
	foreground.insertBefore(generateHeader(config, background), foreground.firstChild);
}
