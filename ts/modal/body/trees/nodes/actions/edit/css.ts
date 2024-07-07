import {
	EDITABLE_CLASS, VALID_CLASS, INVALID_CLASS,
	VALID_BACKGROUND_CLASS, INVALID_BACKGROUND_CLASS,
	ACTIVE_CLASS,
} from './consts';

import {ELEMENT_CLASSES} from '@nodes/consts';

import {addRule} from '@/modal/css';

export default function generate() {
// Use pointer when the node has a value and isn't being edited
	addRule(`.${EDITABLE_CLASS} > .${ELEMENT_CLASSES.HEAD_CONTAINER}`, ['cursor', 'pointer']);
	
	addRule(`:not(.${ACTIVE_CLASS}) > .${ELEMENT_CLASSES.HEAD_CONTAINER} > .${ELEMENT_CLASSES.INFO_CONTAINER}`, ['pointer-events', 'none']);
	
	addRule(`.${ELEMENT_CLASSES.VALUE}`, [
		['flex-grow', '1'],
		['outline', 'none'],
	]);
	
	addRule(`.${ELEMENT_CLASSES.VALUE}[type="checkbox"]`, [
		['min-height', '1em'],
		['min-width', '1em'],
	]);
	
	addRule(`.${ELEMENT_CLASSES.VALUE}[type="color"]`, ['height', '1.3em']);
	
	addRule([`.${VALID_BACKGROUND_CLASS}`, `.${INVALID_BACKGROUND_CLASS}`], [
		['right', '0'],
		['width', '0'],
		['transition', 'width 500ms'],
	]);
	
	addRule(`.${VALID_BACKGROUND_CLASS}`, ['background-color', 'var(--validBackground)']);
	
	addRule(`.${INVALID_BACKGROUND_CLASS}`, ['background-color', 'var(--invalidBackground)']);
	
	addRule([
		`.${VALID_CLASS} > .${ELEMENT_CLASSES.HEAD_CONTAINER} .${VALID_BACKGROUND_CLASS}`,
		`.${INVALID_CLASS} > .${ELEMENT_CLASSES.HEAD_CONTAINER} .${INVALID_BACKGROUND_CLASS}`,
	], ['width', '100%']);
	
	addRule(
		`.${VALID_CLASS} > .${ELEMENT_CLASSES.HEAD_CONTAINER} .${ELEMENT_CLASSES.VALUE_CONTAINER}`,
		['color', 'var(--validFont) !important'],
	);
	
	addRule(
		`.${INVALID_CLASS} > .${ELEMENT_CLASSES.HEAD_CONTAINER} .${ELEMENT_CLASSES.VALUE_CONTAINER}`,
		['color', 'var(--invalidFont) !important'],
	);
}
