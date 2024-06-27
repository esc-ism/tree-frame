import generateEdit from './edit/css';
import generateOption from './edit/option/css';
import generateHighlight from './highlight/css';
import generateFocus from './focus/css';
import generateTooltip from './tooltip/css';
import generateButtons from './buttons/css';

export default function generate() {
	generateEdit();
	generateOption();
	generateHighlight();
	generateFocus();
	generateTooltip();
	generateButtons();
}
