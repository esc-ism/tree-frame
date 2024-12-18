import {reset as resetCreate} from './create';
import {reset as resetDuplicate} from './duplicate';
import {reset as resetMove} from './move';

export function reset() {
	resetCreate();
	resetDuplicate();
	resetMove();
}
