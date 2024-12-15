import {
	TOOLTIP_BOX_CLASS, TOOLTIP_ARROW_CLASS, TOOLTIP_CONTAINER_CLASS,
	TOOLTIP_TOP_CLASS, TOOLTIP_BOTTOM_CLASS, TOOLTIP_REVERSE_CLASS,
} from './consts';

import {NODE_COLOURS} from '@nodes/consts';

import {addRule} from '@/modal/css';
import {DROPDOWN_WRAPPER_CLASS} from '../dropdown/consts';

export default function generate() {
	addRule(`.${TOOLTIP_CONTAINER_CLASS}`, [
		['position', 'sticky'],
		['text-align', 'center'],
		['display', 'flex'],
		['flex-direction', 'column'],
		['align-items', 'center'],
		['width', '10em'],
	]);
	
	addRule([
		`.${TOOLTIP_TOP_CLASS}:not(.${TOOLTIP_REVERSE_CLASS}) .${TOOLTIP_ARROW_CLASS}`,
		`.${TOOLTIP_BOTTOM_CLASS}.${TOOLTIP_REVERSE_CLASS} .${TOOLTIP_ARROW_CLASS}`,
		`.${DROPDOWN_WRAPPER_CLASS} + * > .${TOOLTIP_ARROW_CLASS}`,
	], [
		['top', '100%'],
		['border-color', 'var(--borderTooltip) transparent transparent transparent'],
	]);
	
	addRule([
		`.${TOOLTIP_BOTTOM_CLASS}:not(.${TOOLTIP_REVERSE_CLASS}):not(:has(.${DROPDOWN_WRAPPER_CLASS})) .${TOOLTIP_ARROW_CLASS}`,
		`.${TOOLTIP_TOP_CLASS}.${TOOLTIP_REVERSE_CLASS}:not(:has(.${DROPDOWN_WRAPPER_CLASS})) .${TOOLTIP_ARROW_CLASS}`,
	], [
		['bottom', '100%'],
		['border-color', 'transparent transparent var(--borderTooltip) transparent'],
	]);
	
	addRule([
		`.${TOOLTIP_TOP_CLASS}:not(.${TOOLTIP_REVERSE_CLASS}) .${TOOLTIP_CONTAINER_CLASS}`,
		`.${TOOLTIP_BOTTOM_CLASS}.${TOOLTIP_REVERSE_CLASS} .${TOOLTIP_CONTAINER_CLASS}`,
	], ['translate', '0 -0.5em']);
	addRule([`.${DROPDOWN_WRAPPER_CLASS} + .${TOOLTIP_CONTAINER_CLASS}`], ['translate', '0px calc(-100% - 0.5em)']);
	
	addRule([
		`.${TOOLTIP_BOTTOM_CLASS}:not(.${TOOLTIP_REVERSE_CLASS}):not(:has(.${DROPDOWN_WRAPPER_CLASS})) .${TOOLTIP_CONTAINER_CLASS}`,
		`.${TOOLTIP_TOP_CLASS}.${TOOLTIP_REVERSE_CLASS}:not(:has(.${DROPDOWN_WRAPPER_CLASS})) .${TOOLTIP_CONTAINER_CLASS}`,
	], [['translate', '0 0.5em']]);
	
	addRule(`.${TOOLTIP_BOX_CLASS}`, [
		['font-size', '0.9em'],
		['padding', '3px 15px'],
		['border-radius', '1em'],
		['border', 'solid 3px var(--borderTooltip)'],
		['background-color', NODE_COLOURS[1][1]],
		['color', NODE_COLOURS[1][2]],
		['position', 'relative'],
	]);
	
	// Don't show when there's no hint to give
	addRule(
		[`:has(> .${TOOLTIP_BOX_CLASS}:empty)`],
		['display', 'none'],
	);
	
	addRule(`.${TOOLTIP_ARROW_CLASS}`, [
		['position', 'absolute'],
		['left', '50%'],
		['margin-left', '-0.5em'],
		['border-width', '0.5em'],
		['border-style', 'solid'],
	]);
}
