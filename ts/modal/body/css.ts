import {MODAL_BODY_ID} from './consts';

import generateNodeCSS from './nodes/css';
import generateActionCSS from './nodes/actions/css';

import {addRule} from '../css';

export default function generate() {
	generateNodeCSS();
	generateActionCSS();
	
	addRule(`#${MODAL_BODY_ID}`, [
		['overflow-y', 'auto'],
		['overflow-x', 'hidden'],
		['overscroll-behavior', 'contain'],
		['background-color', 'var(--nodeBase0)'],
		['flex-grow', '1'],
	]);
}
