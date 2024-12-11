import {FOCUS_SOURCE_CLASS, FOCUS_CLASS, BACKGROUND_CLASS} from './consts';

import {ELEMENT_CLASSES, MIDDLE_CLASS, ROOT_CLASS} from '@nodes/consts';

import {addRule} from '@/modal/css';

export default function generate() {
	addRule(`.${ELEMENT_CLASSES.ELEMENT_CONTAINER}`, ['cursor', 'zoom-in']);
	
	addRule(`.${ELEMENT_CLASSES.ELEMENT_CONTAINER}.${FOCUS_SOURCE_CLASS}`, ['cursor', 'zoom-out']);
	
	addRule(
		`.${ROOT_CLASS}.${FOCUS_CLASS} .${ELEMENT_CLASSES.ELEMENT_CONTAINER}:not(.${FOCUS_CLASS}):not(.${FOCUS_SOURCE_CLASS} > .${ELEMENT_CLASSES.CHILD_CONTAINER} > *)`,
		['display', 'none'],
	);
	
	// Makes it easy to focus down the tree
	addRule(`.${FOCUS_SOURCE_CLASS} .${MIDDLE_CLASS} > .${ELEMENT_CLASSES.HEAD_CONTAINER}`, [['margin-left', '1.8em']]);
	
	addRule(`.${BACKGROUND_CLASS}`, ['background-color', 'var(--focusBackground)']);
	
	addRule(`.${BACKGROUND_CLASS}`, [
		['transition-property', 'width, padding-left'],
		['transition-duration', '500ms'],
		['right', '0'],
		['width', '0'],
		['padding-left', '0'],
	]);
	
	const headSelector = `.${FOCUS_SOURCE_CLASS}:not(:hover:not(:has(> .${ELEMENT_CLASSES.CHILD_CONTAINER}:hover))) > .${ELEMENT_CLASSES.HEAD_CONTAINER}:not(:focus):not(:hover)`;
	
	addRule(`${headSelector} .${BACKGROUND_CLASS}`, ['width', '100%']);
	
	addRule(`${headSelector} .${ELEMENT_CLASSES.BUTTON_CONTAINER}:not(:empty) + * .${BACKGROUND_CLASS}`, ['padding-left', '0.8em']);
}
