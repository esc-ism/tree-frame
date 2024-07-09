import generateCloser from './close';
import generateLabelToggle from './labels';
import generateStyler from './style';
import generateHider from './hide';
import generateAltToggle from './alternate';
import generateCSS from './css';

import {BUTTON_CONTAINER_ID} from './consts';

export default function generate(background: HTMLElement): HTMLElement {
	generateCSS();
	
	const element = document.createElement('span');
	
	element.id = BUTTON_CONTAINER_ID;
	
	element.append(
		generateCloser(background),
		generateStyler(),
		generateLabelToggle(),
		generateHider(),
		generateAltToggle(),
	);
	
	return element;
}
