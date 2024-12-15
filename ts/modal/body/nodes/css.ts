import {BASE_CLASS, ELEMENT_CLASSES, CHECKBOX_WRAPPER_CLASS, ROOT_CLASS} from './consts';

import {FOCUS_SOURCE_CLASS} from './actions/focus/consts';
import {CLASS_PREFIX_READ, CLASS_PREFIX_WRITE} from './actions/hide/consts';
import {DISABLED_CLASS} from './actions/buttons/disable/consts';

import {ACTION_ID as CLASS_DISABLED_HIDE} from '@/modal/header/actions/hide/consts';

import {addRule} from '@/modal/css';

function getHideIdSet(node, set = new Set()) {
	if ('hideId' in node) {
		set.add(node.hideId);
	}
	
	if ('seed' in node) {
		getHideIdSet(node.seed, set);
		
		if (!('poolId' in node)) {
			return set;
		}
	}
	
	if ('children' in node) {
		for (const child of node.children) {
			getHideIdSet(child, set);
		}
	}
	
	return set;
}

export function generateHiddenCSS(roots) {
	for (const [id, root] of Object.entries(roots)) {
		let visibleChildSelector = `:not(.${DISABLED_CLASS}:not(.${CLASS_DISABLED_HIDE} *))`;
		
		for (const hideId of getHideIdSet(root).values()) {
			visibleChildSelector += `:not(.${CLASS_PREFIX_WRITE}${hideId} .${CLASS_PREFIX_READ}${hideId})`;
		}
		
		addRule(`#${id} .${ELEMENT_CLASSES.CHILD_CONTAINER}:not(.${FOCUS_SOURCE_CLASS} > * *):has(> ${visibleChildSelector})`, ['margin-top', '0.6px']);
	}
}

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
		['height', '1.6em'],
	]);
	
	addRule(`.${ELEMENT_CLASSES.HEAD_CONTAINER} > *`, ['height', '100%']);
}
