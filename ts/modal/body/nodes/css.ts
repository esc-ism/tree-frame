import {BASE_CLASS, ELEMENT_CLASSES, CHECKBOX_WRAPPER_CLASS, ROOT_CLASS} from './consts';

import {FOCUS_CLASS} from './actions/focus/consts';

import {addRule} from '@/modal/css';

export default function generate() {
	addRule(`.${ROOT_CLASS}`, [
		['flex-grow', '1'],
		// Apparently it has min-height 100% without a content-related height value
		['height', 'fit-content'],
	]);
	
	addRule([
		`.${ELEMENT_CLASSES.ELEMENT_CONTAINER}:not(.${ROOT_CLASS}):first-child`,
		`.${FOCUS_CLASS}:not(.${ROOT_CLASS})`,
	], ['margin-top', '0.6px']);
	
	addRule(`:not(.${ROOT_CLASS}) > .${ELEMENT_CLASSES.CHILD_CONTAINER}`, ['margin-left', '1.8em']);
	
	addRule(`.${ELEMENT_CLASSES.ELEMENT_CONTAINER}`, ['position', 'relative']);
	
	addRule(
		`.${ELEMENT_CLASSES.ELEMENT_CONTAINER} > :not(.${ELEMENT_CLASSES.CHILD_CONTAINER})`,
		['height', '1.6em'],
	);
	
	addRule(`.${ELEMENT_CLASSES.ELEMENT_CONTAINER}`, [['user-select', 'none']]);
	
	addRule([`.${ELEMENT_CLASSES.INFO_CONTAINER} > *`], [
		['position', 'absolute'],
		['width', '100%'],
		['height', '100%'],
	]);
	
	addRule([`.${ELEMENT_CLASSES.VALUE_CONTAINER}`, `.${ELEMENT_CLASSES.LABEL_CONTAINER}`], [
		['position', 'absolute'],
		['white-space', 'nowrap'],
	]);
	
	addRule(`.${ELEMENT_CLASSES.INFO_CONTAINER}`, [['position', 'relative']]);
	
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
	]);
	
	addRule(`.${ELEMENT_CLASSES.HEAD_CONTAINER} > *`, ['height', '100%']);
}
