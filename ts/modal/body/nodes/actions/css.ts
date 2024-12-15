import generateEdit from './edit/css';
import generateHighlight from './highlight/css';
import generateFocus from './focus/css';
import generateOverlays from './overlays/css';
import generateButtons from './buttons/css';

export default function generate() {
	generateEdit();
	generateHighlight();
	generateFocus();
	generateOverlays();
	generateButtons();
}
