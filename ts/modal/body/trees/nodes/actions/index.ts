import * as edit from './edit';
import * as move from './move';
import * as highlight from './highlight';
import * as focus from './focus';

window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        for (const action of [edit, move, focus, highlight]) {
            if (action.isActive()) {
                action.reset();

                return;
            }
        }
    }
});
