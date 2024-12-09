import {
	TOOLTIP_CLASS, TOOLTIP_CONTAINER_CLASS,
	TOOLTIP_TOP_CLASS, TOOLTIP_BOTTOM_CLASS,
	TOOLTIP_REVERSE_CLASS,
} from './consts';

import {ELEMENT_CLASSES, NODE_COLOURS} from '@nodes/consts';

import {addRule} from '@/modal/css';

export default function generate() {
	addRule(`.${ELEMENT_CLASSES.VALUE_CONTAINER}`, [['position', 'relative']]);
	
	addRule(`.${TOOLTIP_CONTAINER_CLASS}`, [
		['position', 'absolute'],
		['text-align', 'center'],
		['padding', '0'],
		['z-index', 'var(--overlayIndex)'],
		['width', '100%'],
		['pointer-events', 'none'],
		['white-space', 'normal'],
	]);
	
	addRule([
		`:not(.${TOOLTIP_REVERSE_CLASS}).${TOOLTIP_CONTAINER_CLASS}.${TOOLTIP_TOP_CLASS}`,
		`.${TOOLTIP_REVERSE_CLASS}.${TOOLTIP_CONTAINER_CLASS}.${TOOLTIP_BOTTOM_CLASS}`,
	], ['bottom', '102%']);
	addRule([
		`:not(.${TOOLTIP_REVERSE_CLASS}).${TOOLTIP_CONTAINER_CLASS}.${TOOLTIP_BOTTOM_CLASS}`,
		`.${TOOLTIP_REVERSE_CLASS}.${TOOLTIP_CONTAINER_CLASS}.${TOOLTIP_TOP_CLASS}`,
	], ['top', '102%']);
	
	addRule(`.${TOOLTIP_CLASS}`, [
		['margin', '0 auto'],
		['font-size', '0.9em'],
		['padding', '3px 8px'],
		['border-radius', '1em'],
		['width', '10em'],
		['outline', 'solid 3px var(--borderTooltip)'],
	]);
	
	for (const [selector, base, contrast] of NODE_COLOURS) {
		addRule(`${selector} > :not(.${ELEMENT_CLASSES.CHILD_CONTAINER}) .${TOOLTIP_CLASS}`, [
			['background-color', base],
			['color', contrast],
		]);
	}
	
	// Don't show when there's no hint to give
	addRule(
		[`.${TOOLTIP_CLASS}:empty`],
		['display', 'none'],
	);
	
	addRule(`.${TOOLTIP_CLASS}::after`, [
		['content', '""'],
		['position', 'absolute'],
		['left', '50%'],
		['margin-left', '-0.5em'],
		['border-width', '0.5em'],
		['border-style', 'solid'],
	]);
	
	addRule([
		`:not(.${TOOLTIP_REVERSE_CLASS}).${TOOLTIP_TOP_CLASS} > .${TOOLTIP_CLASS}::after`,
		`.${TOOLTIP_REVERSE_CLASS}.${TOOLTIP_BOTTOM_CLASS} > .${TOOLTIP_CLASS}::after`,
	], [
		['top', '100%'],
		['border-color', 'var(--borderTooltip) transparent transparent transparent'],
	]);
	
	addRule([
		`:not(.${TOOLTIP_REVERSE_CLASS}).${TOOLTIP_BOTTOM_CLASS} > .${TOOLTIP_CLASS}::after`,
		`.${TOOLTIP_REVERSE_CLASS}.${TOOLTIP_TOP_CLASS} > .${TOOLTIP_CLASS}::after`,
	], [
		['bottom', '100%'],
		['border-color', 'transparent transparent var(--borderTooltip) transparent'],
	]);
}
