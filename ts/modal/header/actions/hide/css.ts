import {ACTION_ID} from './consts';

import {addColourRule} from '../css';

import {addRule} from '@/modal/css';

import {MODAL_BODY_ID} from '@/modal/body/consts';

import {DISABLED_CLASS} from '@nodes/actions/buttons/disable/consts';

export default function generate() {
	addRule(
		`#${MODAL_BODY_ID}:not(.${ACTION_ID}) .${DISABLED_CLASS}`,
		['display', 'none'],
	);
	
	addColourRule(ACTION_ID, '--headButtonHide');
}
