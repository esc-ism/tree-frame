import {HEADER_ID} from './consts';
import generateTitle from './title';
import generateButtons from './actions';
import generateCSS from './css';

import {Page} from '@types';

export default function generate({title}: Page, background: HTMLElement): HTMLElement {
	generateCSS();
	
	const element = document.createElement('div');
	
	element.id = HEADER_ID;
	
	element.append(generateTitle(title), generateButtons(background));
	
	return element;
}
