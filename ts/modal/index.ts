import {MODAL_BACKGROUND_ID, MODAL_ID} from './consts';
import generateCSS from './css';

import generateHeader from './header';
import generateBody from './body';

import {generateEave} from '@nodes/actions/highlight';

import {Page} from '@types';

let socket: HTMLElement;
let ownerDocument: Document;
let ownerWindow: Window;

export function getSocket(): HTMLElement {
	return socket;
}

export function getDocument(): Document {
	return ownerDocument;
}

export function getWindow(): Window {
	return ownerWindow;
}

export default function generate(config: Page, _socket: HTMLElement, _window: Window) {
	socket = _socket;
	ownerDocument = socket.ownerDocument;
	ownerWindow = _window;
	
	generateCSS();
	
	const background = document.createElement('div');
	const foreground = document.createElement('div');
	
	background.id = MODAL_BACKGROUND_ID;
	
	foreground.id = MODAL_ID;
	
	background.append(foreground);
	socket.append(background);
	
	foreground.append(generateHeader(config, background), generateBody(config), generateEave(socket));
}
