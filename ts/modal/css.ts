import {MODAL_BACKGROUND_ID, MODAL_ID} from './consts';

type Selector = string;
export type Selectors = Selector | Array<Selector>;

type Style = [string, string];
export type Styles = Style | Array<Style>;

let targetWindow: Window = window;

while (targetWindow.frameElement) {
	targetWindow = window.parent;
}

export function getTargetWindow(): Window {
	return targetWindow;
}

let rootSelector = 'body';

export function setRootId(id: string) {
	rootSelector = `#${id}`;
}

export function generateStylesheet(): CSSStyleSheet {
	const wrapper = document.createElement('style');
	
	getTargetWindow().document.head.appendChild(wrapper);
	
	return wrapper.sheet;
}

const STYLESHEET = generateStylesheet();

function isStyle(candidate): candidate is Style {
	return candidate.length > 0 && typeof candidate[0] === 'string';
}

function getStyleString([property, value]): string {
	return `${property}:${value};`;
}

function getRuleStrings(styles: Styles): string {
	return isStyle(styles) ? getStyleString(styles) : styles.map(getStyleString).join('');
}

export function getRuleString(selectors: Selectors, styles: Styles) {
	const styleString = getRuleStrings(styles);
	const selectorString = typeof selectors === 'string' ? selectors : selectors.join(`,${rootSelector} `);
	
	return `${rootSelector} ${selectorString}{${styleString}}`;
}

export function addRule(selectors: Selectors, styles: Styles, stylesheet = STYLESHEET) {
	stylesheet.insertRule(getRuleString(selectors, styles));
}

export function addVariables(rules: Array<Style>, stylesheet = STYLESHEET) {
	const styleString = rules.map(getStyleString).join('');
	
	stylesheet.insertRule(`:root{${styleString}}`);
}

export default function generate() {
	addRule(`#${MODAL_BACKGROUND_ID}`, [
		['position', 'fixed'],
		['left', '0'],
		['top', '0'],
		['width', '100%'],
		['height', '100%'],
		
		['background-color', '#0003'],
		
		['display', 'flex'],
		['align-content', 'center'],
		['flex-wrap', 'wrap'],
		['justify-content', 'center'],
	]);
	
	addRule(`#${MODAL_ID}`, [
		['width', '80%'],
		['height', '80%'],
		
		['font-family', 'Tahoma, Geneva, sans-serif'],
		['outline', 'var(--borderModal) solid 2px'],
		['box-shadow', '1px 1px 10px 4px #00000015, 0 0 30px 10px #00000065'],
		
		['display', 'flex'],
		['flex-direction', 'column'],
		
		['position', 'relative'],
	]);
	
	addRule('button', [
		['display', 'inline-flex'],
		['cursor', 'pointer'],
		
		['background', 'none'],
		['font-size', 'inherit'],
		['padding', '0'],
		['margin', '0'],
		['border', 'none'],
		['outline-offset', '-2px'],
	]);
	
	addRule('button *', [['pointer-events', 'none']]);
	
	addRule('svg', [['fill', 'none']]);
	
	addRule('input', [
		['font', 'inherit'],
		['background', 'inherit'],
		['color', 'inherit'],
		['border', 'none'],
	]);
	
	addRule(':focus-visible:not(button):not(input)', [['outline', 'none']]);
	
	addRule('label', [['cursor', 'inherit']]);
}
