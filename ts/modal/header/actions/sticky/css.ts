import {ACTION_ID} from './consts';
import {ACTION_ID as STYLE_ACTION_ID} from '../style/consts';

import {addColourRule} from '../css';

import {addRule, addVariables} from '@/modal/css';

import {ROOT_ID as DATA_ID} from '@/modal/body/data/consts';
import {ROOT_ID as STYLE_ID} from '@/modal/body/style/consts';
import {MODAL_BODY_ID} from '@/modal/body/consts';

import {ELEMENT_CLASSES} from '@nodes/consts';
import {FOCUS_SOURCE_CLASS, FOCUS_CLASS} from '@nodes/actions/focus/consts';

import {NODE_HEIGHT, SUB_PIXEL_BS} from '@/modal/consts';

import type {Root as _ROOT, Middle as _MIDDLE, Leaf as _LEAF} from '@types';

function _getHeight(node: _ROOT | _MIDDLE | _LEAF, pools, depth = 0) {
	if ('poolId' in node) {
		if (!pools[node.poolId]) {
			pools[node.poolId] = [depth, 1];
		} else {
			pools[node.poolId][0] = Math.max(pools[node.poolId][0], depth);
		}
		
		pools[node.poolId][1] = [...node.children, ...('seed' in node ? [node.seed] : [])]
			.reduce((height, child) => Math.max(_getHeight(child, pools, 1), height), pools[node.poolId][1]);
		
		return 0;
	}
	
	if ('seed' in node) {
		return _getHeight(node.seed, pools, depth + 1);
	}
	
	if ('children' in node) {
		return node.children.reduce((height, child) => Math.max(_getHeight(child, pools, depth + 1), height), depth + 1);
	}
	
	return depth;
}

function getHeight(node: _ROOT | _MIDDLE | _LEAF): number {
	const pools = [];
	const height = _getHeight(node, pools);
	
	return pools.reduce((max, [poolDepth, poolHeight]) => Math.max(max, poolDepth + poolHeight), height);
}

export default function generate(roots) {
	const heights = {
		[DATA_ID]: getHeight(roots[DATA_ID]),
		[STYLE_ID]: getHeight(roots[STYLE_ID]),
	};
	
	const maxHeight = Math.max(heights[DATA_ID], heights[STYLE_ID]);
	
	addVariables([['--overlayIndex', `${maxHeight + 1}`]]);
	
	addColourRule(ACTION_ID, '--headButtonSticky');
	
	let nodeSelector = `#${MODAL_BODY_ID}.${ACTION_ID} > .${ELEMENT_CLASSES.ELEMENT_CONTAINER}`;
	
	for (let depth = 0; depth <= maxHeight; ++depth) {
		addRule(`${nodeSelector} > .${ELEMENT_CLASSES.HEAD_CONTAINER}`, [
			['position', 'sticky'],
			['top', `calc(${depth * NODE_HEIGHT}em + ${depth * SUB_PIXEL_BS}px)`],
			['z-index', `${maxHeight - depth}`],
		]);
		
		nodeSelector += ` > .${ELEMENT_CLASSES.CHILD_CONTAINER} > .${ELEMENT_CLASSES.ELEMENT_CONTAINER}`;
	}
	
	addRule(`#${MODAL_BODY_ID}.${ACTION_ID}::after`, [
		['content', '\'\''],
		['display', 'block'],
		['visibility', 'hidden'],
	]);
	
	const selectors = {
		basic: {
			[DATA_ID]: `#${MODAL_BODY_ID}.${ACTION_ID}:has(> #${DATA_ID}:not(.${FOCUS_CLASS}) > .${ELEMENT_CLASSES.CHILD_CONTAINER}`,
			[STYLE_ID]: `#${MODAL_BODY_ID}.${ACTION_ID}.${STYLE_ACTION_ID}:has(> #${STYLE_ID}:not(.${FOCUS_CLASS}) > .${ELEMENT_CLASSES.CHILD_CONTAINER}`,
		},
		focus: {
			[DATA_ID]: `#${MODAL_BODY_ID}.${ACTION_ID}:has(> #${DATA_ID}.${FOCUS_CLASS}`,
			[STYLE_ID]: `#${MODAL_BODY_ID}.${ACTION_ID}.${STYLE_ACTION_ID}:has(> #${STYLE_ID}.${FOCUS_CLASS}`,
		},
	};
	
	for (const [id, height] of Object.entries(heights)) {
		for (let depth = 1; depth <= height + 1; ++depth) {
			addRule(`${selectors.basic[id]}:empty)::after`, ['height', `calc(100% - ${(depth) * SUB_PIXEL_BS}px - ${depth * NODE_HEIGHT}em)`]);
			addRule(`${selectors.focus[id]}.${FOCUS_SOURCE_CLASS})::after`, ['height', `calc(100% - ${(depth + 1) * SUB_PIXEL_BS}px - ${(depth + 1) * NODE_HEIGHT}em)`]);
			
			selectors.basic[id] += ` > :last-child > .${ELEMENT_CLASSES.CHILD_CONTAINER}`;
			selectors.focus[id] += ` > .${ELEMENT_CLASSES.CHILD_CONTAINER} > *`;
		}
	}
}
