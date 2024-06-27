import * as edit from './edit';
import * as highlight from './highlight';
import * as focus from './focus';
import * as position from './buttons/position';

window.addEventListener('keydown', (event) => {
	if (event.key === 'Escape') {
		for (const action of [edit, position, focus, highlight]) {
			if (action.isActive()) {
				action.reset();
				
				return;
			}
		}
	}
});

export function register() {
	edit.reset();
}
