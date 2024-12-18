import {
	BASE_CLASS, CHECKBOX_WRAPPER_CLASS, ROOT_CLASS, MIDDLE_CLASS,
	ELEMENT_CLASSES, NODE_COLOURS,
} from './consts';

import {NODE_HEIGHT, SUB_PIXEL_BS} from '@/modal/consts';

import {addRule} from '@/modal/css';

export default function generate() {
	addRule(`.${ROOT_CLASS}`, [
		['flex-grow', '1'],
		// Apparently it has min-height 100% without a content-related height value
		['height', 'fit-content'],
	]);
	
	addRule(`.${ELEMENT_CLASSES.CHILD_CONTAINER}:empty`, ['display', 'none']);
	
	addRule(`:not(.${ROOT_CLASS}) > .${ELEMENT_CLASSES.CHILD_CONTAINER}`, ['margin-left', '1.8em']);
	
	addRule(`.${ELEMENT_CLASSES.ELEMENT_CONTAINER}`, [
		['user-select', 'none'],
		['position', 'relative'],
		['border-width', `${SUB_PIXEL_BS}px`],
	]);
	
	addRule([`.${ELEMENT_CLASSES.INFO_CONTAINER} > *`], [
		['position', 'absolute'],
		['width', '100%'],
		['height', '100%'],
	]);
	
	addRule([`.${ELEMENT_CLASSES.VALUE_CONTAINER}`, `.${ELEMENT_CLASSES.LABEL_CONTAINER}`], [
		['position', 'absolute'],
		['white-space', 'nowrap'],
	]);
	
	addRule(`.${ELEMENT_CLASSES.INFO_CONTAINER}`, ['position', 'relative']);
	
	addRule([`.${BASE_CLASS} > .${ELEMENT_CLASSES.VALUE_CONTAINER}`], [
		['position', 'absolute'],
		['right', '0'],
		['overflow', 'hidden'],
	]);
	
	addRule([
		`.${ELEMENT_CLASSES.HEAD_CONTAINER}`,
		`.${ELEMENT_CLASSES.VALUE_CONTAINER}`,
		`.${ELEMENT_CLASSES.LABEL_CONTAINER}`,
		`.${ELEMENT_CLASSES.BACKGROUND_CONTAINER}`,
		`.${ELEMENT_CLASSES.INFO_CONTAINER}`,
	], [
		['flex-grow', '1'],
		['display', 'flex'],
		['align-items', 'center'],
	]);
	
	addRule([`.${ELEMENT_CLASSES.BACKGROUND_CONTAINER}`], [['position', 'absolute']]);
	
	addRule(`.${ELEMENT_CLASSES.LABEL_CONTAINER}`, [
		['right', '0'],
		['pointer-events', 'none'],
		['height', '100%'],
	]);
	
	addRule(`.${ELEMENT_CLASSES.VALUE_CONTAINER}`, [
		['user-select', 'none'],
		['height', '100%'],
	]);
	
	addRule([`.${ELEMENT_CLASSES.BACKGROUND_CONTAINER}`, `.${ELEMENT_CLASSES.VALUE_CONTAINER}`], [['width', '100%']]);
	
	addRule(`.${ELEMENT_CLASSES.BACKGROUND_CONTAINER} > *`, [
		['height', '100%'],
		['position', 'absolute'],
	]);
	
	addRule([`.${ELEMENT_CLASSES.VALUE}`, `.${CHECKBOX_WRAPPER_CLASS}`], [
		['padding-right', '0.6em'],
		['padding-left', '0.6em'],
	]);
	
	addRule(`.${ELEMENT_CLASSES.HEAD_CONTAINER}`, [
		['background-color', 'inherit'],
		['user-select', 'none'],
		['height', `${NODE_HEIGHT}em`],
	]);
	
	addRule(`.${ELEMENT_CLASSES.HEAD_CONTAINER} > *`, ['height', '100%']);
	
	addRule(`.${ELEMENT_CLASSES.ELEMENT_CONTAINER}:not(.${ROOT_CLASS})`, ['border-top-style', 'solid']);
	addRule(`.${MIDDLE_CLASS} .${ELEMENT_CLASSES.ELEMENT_CONTAINER}`, ['border-left-style', 'solid']);
	addRule(`.${ROOT_CLASS}`, ['border-bottom-style', 'solid']);
	
	for (const [selector, base, contrast] of NODE_COLOURS) {
		addRule(selector, [
			['background-color', base],
			['color', contrast],
		]);
		
		addRule(`${selector}`, ['border-color', contrast]);
		
		addRule(`${selector} > .${ELEMENT_CLASSES.HEAD_CONTAINER}`, ['outline', `1px solid ${contrast}`]);
	}
}
