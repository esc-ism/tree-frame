import generateCloser from './close';
import generateLabelToggle from './labels';
import generateStyler from './style';
import generateHider from './hide';
import generateAltToggle from './alternate';
import generateCSS from './css';

import {BUTTON_CONTAINER_ID} from './consts';

export default function generate() {
	generateCSS();
	
	const element = document.createElement('span');
	
	element.id = BUTTON_CONTAINER_ID;
	
	element.append(generateAltToggle());
	element.append(generateHider());
	element.append(generateLabelToggle());
	element.append(generateStyler());
	element.append(generateCloser());
	
	return element;
}
