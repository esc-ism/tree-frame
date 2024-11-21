import {MODAL_BACKGROUND_ID, MODAL_ID} from './consts';
import {getSocket} from './index';

type Selector = string;
export type Selectors = Selector | Array<Selector>;

type Style = [string, string];
export type Styles = Style | Array<Style>;

const styleNode = document.createElement('style');

const undockedStyleNodes: Array<HTMLStyleElement> = [styleNode];

export function registerStyleNode(node: HTMLStyleElement) {
	undockedStyleNodes.push(node);
}

function mountStyleNodes() {
	const {head} = getSocket().ownerDocument;
	
	for (const node of undockedStyleNodes) {
		head.appendChild(node);
	}
}

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
	const selectorString = typeof selectors === 'string' ? selectors : selectors.join(',');
	
	return `${selectorString}{${styleString}}`;
}

export function addRule(selectors: Selectors, styles: Styles, stylesheet = styleNode.sheet) {
	stylesheet.insertRule(getRuleString(selectors, styles));
}

export function addVariables(rules: Array<Style>, stylesheet = styleNode.sheet) {
	const styleString = rules.map(getStyleString).join('');
	
	stylesheet.insertRule(`:root{${styleString}}`);
}

export default function generate() {
	mountStyleNodes();
	
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
