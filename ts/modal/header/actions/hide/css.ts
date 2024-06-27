import {ACTION_ID} from './consts';

import {addColourRule} from '../css';

import {addRule} from '@/modal/css';

import {TREE_CONTAINER_ID} from '@/modal/body/trees/consts';

import {DISABLED_CLASS} from '@nodes/actions/buttons/disable/consts';

export default function generate() {
	addRule(
		`#${TREE_CONTAINER_ID}:not(.${ACTION_ID}) .${DISABLED_CLASS}`,
		['display', 'none'],
	);
	
	addColourRule(ACTION_ID, '--headButtonHide');
}
