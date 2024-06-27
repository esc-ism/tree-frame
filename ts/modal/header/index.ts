import {HEADER_ID} from './consts';
import generateTitle from './title';
import generateButtons from './actions';
import generateCSS from './css';

import {Config} from '@types';

export default function generate({title}: Config) {
	generateCSS();
	
	const element = document.createElement('div');
	
	element.id = HEADER_ID;
	
	element.appendChild(generateTitle(title));
	
	element.append(generateButtons());
	
	return element;
}
