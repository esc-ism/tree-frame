import {MODAL_BODY_ID} from './consts';

import {addRule} from '../css';

export default function generate() {
	addRule(`#${MODAL_BODY_ID}`, ['position', 'relative']);
}
