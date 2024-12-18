import {EAVE_ID, HIGHLIGHT_BACKGROUND_CLASS, HIGHLIGHT_CLASS} from './consts';

import {BUTTON_CLASS, TEST_ADD_CLASS, TEST_REMOVE_CLASS} from '../buttons/consts';

import {ELEMENT_CLASSES, BASE_CLASS, CONTRAST_CLASS, NODE_COLOURS} from '@nodes/consts';

import {addRule} from '@/modal/css';

export default function generate() {
	addRule(`.${ELEMENT_CLASSES.LABEL_CONTAINER}`, [
		['padding-right', '0.4em'],
		// Extend the background further into the value
		['padding-left', '4em'],
	]);
	
	addRule(`.${BUTTON_CLASS}:last-child`, [
		['border-top-right-radius', '0.8em'],
		['border-bottom-right-radius', '0.8em'],
	]);
	
	addRule([`.${BASE_CLASS}`], [
		['transition-property', 'width'],
		['transition-duration', '500ms'],
		['overflow', 'hidden'],
		['right', '0'],
	]);
	
	addRule([
		`.${HIGHLIGHT_CLASS} > .${ELEMENT_CLASSES.HEAD_CONTAINER} .${BASE_CLASS}`,
		`.${TEST_ADD_CLASS} .${BASE_CLASS}`,
		`.${TEST_REMOVE_CLASS} .${BASE_CLASS}`,
	], [['width', '0']]);
	
	addRule(`.${ELEMENT_CLASSES.BUTTON_CONTAINER}:not(:empty) + * .${ELEMENT_CLASSES.BACKGROUND_CONTAINER} > *`, [['margin-left', '-0.8em']]);
	
	addRule(`.${HIGHLIGHT_BACKGROUND_CLASS}`, [
		['transition-property', 'width, padding-left'],
		['transition-duration', '500ms'],
		['width', '100%'],
	]);
	
	addRule(`:not(.${HIGHLIGHT_CLASS}) > .${ELEMENT_CLASSES.HEAD_CONTAINER} > .${ELEMENT_CLASSES.BUTTON_CONTAINER}:not(:empty):not(.${TEST_ADD_CLASS} *):not(.${TEST_REMOVE_CLASS} *) + * .${ELEMENT_CLASSES.BACKGROUND_CONTAINER} > .${HIGHLIGHT_BACKGROUND_CLASS}`, [['width', '0']]);
	
	addRule([
		`.${HIGHLIGHT_CLASS} > .${ELEMENT_CLASSES.HEAD_CONTAINER} > .${ELEMENT_CLASSES.BUTTON_CONTAINER}:not(:empty) + * .${HIGHLIGHT_BACKGROUND_CLASS}`,
		`.${TEST_ADD_CLASS} .${ELEMENT_CLASSES.BUTTON_CONTAINER}:not(:empty) + * .${HIGHLIGHT_BACKGROUND_CLASS}`,
		`.${TEST_REMOVE_CLASS} .${ELEMENT_CLASSES.BUTTON_CONTAINER}:not(:empty) + * .${HIGHLIGHT_BACKGROUND_CLASS}`,
	], [['padding-left', '0.8em']]);
	
	addRule(`.${HIGHLIGHT_BACKGROUND_CLASS}`, [
		['height', '100%'],
		['width', '100%'],
		['padding-left', '0'],
	]);
	
	for (const [selector, base, contrast] of NODE_COLOURS) {
		const headSelector = `${selector} > .${ELEMENT_CLASSES.HEAD_CONTAINER}`;
		
		addRule(
			`${headSelector} .${HIGHLIGHT_BACKGROUND_CLASS}`,
			['background-color', contrast],
		);
		
		addRule(
			`${headSelector} .${BUTTON_CLASS}`,
			['background-color', contrast],
		);
		
		addRule([`${headSelector} .${BASE_CLASS}`], [
			['color', contrast],
			['background-color', base],
		]);
		
		addRule([`${headSelector} .${CONTRAST_CLASS}`], ['color', base]);
		
		addRule(`${headSelector} .${BASE_CLASS} > .${ELEMENT_CLASSES.LABEL_CONTAINER}`, ['background-image', `linear-gradient(to right, transparent, 1.9em, ${base} 3.8em)`]);
		
		addRule(`${headSelector} .${CONTRAST_CLASS} > .${ELEMENT_CLASSES.LABEL_CONTAINER}`, ['background-image', `linear-gradient(to right, transparent, 1.9em, ${contrast} 3.8em)`]);
	}
	
	addRule(`#${EAVE_ID}`, [
		['position', 'absolute'],
		['bottom', '0'],
		['width', '100%'],
		// Prevents zipping to the end of the tree when mousing over the bottom pixel
		['height', '1px'],
		['z-index', 'var(--overlayIndex)'],
	]);
}
